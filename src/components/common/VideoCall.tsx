import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor, MessageCircle, PictureInPicture, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
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

type InitState = 'idle' | 'connecting' | 'media' | 'peer' | 'ready' | 'error';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';


// Global stream tracker to handle React Strict Mode double-mounts
let globalLocalStream: MediaStream | null = null;

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
  const [waitingPatient, setWaitingPatient] = useState<{ id: string, name: string } | null>(null);
  const [admittedPatient, setAdmittedPatient] = useState<{ id: string, name: string } | null>(null);
  const [waitingForAdmission, setWaitingForAdmission] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteAudioActive, setRemoteAudioActive] = useState(false);
  const [localAudioLevel, setLocalAudioLevel] = useState(0);

  // Mounted ref
  const isMounted = useRef(false);

  // Sync local stream with video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      console.log('🎥 Syncing local stream to video element');

      // Basic Audio Level Metering (Optional but helpful)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(localStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!isMounted.current) return;
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setLocalAudioLevel(average);
        requestAnimationFrame(updateLevel);
      };
      updateLevel();

      return () => {
        audioCtx.close();
      };
    }
  }, [localStream]);

  // Sync remote stream with video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('🎥 [DEBUG] Remote video srcObject attached via Effect');
      remoteVideoRef.current.play().catch(e => console.warn('🎥 [DEBUG] Remote play() failed:', e));
    }
  }, [remoteStream]);

  // Callback ref for remote video to ensure srcObject is set correctly
  const remoteVideoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      remoteVideoRef.current = node;
      if (remoteStream) {
        node.srcObject = remoteStream;
        console.log('🎥 [DEBUG] Remote video srcObject attached via Callback Ref');
        node.play().catch(e => console.warn('🎥 [DEBUG] Remote play() failed:', e));
      }
    }
  }, [remoteStream]);

  // Callback ref for local video
  const localVideoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      localVideoRef.current = node;
      if (localStream) {
        node.srcObject = localStream;
        console.log('🎥 [DEBUG] Local video srcObject attached via Callback Ref');
      }
    }
  }, [localStream]);

  // Set remote stream ref (Defined before cleanup)
  const setRemoteStreamRef = useCallback((stream: MediaStream | null) => {
    console.log('🎥 [DEBUG] Remote stream signal:', stream ? `Stream ID: ${stream.id}` : 'Stream cleared');
    if (stream) {
      setRemoteAudioActive(stream.getAudioTracks().length > 0);
      stream.getTracks().forEach(track => {
        console.log(`🎥 [DEBUG] Remote track: ${track.kind}, enabled: ${track.enabled}, state: ${track.readyState}`);
        track.onunmute = () => {
          console.log(`🎥 [DEBUG] Remote track ${track.kind} UNMUTED`);
          if (track.kind === 'audio') setRemoteAudioActive(true);
        };
        track.onmute = () => {
          console.log(`🎥 [DEBUG] Remote track ${track.kind} MUTED`);
          if (track.kind === 'audio') setRemoteAudioActive(false);
        };
      });
    } else {
      setRemoteAudioActive(false);
    }
    remoteStreamRef.current = stream;
    setRemoteStream(stream);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up video call resources');

    // Stop media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      localStreamRef.current = null;
    }

    // Stop media tracks (Global)
    if (globalLocalStream) {
      globalLocalStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      globalLocalStream = null;
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
    if (isMounted.current) {
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
    }
  }, [setRemoteStreamRef]);

  // Initialize media (camera/microphone)
  const initializeMedia = useCallback(async (): Promise<MediaStream> => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        setInitState('media');
        console.log(`🎥 [MEDIA] Requesting permissions (Attempt ${attempts}/${maxAttempts})...`);

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Media devices not supported');
        }

        // 1. AGGRESSIVE CLEANUP: Stop any existing streams BEFORE requesting new ones
        // This is critical for mobile and some desktop drivers that can't handle multiple requests
        const currentLocal = localStreamRef.current;
        if (currentLocal) {
          console.log('🎥 [MEDIA] Stopping previous localStream tracks...');
          currentLocal.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          localStreamRef.current = null;
        }

        if (globalLocalStream) {
          console.log('🎥 [MEDIA] Stopping lingering global stream...');
          globalLocalStream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          globalLocalStream = null;
        }

        // 2. Hardware cooldown delay
        if (attempts > 1) {
          const delay = attempts * 1000;
          console.log(`🎥 [MEDIA] Hardware cooldown delay: ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // 3. Request media with fallback constraints
        // On attempt 3, we use very loose constraints to increase success chance
        const constraints: MediaStreamConstraints = attempts < 3
          ? {
            video: {
              width: { ideal: 640, max: 1280 },
              height: { ideal: 480, max: 720 },
              frameRate: { ideal: 15, max: 30 }
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          }
          : { video: true, audio: true };

        console.log('🎥 [MEDIA] Using constraints:', JSON.stringify(constraints));
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isMounted.current) {
          console.warn('🎥 [MEDIA] Component unmounted during acquisition, stopping tracks...');
          stream.getTracks().forEach(track => track.stop());
          throw new Error('Component unmounted during initialization');
        }

        // 4. Success - setup state and refs
        console.log('🎥 [MEDIA] Success! Stream ID:', stream.id);
        stream.getTracks().forEach(track => {
          console.log(`🎥 [MEDIA] Track: ${track.kind}, ID: ${track.id}, State: ${track.readyState}`);
          track.onended = () => console.log(`🎥 [MEDIA] Track ${track.kind} ended externally`);
        });

        localStreamRef.current = stream;
        setLocalStream(stream);
        globalLocalStream = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        return stream;

      } catch (error: any) {
        console.error(`🎥 [MEDIA] Initialization attempt ${attempts} failed:`, {
          name: error.name,
          message: error.message,
          constraint: error.constraint
        });

        const errorName = error.name || '';

        // Handle definite failure cases immediately
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setError('Camera and microphone permissions were denied. Please enable them in your browser settings and refresh.');
          setInitState('error');
          throw error;
        }

        if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          setError('No camera or microphone found. Please connect your media devices.');
          setInitState('error');
          throw error;
        }

        // NotReadable / TrackStart are usually "Device in use" or hardware issues - worth retrying
        const isHardwareError = errorName === 'NotReadableError' || errorName === 'TrackStartError';

        if (attempts >= maxAttempts) {
          if (isHardwareError) {
            setError('Your camera or microphone is being used by another application. Please close other video apps and try again.');
          } else {
            setError(`Failed to start video call: ${error.message || 'Unknown media error'}`);
          }
          setInitState('error');
          throw error;
        }

        console.log('🎥 [MEDIA] Recoverable error, retrying...');
      }
    }

    throw new Error('Media initialization failed after max retries');
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
          console.log('📥 [PATIENT] Received OFFER from doctor');
          if (user.role === 'patient' && peerConnectionRef.current) {
            console.log('📥 [PATIENT] Processing offer, setting remote description...');
            setWaitingForAdmission(false);
            await peerConnectionRef.current.setRemoteDescription({
              type: 'offer',
              sdp: signal.data
            });
            console.log('✅ [PATIENT] Remote description set, flushing ICE candidates...');
            await flushPendingIceCandidates();
            console.log('✅ [PATIENT] Creating answer...');
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log('📤 [PATIENT] Sending ANSWER to doctor');
            websocketClient.sendVideoCallAnswer(appointmentId!, {
              fromUserId: user.id,
              answer: answer.sdp!
            });
            console.log('✅ [PATIENT] Answer sent successfully');
          } else {
            console.warn('❌ [PATIENT] Cannot process offer - role:', user.role, 'peerConnection:', !!peerConnectionRef.current);
          }
          break;

        case 'answer':
          console.log('📥 [DOCTOR] Received ANSWER from patient');
          if (user.role === 'doctor' && peerConnectionRef.current) {
            console.log('📥 [DOCTOR] Processing answer, setting remote description...');
            await peerConnectionRef.current.setRemoteDescription({
              type: 'answer',
              sdp: signal.data
            });
            console.log('✅ [DOCTOR] Remote description set, flushing ICE candidates...');
            await flushPendingIceCandidates();
            console.log('✅ [DOCTOR] ICE candidates flushed');
            if (waitingPatient) {
              setAdmittedPatient(waitingPatient);
              setWaitingPatient(null);
            }
            console.log('✅ [DOCTOR] Patient admitted to call');
          } else {
            console.warn('❌ [DOCTOR] Cannot process answer - role:', user.role, 'peerConnection:', !!peerConnectionRef.current);
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
  }, [appointmentId, user, waitingPatient, admittedPatient, setRemoteStreamRef, flushPendingIceCandidates]);

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

  // Join call when both WebSocket and peer connection are ready
  useEffect(() => {
    if (isMounted.current && connectionState === 'connected' && initState === 'ready' && appointmentId && user) {
      console.log('Both WebSocket and peer connection ready, joining call...');
      joinCall();
    }
  }, [connectionState, initState, appointmentId, user, joinCall]);

  // Register video call signal handler (must be after handleVideoCallSignal is defined)
  useEffect(() => {
    websocketClient.setOnVideoCallSignal(handleVideoCallSignal);
  }, [handleVideoCallSignal]);

  // Initialize on mount
  useEffect(() => {
    isMounted.current = true;

    if (appointmentId) {
      initializeCall();
    }

    return () => {
      isMounted.current = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);





  // Admit patient (doctor only)
  const admitPatient = useCallback(async () => {
    if (!waitingPatient || !peerConnectionRef.current || !appointmentId || !user?.id) return;

    if (connectionState !== 'connected') {
      toast.error('Connection lost. Please wait for reconnection.');
      return;
    }

    try {
      console.log('📤 [DOCTOR] Creating OFFER for patient:', waitingPatient.name);
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      console.log('📤 [DOCTOR] Sending OFFER via WebSocket');

      websocketClient.sendVideoCallOffer(appointmentId, {
        fromUserId: user.id,
        offer: offer.sdp!
      });

      console.log('✅ [DOCTOR] Offer sent successfully');
      toast.success(`Connecting to ${waitingPatient.name}...`);
      setAdmittedPatient(waitingPatient);
      setWaitingPatient(null);

    } catch (error) {
      console.error('❌ [DOCTOR] Error admitting patient:', error);
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

  // Toggle video (Hardware Stop/Start)
  const toggleVideo = useCallback(async () => {
    try {
      if (callState.isVideoEnabled) {
        // Turning OFF: Stop the tracks completely to turn off hardware light
        if (localStreamRef.current) {
          const videoTracks = localStreamRef.current.getVideoTracks();
          videoTracks.forEach(track => {
            track.stop(); // This turns off the camera light
            localStreamRef.current?.removeTrack(track);
          });
        }
        setCallState(prev => ({ ...prev, isVideoEnabled: false }));

        // Notify peer of mute (optional, depending on requirements, but stopping track usually sends black)
      } else {
        // Turning ON: Re-acquire camera
        setCallState(prev => ({ ...prev, isVideoEnabled: true })); // Optimistic update

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: 15 }
        });

        const newVideoTrack = stream.getVideoTracks()[0];

        if (localStreamRef.current) {
          localStreamRef.current.addTrack(newVideoTrack);
        } else {
          // Should not happen if audio is still there, but safe fallback
          localStreamRef.current = stream;
        }

        // Update global tracker
        if (globalLocalStream) {
          // Remove old video tracks from global stream if any exist (cleanup)
          globalLocalStream.getVideoTracks().forEach(t => t.stop());
          globalLocalStream.addTrack(newVideoTrack);
        } else {
          globalLocalStream = localStreamRef.current;
        }
        setLocalStream(localStreamRef.current); // Update state to trigger re-render

        // Update local video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        // Replace track in PeerConnection for remote viewer
        if (peerConnectionRef.current) {
          const videoSender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
          if (videoSender) {
            await videoSender.replaceTrack(newVideoTrack);
          } else {
            // If we didn't have a sender before (started without video), add it
            peerConnectionRef.current.addTrack(newVideoTrack, localStreamRef.current!);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling video:', error);
      toast.error('Failed to access camera');
      setCallState(prev => ({ ...prev, isVideoEnabled: false })); // Revert state on error
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
    <div className="w-full max-w-6xl mx-auto h-full relative bg-white rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-400' :
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
      <div className="w-full flex-1 relative bg-slate-900 min-h-[500px]">
        {/* Remote video */}
        {remoteStream ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <video
              key={`remote-${remoteStream.id}`}
              ref={remoteVideoCallbackRef}
              autoPlay
              playsInline
              muted={false}
              className="w-full h-full object-contain"
              style={{ background: '#000' }}
            />
            <div className="absolute top-4 right-4 bg-emerald-500/80 text-white text-[10px] px-2 py-1 rounded font-bold tracking-wider z-20">
              LIVE • REMOTECONNECTED
            </div>

            {/* Manual Fix Button - Helpful for autoplay blocks or rendering glitches */}
            <button
              onClick={() => {
                if (remoteStream && remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play().catch(console.error);
                }
              }}
              className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-[10px] text-white/50 hover:text-white px-2 py-1 rounded transition-colors z-30"
            >
              Fix Video/Audio
            </button>
          </div>
        ) : isDoctor && !admittedPatient ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-800 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              {waitingPatient ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Monitor className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">{waitingPatient.name} is ready</h4>
                  <p className="text-gray-600 mb-6 text-lg">Ready for your consultation. Start the video call now.</p>
                  <Button onClick={admitPatient} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
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
        {localStream && (
          <div className="absolute bottom-24 right-6 w-36 h-24 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/40 z-30">
            <video
              key={localStream.id}
              ref={localVideoCallbackRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              You (Local)
              <div className="w-8 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75"
                  style={{ width: `${Math.min(100, localAudioLevel * 2)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Participant name overlay */}
        {(admittedPatient || (!isDoctor && remoteStream)) && (
          <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-2xl border border-white/10 z-30 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs text-white/60 font-medium uppercase tracking-wider mb-0.5">
                {isDoctor ? 'In Consultation' : 'Secure Visit'}
              </span>
              <div className="flex items-center gap-2">
                {isDoctor ? (admittedPatient?.name || 'Patient') : 'Doctor'}
                {remoteAudioActive ? (
                  <Mic className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                ) : (
                  <MicOff className="h-3.5 w-3.5 text-red-400" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Container */}
      {(callState.isInCall || localStream) && (
        <div className="bg-slate-950 p-6 flex justify-center items-center gap-8 border-t border-white/5">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleMute}
              className={`rounded-full w-14 h-14 p-0 transition-all ${callState.isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
            >
              {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={toggleVideo}
              className={`rounded-full w-14 h-14 p-0 transition-all ${!callState.isVideoEnabled
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
            >
              {callState.isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-14 h-14 p-0 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>

          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => initializeCall()}
              className="text-slate-500 hover:text-white text-[10px] uppercase font-bold"
            >
              Reconnect
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="bg-white/5 text-slate-300 hover:bg-white/10 rounded-full h-10 w-10 p-0"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {showChat && callState.isInCall && (
        <div className="absolute top-16 right-0 w-80 h-[calc(100%-4rem)] bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-200 z-30 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
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
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${connectionState === 'connected'
          ? 'bg-green-100 text-green-800'
          : connectionState === 'connecting'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
          }`}>
          <div className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-500' :
            connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          {connectionState}
        </div>
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${callState.connectionQuality === 'good'
          ? 'bg-green-100 text-green-800'
          : callState.connectionQuality === 'fair'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
          }`}>
          <div className={`w-2 h-2 rounded-full ${callState.connectionQuality === 'good' ? 'bg-green-500' :
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
