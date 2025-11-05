import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor, MessageCircle, PictureInPicture, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { VideoCall as VideoCallType, VideoCallState } from '../../types';
import { websocketClient } from '../../lib/websocket-client';
import { toast } from 'sonner';
import { ChatInterface } from './ChatInterface';

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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
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
  const [initStep, setInitStep] = useState<'connecting' | 'media' | 'peer' | 'ready'>('connecting');
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isLocalVideoPlaying, setIsLocalVideoPlaying] = useState(false);
  const [isRemoteVideoPlaying, setIsRemoteVideoPlaying] = useState(false);

  // Update remote video element when remote stream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log('Setting remoteVideoRef srcObject');
      remoteVideoRef.current.srcObject = remoteStream;
      // Wait for metadata to load before playing
      remoteVideoRef.current.addEventListener('loadedmetadata', () => {
        console.log('Remote video metadata loaded, attempting play');
        remoteVideoRef.current?.play().catch(error => console.error('Error playing remote video:', error));
      }, { once: true });

      // Also listen for loadstart to detect if video starts loading
      remoteVideoRef.current.addEventListener('loadstart', () => {
        console.log('Remote video loadstart event fired');
      }, { once: true });

      // Listen for error events
      remoteVideoRef.current.addEventListener('error', (e) => {
        console.error('Remote video error:', e);
      }, { once: true });
    } else if (remoteStream) {
      console.warn('remoteVideoRef.current is null when remoteStream is set');
    }
  }, [remoteStream]);



  // Join call when WebSocket connects and peer connection is ready
  useEffect(() => {
    if (isWebSocketConnected && initStep === 'ready' && appointmentId && user) {
      console.log('WebSocket connected and peer connection ready, joining call...');
      joinCall();
      // For doctors, set initial state to show they are ready
      if (user?.role === 'doctor') {
        setDoctorCallStarted(true);
      }
    }
  }, [isWebSocketConnected, initStep, appointmentId, user]);

  // Add event listeners for video elements
  useEffect(() => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;

    const handleLocalPlay = () => setIsLocalVideoPlaying(true);
    const handleLocalPause = () => setIsLocalVideoPlaying(false);
    const handleRemotePlay = () => setIsRemoteVideoPlaying(true);
    const handleRemotePause = () => setIsRemoteVideoPlaying(false);

    if (localVideo) {
      localVideo.addEventListener('play', handleLocalPlay);
      localVideo.addEventListener('pause', handleLocalPause);
      localVideo.addEventListener('ended', handleLocalPause);
    }

    if (remoteVideo) {
      remoteVideo.addEventListener('play', handleRemotePlay);
      remoteVideo.addEventListener('pause', handleRemotePause);
      remoteVideo.addEventListener('ended', handleRemotePause);
    }

    return () => {
      if (localVideo) {
        localVideo.removeEventListener('play', handleLocalPlay);
        localVideo.removeEventListener('pause', handleLocalPause);
        localVideo.removeEventListener('ended', handleLocalPause);
      }
      if (remoteVideo) {
        remoteVideo.removeEventListener('play', handleRemotePlay);
        remoteVideo.removeEventListener('pause', handleRemotePause);
        remoteVideo.removeEventListener('ended', handleRemotePause);
      }
    };
  }, []);



  // Initialize WebRTC peer connection
  useEffect(() => {
    const initPeerConnection = async () => {
      try {
        setInitStep('media');
        console.log('Step 1: Requesting media permissions...');

        // Check if media devices are supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Media devices not supported');
        }

        // Request user media permissions with reduced frame rate for better performance
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: 15 },
          audio: true
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Set up local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setInitStep('peer');
        console.log('Step 2: Creating peer connection...');

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
          if (event.candidate && appointmentId && user?.id) {
            // Send ICE candidate to signaling server
            websocketClient.sendIceCandidate(appointmentId, {
              fromUserId: user.id,
              candidate: event.candidate.candidate,
              sdpMLineIndex: event.candidate.sdpMLineIndex ?? undefined,
              sdpMid: event.candidate.sdpMid ?? undefined
            });
          }
        };

        // Handle connection state changes
        peerConnectionRef.current.onconnectionstatechange = () => {
          console.log('Connection state:', peerConnectionRef.current?.connectionState);
        };

        setInitStep('ready');
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

      // Connect WebSocket and set up signal handler immediately (parallel with media setup)
      websocketClient.setOnConnectionChange((connected) => {
        setIsWebSocketConnected(connected);
        setWebSocketStatus(connected ? 'connected' : 'disconnected');
        if (connected) {
          console.log('WebSocket connected, subscribing to video call...');
          websocketClient.subscribeToVideoCall(appointmentId);
        }
      });
      websocketClient.setOnVideoCallSignal(handleVideoCallSignal);
      websocketClient.connect();

      // Start peer connection setup immediately without delay
      initPeerConnection().then(() => {
        // Peer connection is ready, wait for WebSocket to connect before joining
      });
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
    if (signalAppointmentId !== appointmentId || !user?.id || signal.fromUserId === user.id) return;

    console.log('Received video call signal:', signal.type, 'from:', signal.fromUserId, 'role:', user?.role);

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
          console.log('Patient received offer from doctor:', signal.fromUserId);
          if (!isDoctor && peerConnectionRef.current) {
            console.log('Patient processing offer, setting waitingForAdmission to false');
            setWaitingForAdmission(false);
            await peerConnectionRef.current.setRemoteDescription({
              type: 'offer',
              sdp: signal.data
            });
            // Flush pending ICE candidates after setting remote description
            await flushPendingIceCandidates();
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log('Patient sending answer back to doctor');
            websocketClient.sendVideoCallAnswer(appointmentId!, {
              fromUserId: user!.id,
              answer: answer.sdp!
            });
          } else {
            console.log('Offer received but conditions not met - isDoctor:', isDoctor, 'peerConnection:', !!peerConnectionRef.current);
          }
          break;

        case 'answer':
          console.log('Doctor received answer from patient:', signal.fromUserId);
          if (isDoctor && peerConnectionRef.current) {
            console.log('Setting remote description for answer');
            await peerConnectionRef.current.setRemoteDescription({
              type: 'answer',
              sdp: signal.data
            });
            console.log('Remote description set, remoteDescription:', peerConnectionRef.current.remoteDescription);
            // Flush pending ICE candidates after setting remote description
            await flushPendingIceCandidates();
            if (waitingPatient) {
              console.log('Doctor setting admitted patient:', waitingPatient.name);
              setAdmittedPatient(waitingPatient);
              setWaitingPatient(null);
            }
          }
          break;

        case 'ice-candidate':
          console.log('Received ICE candidate from:', signal.fromUserId);
          if (peerConnectionRef.current && signal.data) {
            try {
              const candidateInit: RTCIceCandidateInit = {
                candidate: signal.data
              };
              
              // Default sdpMLineIndex to 0 if missing (standard for audio/video streams)
              candidateInit.sdpMLineIndex = signal.sdpMLineIndex ?? 0;
              
              if (signal.sdpMid !== undefined && signal.sdpMid !== null) {
                candidateInit.sdpMid = signal.sdpMid;
              }

              // Queue candidate if remote description not set yet
              if (peerConnectionRef.current.remoteDescription) {
                // Pass init directly to addIceCandidate to avoid constructor validation
                await peerConnectionRef.current.addIceCandidate(candidateInit);
                console.log('ICE candidate added successfully');
              } else {
                pendingIceCandidates.current.push(candidateInit);
                console.log('ICE candidate queued (remote description not set yet)');
              }
            } catch (error) {
              console.error('Failed to process ICE candidate:', error);
            }
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

  const flushPendingIceCandidates = async () => {
    if (!peerConnectionRef.current) return;

    while (pendingIceCandidates.current.length > 0) {
      const candidateInit = pendingIceCandidates.current.shift()!;
      try {
        await peerConnectionRef.current.addIceCandidate(candidateInit);
        console.log('Flushed queued ICE candidate successfully');
      } catch (error) {
        console.error('Failed to flush queued ICE candidate:', error);
      }
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

  const leaveWaitingRoom = () => {
    if (appointmentId && user?.id) {
      websocketClient.leaveVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
      });
    }
    setWaitingForAdmission(false);
    toast.info('Left waiting room');
  };

  const togglePictureInPicture = async () => {
    if (!remoteVideoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      } else {
        await remoteVideoRef.current.requestPictureInPicture();
        setIsPictureInPicture(true);
      }
    } catch (error) {
      console.error('Picture-in-picture failed:', error);
      toast.error('Picture-in-picture not supported');
    }
  };

  if (!callState.isInCall) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Initializing Video Call</h3>
          <p className="text-gray-600 mb-2">Please wait while we set up your call...</p>
          <div className="text-sm text-gray-500">
            Step: {initStep === 'connecting' ? 'Connecting...' :
                   initStep === 'media' ? 'Requesting camera/microphone...' :
                   initStep === 'peer' ? 'Setting up connection...' :
                   'Ready'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto h-full relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold">Live Consultation</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full font-mono">
            {formatDuration(callState.callDuration)}
          </span>
          <Button variant="ghost" size="sm" onClick={onMinimize} className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0">
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Main remote video area */}
      <div className="w-full h-full relative">
        {/* Remote video - full screen */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
            muted={false}
          />
        ) : isDoctor && !admittedPatient ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-800 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              {waitingPatient ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Monitor className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">{waitingPatient.name} is ready</h4>
                  <p className="text-gray-600 mb-6 text-lg">Ready for your consultation. Start the video call now.</p>
                  <Button 
                    onClick={admitPatient} 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={admittingPatient}
                  >
                    {admittingPatient ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                      </span>
                    ) : (
                      'Start Consultation'
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="h-10 w-10 text-gray-500" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Awaiting Patient</h4>
                  <p className="text-gray-600 mb-6 text-lg">Your patient will join shortly. They'll appear here when ready.</p>
                  <div className="text-sm text-gray-500">Share the consultation link with your patient</div>
                </>
              )}
            </div>
          </div>
        ) : !isDoctor && waitingForAdmission ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 flex-col">
            <div className="text-center text-gray-800 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Monitor className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">Waiting Room</h4>
              <p className="text-gray-600 mb-6 text-lg">Doctor will start the consultation shortly</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <Button
                variant="outline"
                onClick={leaveWaitingRoom}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 px-6 rounded-xl shadow-sm transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Leave Waiting Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-800 p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Connecting...</h4>
              <p className="text-gray-600">Setting up secure video connection</p>
            </div>
          </div>
        )}

        {/* Local video inset - bottom right */}
        {localStreamRef.current && (
          <div className="absolute bottom-24 right-6 w-28 h-20 bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              You
            </div>
          </div>
        )}

        {/* Participant name overlay for remote */}
        {admittedPatient && (
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/50">
            👨‍⚕️ {admittedPatient.name}
          </div>
        )}
        {!isDoctor && remoteStream && (
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/50">
            👨‍⚕️ Doctor
          </div>
        )}
      </div>

      {/* Bottom controls - only show during active call */}
      {callState.isInCall && remoteStream && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex justify-center items-center gap-6 z-20">
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleMute}
            className={`rounded-full w-16 h-16 p-0 transition-all duration-200 transform hover:scale-110 ${
              callState.isMuted 
                ? 'bg-red-500/20 text-red-400 border-2 border-red-400/50 hover:bg-red-500/30' 
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
            }`}
            disabled={!callState.isInCall}
            title={callState.isMuted ? "Unmute" : "Mute"}
          >
            {callState.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={toggleVideo}
            className={`rounded-full w-16 h-16 p-0 transition-all duration-200 transform hover:scale-110 ${
              !callState.isVideoEnabled 
                ? 'bg-red-500/20 text-red-400 border-2 border-red-400/50 hover:bg-red-500/30' 
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
            }`}
            disabled={!callState.isInCall}
            title={callState.isVideoEnabled ? "Turn off video" : "Turn on video"}
          >
            {callState.isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
            disabled={!callState.isInCall}
            title="End call"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          {/* Chat toggle during call */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="absolute right-4 bg-white/20 text-white hover:bg-white/30 rounded-full h-10 w-10 p-0"
            title="Toggle chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Chat Interface - right sidebar when open */}
      {showChat && callState.isInCall && (
        <div className="absolute top-16 right-0 w-80 h-[calc(100%-4rem)] bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-200 z-30 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Live Chat
              </h4>
              <Button variant="ghost" onClick={() => setShowChat(false)} className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-full overflow-auto">
            <ChatInterface />
          </div>
        </div>
      )}

      {/* Connection status - top right corner */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
          webSocketStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : webSocketStatus === 'connecting' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            webSocketStatus === 'connected' ? 'bg-green-500' : webSocketStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          {webSocketStatus}
        </div>
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
          callState.connectionQuality === 'good' 
            ? 'bg-green-100 text-green-800' 
            : callState.connectionQuality === 'fair' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            callState.connectionQuality === 'good' ? 'bg-green-500' : callState.connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          {callState.connectionQuality}
        </div>
      </div>

      {/* Picture in Picture button - during active call */}
      {callState.isInCall && remoteStream && (
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePictureInPicture}
          className="absolute top-20 right-4 bg-white/90 text-gray-700 hover:bg-white shadow-lg rounded-full h-10 w-10 p-0"
          title="Picture-in-Picture"
        >
          <PictureInPicture className="h-5 w-5" />
        </Button>
      )}
    </div>
  );

};

export { VideoCall };
