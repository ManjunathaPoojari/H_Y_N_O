import React, { useEffect, useRef, useState } from 'react'; 
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { VideoCall as VideoCallType, VideoCallState } from '../../types';
import { websocketClient } from '../../lib/websocket-client';
import { toast } from 'sonner';

interface VideoCallProps {
  callId?: string;
  appointmentId?: string;
  onEndCall?: () => void;
  onMinimize?: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  callId,
  appointmentId,
  onEndCall,
  onMinimize
}) => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<VideoCallState>({
    isInCall: false,
    isMuted: false,
    isVideoEnabled: true,
    callDuration: 0,
    connectionQuality: 'good'
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [waitingPatient, setWaitingPatient] = useState<{id: string, name: string} | null>(null);
  const [admittedPatient, setAdmittedPatient] = useState<{id: string, name: string} | null>(null);
  const [waitingForAdmission, setWaitingForAdmission] = useState(false);
  const [doctorCallStarted, setDoctorCallStarted] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [admittingPatient, setAdmittingPatient] = useState(false);
  const [webSocketStatus, setWebSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // Update remote video element when remote stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Initialize WebRTC peer connection
  useEffect(() => {
    const initPeerConnection = async () => {
      try {
        // Check if media devices are supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Media devices not supported');
        }

        // Request user media permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const configuration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        };

        peerConnectionRef.current = new RTCPeerConnection(configuration);

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          peerConnectionRef.current!.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnectionRef.current.ontrack = (event) => {
          if (event.streams[0]) {
            setRemoteStream(event.streams[0]);
          }
        };

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate && event.candidate.candidate && appointmentId && user?.id) {
            // Send ICE candidate to signaling server
            websocketClient.sendIceCandidate(appointmentId, {
              fromUserId: user.id,
              candidate: event.candidate.candidate
            });
          }
        };

        // Handle connection state changes
        peerConnectionRef.current.onconnectionstatechange = () => {
          console.log('Connection state:', peerConnectionRef.current?.connectionState);
        };

        setCallState(prev => ({ ...prev, isInCall: true }));

        // Start call duration timer
        callDurationIntervalRef.current = setInterval(() => {
          setCallState(prev => ({
            ...prev,
            callDuration: prev.callDuration + 1
          }));
        }, 1000);

      } catch (error) {
        console.error('Error initializing video call:', error);
        // Set error state instead of crashing
        setCallState(prev => ({ ...prev, isInCall: false }));
        // Don't throw error to prevent navigation issues
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            toast.error('Camera and microphone permissions are required for video calls. Please allow access and try again.');
          } else if (error.name === 'NotFoundError') {
            toast.error('No camera or microphone found. Please check your device settings.');
          } else {
            toast.error('Failed to start video call. Please try again.');
          }
        }
      }
    };

    if (appointmentId) {
      // Determine if user is doctor
      setIsDoctor(user?.role === 'doctor');

      // Connect WebSocket and subscribe to video call signals
      websocketClient.setOnConnectionChange((connected) => {
        setIsWebSocketConnected(connected);
        setWebSocketStatus(connected ? 'connected' : 'disconnected');
      });
      websocketClient.connect();
      websocketClient.setOnVideoCallSignal(handleVideoCallSignal);
      websocketClient.subscribeToVideoCall(appointmentId);

      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        initPeerConnection();
      }, 100);

      // If user is not doctor (patient), join the call immediately
      if (user?.role !== 'doctor') {
        setTimeout(() => {
          joinCall();
        }, 200);
      } else {
        // For doctors, set initial state to show they are ready
        setDoctorCallStarted(true);
      }
    }

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (callDurationIntervalRef.current) {
        clearInterval(callDurationIntervalRef.current);
      }
      websocketClient.disconnect();
    };
  }, [appointmentId, user?.id, user?.role]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = callState.isMuted;
      });
      setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !callState.isVideoEnabled;
      });
      setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
    }
  };

  const endCall = () => {
    // Send leave signal before ending call
    if (appointmentId && user?.id) {
      websocketClient.leaveVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
      });
    }

    // Cleanup streams and connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
    }

    setCallState({
      isInCall: false,
      isMuted: false,
      isVideoEnabled: true,
      callDuration: 0,
      connectionQuality: 'good'
    });

    setWaitingPatient(null);
    setAdmittedPatient(null);
    setWaitingForAdmission(false);
    setRemoteStream(null);

    onEndCall?.();
  };

  const handleVideoCallSignal = async (signal: any, signalAppointmentId: string) => {
    if (signalAppointmentId !== appointmentId || !user?.id) return;

    try {
      switch (signal.type) {
        case 'join':
          console.log('User joined video call:', signal.fromUserId, 'Current user role:', user?.role);
          if (user?.role === 'doctor' && !waitingPatient && !admittedPatient) {
            const name = signal.userName || 'Unknown Patient';
            console.log('Doctor detected patient join, setting waiting patient:', name);
            setWaitingPatient({ id: signal.fromUserId, name });
          }
          break;

        case 'offer':
          if (!isDoctor && peerConnectionRef.current) {
            setWaitingForAdmission(false);
            await peerConnectionRef.current.setRemoteDescription({
              type: 'offer',
              sdp: signal.data
            });
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            websocketClient.sendVideoCallAnswer(appointmentId!, {
              fromUserId: user!.id,
              answer: answer.sdp!
            });
          }
          break;

        case 'answer':
          if (isDoctor && peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription({
              type: 'answer',
              sdp: signal.data
            });
            if (waitingPatient) {
              setAdmittedPatient(waitingPatient);
              setWaitingPatient(null);
            }
          }
          break;

        case 'ice-candidate':
          if (peerConnectionRef.current && signal.data) {
            await peerConnectionRef.current.addIceCandidate({
              candidate: signal.data,
              sdpMLineIndex: 0,
              sdpMid: ''
            });
          }
          break;

        case 'leave':
          console.log('User left video call:', signal.fromUserId);
          if (isDoctor) {
            if (admittedPatient?.id === signal.fromUserId) {
              setAdmittedPatient(null);
              setRemoteStream(null);
            }
            if (waitingPatient?.id === signal.fromUserId) {
              setWaitingPatient(null);
            }
          }
          if (!isDoctor && waitingForAdmission) {
            setWaitingForAdmission(false);
            setRemoteStream(null);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling video call signal:', error);
    }
  };

  const admitPatient = async () => {
    if (!waitingPatient || !peerConnectionRef.current || !appointmentId || !user?.id) return;

    // Check if WebSocket is connected before proceeding
    if (!isWebSocketConnected) {
      toast.error('Connection lost. Please wait for reconnection or refresh the page.');
      return;
    }

    setAdmittingPatient(true);
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send the offer - it will be queued if WebSocket is not connected
      websocketClient.sendVideoCallOffer(appointmentId, {
        fromUserId: user.id,
        offer: offer.sdp!
      });

      // Show success message and update UI state
      toast.success(`Sent invitation to ${waitingPatient.name}`);
      setAdmittedPatient(waitingPatient);
      setWaitingPatient(null);

    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to invite patient. Please try again.');
    } finally {
      setAdmittingPatient(false);
    }
  };

  const joinCall = () => {
    if (appointmentId && user) {
      websocketClient.joinVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
        userRole: user.role
      });
      if (!isDoctor) {
        setWaitingForAdmission(true);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callState.isInCall) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Initializing Video Call</h3>
          <p className="text-gray-600">Please wait while we set up your call...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Video Call</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {formatDuration(callState.callDuration)}
            </span>
            <Button variant="ghost" size="sm" onClick={onMinimize}>
              Minimize
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Local video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-48 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You ({user?.role === 'doctor' ? 'Doctor' : 'Patient'})
            </div>
          </div>

          {/* Remote video */}
          {isDoctor ? (
            admittedPatient ? (
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {admittedPatient.name}
                </div>
              </div>
            ) : (
              <div className="relative col-span-1 md:col-span-2">
                <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                  <p className="text-white">No patient connected</p>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Patient
                </div>
              </div>
            )
          ) : (
            waitingForAdmission ? (
              <div className="relative">
                <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center flex-col">
                  <Monitor className="h-12 w-12 mb-2 text-gray-400" />
                  <p className="text-white">Waiting for doctor to admit you...</p>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Doctor
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Doctor
                </div>
              </div>
            )
          )}
        </div>

        {isDoctor && !admittedPatient && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            {waitingPatient ? (
              <>
                <h4 className="font-semibold mb-2 text-yellow-800">Patient Ready</h4>
                <p className="text-yellow-700 mb-3">{waitingPatient.name} is ready to start the video call.</p>
                <Button onClick={admitPatient} className="w-full" disabled={admittingPatient}>
                  {admittingPatient ? 'Connecting...' : 'Start Video Call'}
                </Button>
              </>
            ) : (
              <>
                <h4 className="font-semibold mb-2 text-yellow-800">Waiting for Patient</h4>
                <p className="text-yellow-700 mb-3">No patient has joined the call yet. The admit button will be enabled when a patient joins.</p>
                <Button className="w-full" disabled>
                  Admit Patient
                </Button>
              </>
            )}
          </div>
        )}

        {/* Call controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={callState.isMuted ? "destructive" : "secondary"}
            size="lg"
            onClick={toggleMute}
            className="rounded-full w-12 h-12 p-0"
            disabled={!callState.isInCall}
          >
            {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            variant={callState.isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
            disabled={!callState.isInCall}
          >
            {callState.isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-12 h-12 p-0"
            disabled={!callState.isInCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        {/* Connection status indicators */}
        <div className="mt-4 space-y-2">
          {/* WebSocket status */}
          <div className="text-center">
            <span className={`text-sm px-2 py-1 rounded ${
              webSocketStatus === 'connected' ? 'bg-green-100 text-green-800' :
              webSocketStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              WebSocket: {webSocketStatus}
            </span>
            {webSocketStatus === 'disconnected' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setWebSocketStatus('connecting');
                  websocketClient.connect();
                }}
                className="ml-2"
              >
                Retry Connection
              </Button>
            )}
          </div>

          {/* WebRTC connection quality */}
          <div className="text-center">
            <span className={`text-sm px-2 py-1 rounded ${
              callState.connectionQuality === 'good' ? 'bg-green-100 text-green-800' :
              callState.connectionQuality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Connection: {callState.connectionQuality}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { VideoCall };
