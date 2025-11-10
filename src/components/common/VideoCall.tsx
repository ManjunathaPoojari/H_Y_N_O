import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor, MessageCircle, PictureInPicture, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { VideoCall as VideoCallType, VideoCallState } from '../../types';
import { websocketClient } from '../../lib/websocket-client';
import { toast } from 'sonner';
import { ChatInterface } from './ChatInterface';
import { api } from '../../lib/api';

interface VideoCallProps {
  callId?: string;
  appointmentId?: string;
  onEndCall?: () => void;
  onMinimize?: () => void;
}

type InitState = 'idle' | 'connecting' | 'media' | 'peer' | 'ready' | 'error';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

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

  // Initialization state
  const [initState, setInitState] = useState<InitState>('idle');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // Call management
  const callDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  // Video call status tracking
  const appointmentIdRef = useRef<string | undefined>(appointmentId);

  // UI state
  const [isDoctor, setIsDoctor] = useState(false);
  const [waitingPatient, setWaitingPatient] = useState<{id: string, name: string} | null>(null);
  const [admittedPatient, setAdmittedPatient] = useState<{id: string, name: string} | null>(null);
  const [waitingForAdmission, setWaitingForAdmission] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up video call resources');

    // Stop media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear timers
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
      callDurationIntervalRef.current = null;
    }

    // Disconnect WebSocket
    websocketClient.disconnect();

    // Reset state
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
    setRemoteStreamRef(null);
  }, []);

  // Set remote stream ref
  const setRemoteStreamRef = useCallback((stream: MediaStream | null) => {
    remoteStreamRef.current = stream;
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, []);

  // Initialize media (camera/microphone)
  const initializeMedia = useCallback(async (): Promise<MediaStream> => {
    try {
      setInitState('media');
      console.log('Requesting media permissions...');

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 15 },
        audio: true
      });

      localStreamRef.current = stream;

      // Set up local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Media initialization failed:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('Camera and microphone permissions are required for video calls. Please allow access and refresh the page.');
        } else if (error.name === 'NotFoundError') {
          setError('No camera or microphone found. Please check your device settings.');
        } else {
          setError('Failed to access camera/microphone. Please try again.');
        }
      }
      setInitState('error');
      throw error;
    }
  }, []);

  // Initialize peer connection
  const initializePeerConnection = useCallback(async (localStream: MediaStream) => {
    try {
      setInitState('peer');
      console.log('Creating peer connection...');

      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Received remote stream');
        if (event.streams[0]) {
          setRemoteStreamRef(event.streams[0]);
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && appointmentId && user?.id) {
          websocketClient.sendIceCandidate(appointmentId, {
            fromUserId: user.id,
            candidate: event.candidate.candidate,
            sdpMLineIndex: event.candidate.sdpMLineIndex ?? undefined,
            sdpMid: event.candidate.sdpMid ?? undefined
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        console.log('Peer connection state:', state);

        if (state === 'connected') {
          setCallState(prev => ({ ...prev, connectionQuality: 'good' }));
        } else if (state === 'failed' || state === 'disconnected') {
          setCallState(prev => ({ ...prev, connectionQuality: 'poor' }));
        }
      };

      setInitState('ready');
      setCallState(prev => ({ ...prev, isInCall: true }));

      // Start call duration timer
      callDurationIntervalRef.current = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          callDuration: prev.callDuration + 1
        }));
      }, 1000);

    } catch (error) {
      console.error('Peer connection initialization failed:', error);
      setError('Failed to set up video connection. Please try again.');
      setInitState('error');
      throw error;
    }
  }, [appointmentId, user?.id, setRemoteStreamRef]);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    setConnectionState('connecting');

    websocketClient.setOnConnectionChange((connected) => {
      setConnectionState(connected ? 'connected' : 'failed');
      if (connected && appointmentId) {
        console.log('WebSocket connected, subscribing to video call...');
        websocketClient.subscribeToVideoCall(appointmentId);
      }
    });

    websocketClient.setOnVideoCallSignal(handleVideoCallSignal);
    websocketClient.connect();
  }, [appointmentId]);

  // Main initialization function
  const initializeCall = useCallback(async () => {
    if (!appointmentId || !user) return;

    try {
      setInitState('connecting');
      setError(null);

      // Determine user role
      setIsDoctor(user.role === 'doctor');

      // Initialize WebSocket first (parallel with media)
      initializeWebSocket();

      // Initialize media and peer connection sequentially
      const localStream = await initializeMedia();
      await initializePeerConnection(localStream);

      console.log('Video call initialization complete');

    } catch (error) {
      console.error('Video call initialization failed:', error);
      setInitState('error');
    }
  }, [appointmentId, user, initializeMedia, initializePeerConnection, initializeWebSocket]);

  // Join call when both WebSocket and peer connection are ready
  useEffect(() => {
    if (connectionState === 'connected' && initState === 'ready' && appointmentId && user) {
      console.log('Both WebSocket and peer connection ready, joining call...');
      joinCall();
    }
  }, [connectionState, initState, appointmentId, user]);

  // Initialize on mount
  useEffect(() => {
    if (appointmentId) {
      initializeCall();
    }

    return cleanup;
  }, [appointmentId, initializeCall, cleanup]);

  // Handle video call signals
  const handleVideoCallSignal = useCallback(async (signal: any, signalAppointmentId: string) => {
    if (signalAppointmentId !== appointmentId || !user?.id || signal.fromUserId === user.id) return;

    console.log('Received video call signal:', signal.type, 'from:', signal.fromUserId);

    try {
      switch (signal.type) {
        case 'join':
          if (user.role === 'doctor' && !waitingPatient && !admittedPatient) {
            setWaitingPatient({ id: signal.fromUserId, name: signal.userName || 'Unknown Patient' });
          }
          break;

        case 'offer':
          if (user.role === 'patient' && peerConnectionRef.current) {
            setWaitingForAdmission(false);
            await peerConnectionRef.current.setRemoteDescription({
              type: 'offer',
              sdp: signal.data
            });
            await flushPendingIceCandidates();
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            websocketClient.sendVideoCallAnswer(appointmentId!, {
              fromUserId: user.id,
              answer: answer.sdp!
            });
          }
          break;

        case 'answer':
          if (user.role === 'doctor' && peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription({
              type: 'answer',
              sdp: signal.data
            });
            await flushPendingIceCandidates();
            if (waitingPatient) {
              setAdmittedPatient(waitingPatient);
              setWaitingPatient(null);
            }
          }
          break;

        case 'ice-candidate':
          if (peerConnectionRef.current && signal.data) {
            const candidateInit: RTCIceCandidateInit = {
              candidate: signal.data,
              sdpMLineIndex: signal.sdpMLineIndex ?? 0,
              sdpMid: signal.sdpMid
            };

            if (peerConnectionRef.current.remoteDescription) {
              await peerConnectionRef.current.addIceCandidate(candidateInit);
            } else {
              pendingIceCandidates.current.push(candidateInit);
            }
          }
          break;

        case 'leave':
          if (user.role === 'doctor') {
            if (admittedPatient?.id === signal.fromUserId) {
              setAdmittedPatient(null);
              setRemoteStreamRef(null);
            }
            if (waitingPatient?.id === signal.fromUserId) {
              setWaitingPatient(null);
            }
          }
          if (user.role === 'patient' && waitingForAdmission) {
            setWaitingForAdmission(false);
            setRemoteStreamRef(null);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling video call signal:', error);
    }
  }, [appointmentId, user, waitingPatient, admittedPatient, setRemoteStreamRef]);

  // Flush pending ICE candidates
  const flushPendingIceCandidates = useCallback(async () => {
    if (!peerConnectionRef.current) return;

    while (pendingIceCandidates.current.length > 0) {
      const candidate = pendingIceCandidates.current.shift()!;
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Failed to flush ICE candidate:', error);
      }
    }
  }, []);

  // Join call
  const joinCall = useCallback(() => {
    if (appointmentId && user) {
      websocketClient.joinVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
        userRole: user.role
      });
      if (user.role === 'patient') {
        setWaitingForAdmission(true);
      }
    }
  }, [appointmentId, user]);

  // Admit patient (doctor only)
  const admitPatient = useCallback(async () => {
    if (!waitingPatient || !peerConnectionRef.current || !appointmentId || !user?.id) return;

    if (connectionState !== 'connected') {
      toast.error('Connection lost. Please wait for reconnection.');
      return;
    }

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      websocketClient.sendVideoCallOffer(appointmentId, {
        fromUserId: user.id,
        offer: offer.sdp!
      });

      toast.success(`Connecting to ${waitingPatient.name}...`);
      setAdmittedPatient(waitingPatient);
      setWaitingPatient(null);

    } catch (error) {
      console.error('Error admitting patient:', error);
      toast.error('Failed to start call. Please try again.');
    }
  }, [waitingPatient, appointmentId, user, connectionState]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = callState.isMuted;
      });
      setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }
  }, [callState.isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !callState.isVideoEnabled;
      });
      setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
    }
  }, [callState.isVideoEnabled]);

  // End call
  const endCall = useCallback(() => {
    if (appointmentId && user?.id) {
      websocketClient.leaveVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
      });
    }
    cleanup();
    onEndCall?.();
  }, [appointmentId, user, cleanup, onEndCall]);

  // Leave waiting room
  const leaveWaitingRoom = useCallback(() => {
    if (appointmentId && user?.id) {
      websocketClient.leaveVideoCall(appointmentId, {
        userId: user.id,
        userName: user.name,
      });
    }
    setWaitingForAdmission(false);
    toast.info('Left waiting room');
  }, [appointmentId, user]);

  // Toggle picture in picture
  const togglePictureInPicture = useCallback(async () => {
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
  }, []);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Retry initialization
  const retryInitialization = useCallback(() => {
    cleanup();
    initializeCall();
  }, [cleanup, initializeCall]);

  // Error state
  if (initState === 'error' || error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2 text-red-700">Connection Failed</h3>
          <p className="text-gray-600 mb-4">{error || 'Failed to initialize video call'}</p>
          <Button onClick={retryInitialization} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (initState !== 'ready') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Setting Up Video Call</h3>
          <p className="text-gray-600 mb-2">
            {initState === 'connecting' && 'Connecting to server...'}
            {initState === 'media' && 'Requesting camera/microphone access...'}
            {initState === 'peer' && 'Setting up secure connection...'}
          </p>
          <div className="text-sm text-gray-500">
            Connection: {connectionState}
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
          <div className={`w-2 h-2 rounded-full ${
            connectionState === 'connected' ? 'bg-green-400' :
            connectionState === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
          } animate-pulse`}></div>
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

      {/* Main video area */}
      <div className="w-full h-full relative">
        {/* Remote video */}
        {remoteStreamRef.current ? (
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
                  <Button onClick={admitPatient} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Start Consultation
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="h-10 w-10 text-gray-500" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Awaiting Patient</h4>
                  <p className="text-gray-600 mb-6 text-lg">Your patient will join shortly.</p>
                </>
              )}
            </div>
          </div>
        ) : !isDoctor && waitingForAdmission ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-800 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Monitor className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-gray-900">Waiting Room</h4>
              <p className="text-gray-600 mb-6 text-lg">Doctor will start the consultation shortly</p>
              <Button variant="outline" onClick={leaveWaitingRoom} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Leave Waiting Room
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-800 p-8">
              <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h4 className="text-xl font-semibold mb-2">Connecting...</h4>
              <p className="text-gray-600">Setting up secure video connection</p>
            </div>
          </div>
        )}

        {/* Local video inset */}
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

        {/* Participant name overlay */}
        {admittedPatient && (
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/50">
            👨‍⚕️ {admittedPatient.name}
          </div>
        )}
        {!isDoctor && remoteStreamRef.current && (
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/50">
            👨‍⚕️ Doctor
          </div>
        )}
      </div>

      {/* Controls */}
      {callState.isInCall && remoteStreamRef.current && (
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
          >
            {callState.isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="absolute right-4 bg-white/20 text-white hover:bg-white/30 rounded-full h-10 w-10 p-0"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Chat Interface */}
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

      {/* Connection status */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
          connectionState === 'connected'
            ? 'bg-green-100 text-green-800'
            : connectionState === 'connecting'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionState === 'connected' ? 'bg-green-500' :
            connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          {connectionState}
        </div>
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
          callState.connectionQuality === 'good'
            ? 'bg-green-100 text-green-800'
            : callState.connectionQuality === 'fair'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            callState.connectionQuality === 'good' ? 'bg-green-500' :
            callState.connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          {callState.connectionQuality}
        </div>
      </div>

      {/* Picture in Picture */}
      {callState.isInCall && remoteStreamRef.current && (
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePictureInPicture}
          className="absolute top-20 right-4 bg-white/90 text-gray-700 hover:bg-white shadow-lg rounded-full h-10 w-10 p-0"
        >
          <PictureInPicture className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export { VideoCall };
