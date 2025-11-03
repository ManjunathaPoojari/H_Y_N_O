import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { api, apiCall } from '../../lib/api-client';
import { Hospital, Doctor, ScheduleSlot } from '../../types';

interface AppointmentBookingProps {
  onBookingComplete?: (appointment: any) => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onBookingComplete }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load hospitals on component mount
  useEffect(() => {
    loadHospitals();
  }, []);

  // Load doctors when hospital is selected
  useEffect(() => {
    if (selectedHospital) {
      loadDoctors(selectedHospital);
    } else {
      setDoctors([]);
      setSelectedDoctor('');
    }
  }, [selectedHospital]);

  // Load slots when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      loadSlots(selectedDoctor);
    } else {
      setSlots([]);
      setSelectedSlot('');
    }
  }, [selectedDoctor]);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await api.hospitals.getAll();
      setHospitals(data);
    } catch (err) {
      setError('Failed to load hospitals');
      console.error('Error loading hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async (hospitalId: string) => {
    try {
      setLoading(true);
      // Use axios chain call to get doctors by hospital
      const hospitalDoctors = await api.hospitals.getDoctors(hospitalId);
      setDoctors(hospitalDoctors);
    } catch (err) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (doctorId: string) => {
    try {
      setLoading(true);
      const scheduleData = await api.doctors.getSchedule(doctorId);
      setSlots(scheduleData.availableSlots || []);
    } catch (err) {
      setError('Failed to load available slots');
      console.error('Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedDoctor || !selectedHospital) {
      setError('Please select all required fields');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');

      // Get current user (assuming patient context)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Step 1: Create PENDING appointment
      const appointmentData = {
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: selectedDoctor,
        doctorName: doctors.find(d => d.id === selectedDoctor)?.name || '',
        hospitalId: selectedHospital,
        type: 'inperson', // Default to in-person, can be made configurable
        date: slots.find(s => s.id === selectedSlot)?.date || '',
        time: slots.find(s => s.id === selectedSlot)?.startTime || '',
        status: 'pending',
        reason: 'General consultation', // Can be made configurable
        scheduleSlot: { id: selectedSlot } // Include slot reference
      };

      const appointment = await api.appointments.create(appointmentData);

      // Step 2: Process payment (assuming payment is required)
      const paymentData = {
        appointmentId: appointment.id,
        patientId: currentUser.id,
        amount: 500, // Default consultation fee, can be made dynamic
        method: 'card', // Default payment method
        status: 'pending'
      };

      const payment = await api.payments.create(paymentData);

      // Step 3: Process payment (simulate payment processing)
      const processedPayment = await api.payments.process(payment.id);

      // Step 4: Update appointment status to BOOKED on successful payment
      if (processedPayment.status === 'completed') {
        await api.appointments.update(appointment.id, { status: 'booked' });

        if (onBookingComplete) {
          onBookingComplete({ ...appointment, status: 'booked' });
        }

        // Reset form
        setSelectedHospital('');
        setSelectedDoctor('');
        setSelectedSlot('');
        alert('Appointment booked successfully!');
      } else {
        // Payment failed - cancel the appointment
        await api.appointments.update(appointment.id, { status: 'cancelled' });
        setError('Payment failed. Please try again.');
      }

    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Error booking appointment:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const getSlotStatusColor = (slot: ScheduleSlot) => {
    if (!slot.isAvailable) return 'bg-red-100 text-red-800';
    if (slot.status === 'reserved') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSlotStatusText = (slot: ScheduleSlot) => {
    if (!slot.isAvailable) return 'Booked';
    if (slot.status === 'reserved') return 'Reserved';
    return 'Available';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Hospital Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Hospital
          </label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a hospital...</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name} - {hospital.city}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || !selectedHospital}
          >
            <option value="">
              {selectedHospital ? 'Choose a doctor...' : 'Select hospital first'}
            </option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Slot Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot
          </label>
          {loading && selectedDoctor ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading available slots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {slots.length === 0 && selectedDoctor ? (
                <p className="col-span-full text-center text-gray-500 py-4">
                  No available slots for this doctor
                </p>
              ) : (
                slots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => slot.isAvailable && setSelectedSlot(slot.id)}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${
                      selectedSlot === slot.id
                        ? 'border-blue-500 bg-blue-50'
                        : slot.isAvailable
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-sm text-gray-600">{slot.date}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getSlotStatusColor(slot)}`}
                      >
                        {getSlotStatusText(slot)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {slot.availableSpots} spots available
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBookAppointment}
          disabled={!selectedSlot || bookingLoading}
          className="w-full py-3 text-lg"
        >
          {bookingLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Booking...
            </div>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
