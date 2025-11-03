import { VideoCall as CommonVideoCall } from '../common/VideoCall';

interface VideoCallProps {
  appointmentId?: string;
  patientId?: string;
}

export const VideoCall = ({ appointmentId, patientId }: VideoCallProps) => {
  return <CommonVideoCall appointmentId={appointmentId} />;
};
