import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Video, MessageSquare, MapPin, Building2, Star, Loader2 } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';
import api from '../../lib/api-client';

interface BookAppointmentProps {
  type: 'video' | 'chat' | 'inperson' | 'hospital';
}

interface ScheduleSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxAppointments: number;
  appointmentType: string;
  notes: string;
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({ type }) => {
  const { doctors, hospitals, bookAppointment } = useAppStore();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<ScheduleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [reason, setReason] = useState('');

  const titles = {
    video: 'Book Video Consultation',
    chat: 'Book Chat Consultation',
    inperson: 'Book In-Person Appointment',
    hospital: 'Book Hospital Appointment',
  };

  const icons = {
    video: <Video className="h-5 w-5" />,
    chat: <MessageSquare className="h-5 w-5" />,
    inperson: <MapPin className="h-5 w-5" />,
    hospital: <Building2 className="h-5 w-5" />,
  };

  const availableDoctors = selectedHospital
    ? doctors.filter(d => d.hospitalId === selectedHospital && d.available && d.status === 'approved')
    : doctors.filter(d => d.available && d.status === 'approved');

  // Fetch available slots when doctor is selected (or hospital for hospital appointments)
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (type === 'hospital' && !selectedHospital) {
        setAvailableSlots([]);
        return;
      }
      if (type !== 'hospital' && !selectedDoctor) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        if (type === 'hospital') {
          // For hospital appointments, fetch hospital-wide slots
          const scheduleData = await api.hospitals.getSchedule(selectedHospital);
          const slots = scheduleData.availableSlots || [];
          // Filter only available slots for future dates
          const now = new Date();
          const futureSlots = slots.filter((slot: ScheduleSlot) => {
            const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
            return slot.isAvailable && slotDateTime > now;
          });
          setAvailableSlots(futureSlots);
        } else {
          // For doctor appointments, fetch doctor-specific slots
          const scheduleData = await api.doctors.getSchedule(selectedDoctor);
          const slots = scheduleData.availableSlots || [];
          // Filter only available slots for future dates
          const now = new Date();
          const futureSlots = slots.filter((slot: ScheduleSlot) => {
            const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
            return slot.isAvailable && slotDateTime > now;
          });
          setAvailableSlots(futureSlots);
        }
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
        toast.error('Failed to load available time slots');
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDoctor, selectedHospital, type]);

  const handleBooking = async () => {
    if (type === 'hospital' && (!selectedHospital || !selectedSlot || !reason)) {
      toast.error('Please select a hospital, time slot, and provide a reason');
      return;
    }
    if (type !== 'hospital' && (!selectedDoctor || !selectedSlot || !reason)) {
      toast.error('Please select a doctor, time slot, and provide a reason');
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      toast.error('Please log in to book an appointment');
      return;
    }

    const doctor = selectedDoctor ? doctors.find(d => d.id === selectedDoctor) : null;
    const slot = availableSlots.find(s => s.id === selectedSlot);

    if ((type !== 'hospital' && !doctor) || !slot) {
      toast.error('Invalid doctor or time slot selected');
      return;
    }

    try {
      // Book the primary appointment
      await bookAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: doctor?.id || undefined,
        doctorName: doctor?.name || 'Hospital Appointment',
        hospitalId: selectedHospital || undefined,
        type: type,
        date: slot.date,
        time: slot.startTime,
        status: 'pending', // All appointments start as pending for doctor approval
        reason,
      });

      // If booking a video consultation, also create a chat consultation for follow-up
      if (type === 'video') {
        await bookAppointment({
          patientId: user.id,
          patientName: user.name,
          doctorId: doctor?.id || undefined,
          doctorName: doctor?.name || 'Hospital Appointment',
          hospitalId: selectedHospital || undefined,
          type: 'chat',
          date: slot.date,
          time: slot.startTime,
          status: 'pending',
          reason: `${reason} (Follow-up chat for video consultation)`,
        });
      }

      toast.success('Appointment booked successfully!');

      // Reset form
      setSelectedDoctor('');
      setSelectedHospital('');
      setSelectedSlot('');
      setReason('');
      setAvailableSlots([]);

      // Navigate to My Appointments page
      window.location.href = '/patient/appointments';
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          {icons[type]}
          {titles[type]}
        </h1>
      <p className="text-gray-600">Select a hospital/clinic, doctor and choose your preferred time slot</p>
      {type === 'video' && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Booking a video consultation also creates a chat consultation for follow-up purposes.
          </p>
        </div>
      )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hospital Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Hospital/Clinic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hospitals.filter(h => h.status === 'approved').map((hospital) => (
                  <div
                    key={hospital.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedHospital === hospital.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedHospital(hospital.id)}
                  >
                    <h4 className="mb-1">{hospital.name}</h4>
                    <p className="text-sm text-gray-600">{hospital.address}, {hospital.city}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hospital.facilities.slice(0, 4).map((facility) => (
                        <Badge key={facility} variant="secondary" className="text-xs">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Doctor Selection */}
          {selectedHospital && type !== 'hospital' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Doctor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDoctor === doctor.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{doctor.name}</h4>
                            <Badge variant="secondary">Available</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                          <p className="text-xs text-gray-500">{doctor.qualification}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>{doctor.experience} years exp.</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {doctor.rating}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Consultation Fee</p>
                          <p className="text-lg">₹{doctor.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Time Slots */}
          {selectedHospital && (selectedDoctor || type === 'hospital') && (
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading available slots...</span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="space-y-3">
                    <Label>Select a time slot</Label>
                    <div className="grid gap-3">
                      {availableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedSlot === slot.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium">
                                  {new Date(slot.date).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{slot.appointmentType}</Badge>
                              {slot.notes && (
                                <p className="text-xs text-gray-500 mt-1">{slot.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No available time slots for this {type === 'hospital' ? 'hospital' : 'doctor'}</p>
                    <p className="text-sm">Please select a different {type === 'hospital' ? 'hospital' : 'doctor'} or try again later</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Appointment Details */}
          {selectedHospital && (selectedDoctor || type === 'hospital') && selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Consultation</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms or reason for consultation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!reason.trim()}
                  onClick={handleBooking}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDoctor || (type === 'hospital' && selectedHospital) ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Consultation Type</p>
                    <Badge className="capitalize">{type}</Badge>
                  </div>

                  {selectedDoctor && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Doctor</p>
                      <p>{doctors.find(d => d.id === selectedDoctor)?.name}</p>
                      <p className="text-sm text-gray-500">
                        {doctors.find(d => d.id === selectedDoctor)?.specialization}
                      </p>
                    </div>
                  )}

                  {selectedHospital && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hospital/Clinic</p>
                      <p>{hospitals.find(h => h.id === selectedHospital)?.name}</p>
                    </div>
                  )}

                  {selectedSlot && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected Time Slot</p>
                      {(() => {
                        const slot = availableSlots.find(s => s.id === selectedSlot);
                        return slot ? (
                          <div>
                            <p className="font-medium">
                              {new Date(slot.date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <Badge variant="secondary" className="mt-1">{slot.appointmentType}</Badge>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {selectedDoctor && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Consultation Fee</span>
                        <span>₹{doctors.find(d => d.id === selectedDoctor)?.consultationFee}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Platform Fee</span>
                        <span>₹50</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span>Total</span>
                        <span className="text-lg">₹{(doctors.find(d => d.id === selectedDoctor)?.consultationFee || 0) + 50}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">Select a hospital/clinic and doctor to see booking summary</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
