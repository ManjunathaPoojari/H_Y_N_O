import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { hospitalAPI } from '../../lib/api-client';
import { Patient, Doctor, Appointment } from '../../types';

interface HospitalPatientDetailsProps {
  patientId: string;
  onNavigate: (path: string) => void;
}

export const HospitalPatientDetails: React.FC<HospitalPatientDetailsProps> = ({ patientId, onNavigate }) => {
  const { appointments, doctors } = useAppStore();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (user?.id) {
        try {
          const patients = await hospitalAPI.getPatients(user.id);
          const foundPatient = patients.find(p => p.id === patientId);
          setPatient(foundPatient || null);
        } catch (error) {
          console.error('Error fetching patient:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPatient();
  }, [user?.id, patientId]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  const stats = getPatientStats(patient.id, appointments);
  const patientDoctors = getPatientDoctors(patient.id, appointments, doctors);
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => onNavigate('/hospital/patients')} className="text-blue-600 hover:underline">← Back to Patients</button>
        <h1 className="text-3xl">Patient Details - {patient.name}</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {patient.name}</div>
            <div><strong>Age:</strong> {patient.age} years</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Blood Group:</strong> {patient.bloodGroup || 'Not specified'}</div>
            <div><strong>Email:</strong> {patient.email}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div className="col-span-2"><strong>Address:</strong> {patient.address}</div>
            {patient.emergencyContact && (
              <div className="col-span-2"><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(patient.allergies && patient.allergies.length > 0) && (
              <div>
                <strong className="text-red-600">Allergies:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {patient.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-red-600 border-red-600">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(patient.medicalHistory && patient.medicalHistory.length > 0) && (
              <div>
                <strong className="text-blue-600">Medical History:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {patient.medicalHistory.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(!patient.allergies || patient.allergies.length === 0) && (!patient.medicalHistory || patient.medicalHistory.length === 0) && (
              <p className="text-gray-500">No medical history recorded.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment History */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment History ({patientAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {patientAppointments.length > 0 ? (
              patientAppointments
                .sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((appointment: Appointment) => (
                  <div key={appointment.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{appointment.date} at {appointment.time}</div>
                        <div className="text-sm text-gray-600">
                          Dr. {doctors.find((d: Doctor) => d.id === appointment.doctorId)?.name || 'Unknown'}
                        </div>
                        {appointment.reason && (
                          <div className="text-sm text-gray-600">Reason: {appointment.reason}</div>
                        )}
                      </div>
                      <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No appointments found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getPatientStats = (patientId: string, appointments: Appointment[]) => {
  const patientAppointments = appointments.filter(a => a.patientId === patientId);
  const completedAppointments = patientAppointments.filter(a => a.status === 'completed');
  const upcomingAppointments = patientAppointments.filter(a => a.status === 'booked');

  return {
    totalAppointments: patientAppointments.length,
    completedAppointments: completedAppointments.length,
    upcomingAppointments: upcomingAppointments.length,
    lastVisit: completedAppointments.length > 0
      ? completedAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : null
  };
};

const getPatientDoctors = (patientId: string, appointments: Appointment[], doctors: Doctor[]) => {
  const patientDoctorIds = new Set(
    appointments
      .filter(a => a.patientId === patientId)
      .map(a => a.doctorId)
  );
  return doctors.filter(d => patientDoctorIds.has(d.id));
};
