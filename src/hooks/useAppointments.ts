import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  trainerId: string;
  date: Date;
  time: string;
  mode: 'virtual' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isJoiningSession, setIsJoiningSession] = useState(false);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('yoga-appointments');
    if (savedAppointments) {
      try {
        const parsedAppointments = JSON.parse(savedAppointments).map((apt: any) => ({
          ...apt,
          date: new Date(apt.date) // Convert date strings back to Date objects
        }));
        setAppointments(parsedAppointments);
      } catch (error) {
        console.error('Error loading appointments from localStorage:', error);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('yoga-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
    };

    setAppointments(prev => [...prev, newAppointment]);
    toast.success('Appointment booked successfully!');
    return newAppointment;
  }, []);

  const cancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId
        ? { ...apt, status: 'cancelled' as const }
        : apt
    ));
    toast.success('Appointment cancelled successfully');
  }, []);

  const rescheduleAppointment = useCallback((appointmentId: string, newDate: Date, newTime: string) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId
        ? { ...apt, date: newDate, time: newTime }
        : apt
    ));
    toast.success('Appointment rescheduled successfully!');
  }, []);

  const joinSession = useCallback(async (appointment: Appointment, onNavigate: (path: string) => void) => {
    setIsJoiningSession(true);

    try {
      // Check if appointment is within valid time window (e.g., within 15 minutes of scheduled time)
      const now = new Date();
      const appointmentDateTime = new Date(appointment.date);
      const [hours, minutes] = appointment.time.split(':');
      const [period] = appointment.time.split(' ');

      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;

      appointmentDateTime.setHours(hour24, parseInt(minutes), 0, 0);

      const timeDiff = Math.abs(now.getTime() - appointmentDateTime.getTime()) / (1000 * 60); // minutes

      if (timeDiff > 15) {
        toast.error('You can only join sessions within 15 minutes of the scheduled time');
        return;
      }

      // Navigate to video call with appointment details
      onNavigate(`/video-call?appointmentId=${appointment.id}`);

    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Failed to join session. Please try again.');
    } finally {
      setIsJoiningSession(false);
    }
  }, []);

  const getUpcomingAppointments = useCallback(() => {
    return appointments.filter(apt => apt.status === 'upcoming');
  }, [appointments]);

  const getCompletedAppointments = useCallback(() => {
    return appointments.filter(apt => apt.status === 'completed');
  }, [appointments]);

  const getAppointmentById = useCallback((id: string) => {
    return appointments.find(apt => apt.id === id);
  }, [appointments]);

  return {
    appointments,
    isJoiningSession,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    joinSession,
    getUpcomingAppointments,
    getCompletedAppointments,
    getAppointmentById,
  };
};
