import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Video, MessageSquare, MapPin, Building2, Star } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';

interface BookAppointmentProps {
  type: 'video' | 'chat' | 'inperson' | 'hospital';
}

export const BookAppointment: React.FC<BookAppointmentProps> = ({ type }) => {
  const { doctors, hospitals, bookAppointment } = useAppStore();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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

  const availableDoctors = type === 'hospital' 
    ? doctors.filter(d => d.hospitalId && d.available && d.status === 'approved')
    : doctors.filter(d => d.available && d.status === 'approved');

  const handleBooking = () => {
    if (!selectedDoctor || !date || !time || !reason) {
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return;

    bookAppointment({
      patientId: user?.id || 'P001',
      patientName: user?.name || 'Patient',
      doctorId: doctor.id,
      doctorName: doctor.name,
      hospitalId: selectedHospital || undefined,
      type: type,
      date,
      time,
      status: type === 'hospital' ? 'pending' : 'upcoming',
      reason,
    });

    // Reset form
    setSelectedDoctor('');
    setSelectedHospital('');
    setDate('');
    setTime('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          {icons[type]}
          {titles[type]}
        </h1>
        <p className="text-gray-600">Select a doctor and choose your preferred time slot</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hospital Selection (for hospital appointments) */}
          {type === 'hospital' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Hospital</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHospitals.filter(h => h.status === 'approved').map((hospital) => (
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
          )}

          {/* Doctor Selection */}
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

          {/* Appointment Details */}
          {selectedDoctor && (
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-9"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

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
                  disabled={!selectedDoctor || !date || !time || !reason}
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
              {selectedDoctor ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Consultation Type</p>
                    <Badge className="capitalize">{type}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Doctor</p>
                    <p>{doctors.find(d => d.id === selectedDoctor)?.name}</p>
                    <p className="text-sm text-gray-500">
                      {doctors.find(d => d.id === selectedDoctor)?.specialization}
                    </p>
                  </div>

                  {type === 'hospital' && selectedHospital && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hospital</p>
                      <p>{hospitals.find(h => h.id === selectedHospital)?.name}</p>
                    </div>
                  )}

                  {date && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p>{new Date(date).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  )}

                  {time && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p>{time}</p>
                    </div>
                  )}

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
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">Select a doctor to see booking summary</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
