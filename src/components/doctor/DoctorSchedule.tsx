import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Calendar as CalendarIcon, Clock, Plus, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { doctorAPI } from '../../lib/api-client';
import { toast } from 'sonner';
import { Appointment } from '../../types';

interface IndividualSlot {
  id: string;
  parentSlotId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  patientId?: string;
  patientName?: string;
}

interface ScheduleSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxAppointments: number;
  appointmentDuration: number; // 15, 30, 45, or 60 minutes
  appointmentType: string;
  notes: string;
  generatedSlots?: IndividualSlot[];
}

export const DoctorSchedule = () => {
  const { user } = useAuth();
  const { appointments } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);

  // Form state
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAppointments, setMaxAppointments] = useState(1);
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [appointmentType, setAppointmentType] = useState('general');
  const [isAvailable, setIsAvailable] = useState(true);


  // Helper function to generate time slots
  const generateTimeSlots = (startTime: string, endTime: string, duration: number): IndividualSlot[] => {
    const slots: IndividualSlot[] = [];
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const durationMs = duration * 60 * 1000; // Convert minutes to milliseconds

    let current = new Date(start);
    let id = 1;

    while (current < end) {
      const nextTime = new Date(current.getTime() + durationMs);
      if (nextTime > end) break;

      slots.push({
        id: `${Date.now()}-${id}`,
        parentSlotId: '', // Will be set when creating the slot
        startTime: current.toTimeString().slice(0, 5),
        endTime: nextTime.toTimeString().slice(0, 5),
        isBooked: false
      });

      current = nextTime;
      id++;
    }

    return slots;
  };

  useEffect(() => {
    if (user?.id) {
      loadScheduleData();
    }
  }, [user, selectedDate]);

  const loadScheduleData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Call the actual API to get schedule data
      const scheduleData = await doctorAPI.getSchedule(user.id);

      // Transform the API response to match our component's data structure
      const transformedSlots: ScheduleSlot[] = scheduleData.availableSlots.map((slot: any) => ({
        id: slot.id.toString(),
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        maxAppointments: 1, // Default value, can be updated based on API
        appointmentDuration: 30, // Default value, can be updated based on API
        appointmentType: 'general', // Default value, can be updated based on API
        notes: slot.notes || '',
        generatedSlots: [] // Will be populated if needed
      }));

      setScheduleSlots(transformedSlots);
    } catch (error) {
      console.error('Error loading schedule data:', error);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!slotDate || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate time: end time should be after start time
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const slotData = {
        date: slotDate,
        startTime,
        endTime,
        maxAppointments
      };

      await doctorAPI.addScheduleSlot(user.id, slotData);
      toast.success('Schedule slot added successfully');
      loadScheduleData(); // Refresh the data

      // Reset form
      resetForm();
      setShowAddSlot(false);
    } catch (error) {
      console.error('Error adding schedule slot:', error);
      toast.error('Failed to add schedule slot');
    }
  };

  const handleEditSlot = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    setSlotDate(slot.date);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setMaxAppointments(slot.maxAppointments);
    setAppointmentType(slot.appointmentType);
    setIsAvailable(slot.isAvailable);
    setShowAddSlot(true);
  };

  const handleUpdateSlot = async () => {
    if (!editingSlot) return;

    // Validate time: end time should be after start time
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const slotData = {
        date: slotDate,
        startTime,
        endTime,
        maxAppointments
      };

      await doctorAPI.updateScheduleSlot(user.id, editingSlot.id, slotData);
      toast.success('Schedule slot updated successfully');
      loadScheduleData(); // Refresh the data

      resetForm();
      setEditingSlot(null);
      setShowAddSlot(false);
    } catch (error) {
      console.error('Error updating schedule slot:', error);
      toast.error('Failed to update schedule slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this schedule slot?');
    if (!confirmed) return;

    try {
      await doctorAPI.deleteScheduleSlot(user.id, slotId);
      toast.success('Schedule slot deleted successfully');
      loadScheduleData();
    } catch (error) {
      console.error('Error deleting schedule slot:', error);
      toast.error('Failed to delete schedule slot');
    }
  };

  const resetForm = () => {
    setSlotDate('');
    setStartTime('');
    setEndTime('');
    setMaxAppointments(1);
    setAppointmentType('general');
    setIsAvailable(true);
  };

  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return scheduleSlots.filter(slot => slot.date === dateString);
  };

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateString);
  };

  const selectedDateSlots = getSlotsForSelectedDate();
  const selectedDateAppointments = getAppointmentsForSelectedDate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading schedule...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">My Schedule</h1>
          <p className="text-gray-600">Manage your availability and appointments</p>
        </div>
        <Dialog open={showAddSlot} onOpenChange={setShowAddSlot}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setEditingSlot(null);
              // Pre-fill the date with selected date
              if (selectedDate) {
                setSlotDate(selectedDate.toISOString().split('T')[0]);
              }
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSlot ? 'Edit Schedule Slot' : 'Add Schedule Slot'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Appointments</Label>
                  <Input
                    type="number"
                    min="1"
                    max="25"
                    value={maxAppointments}
                    onChange={(e) => setMaxAppointments(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                  <Label htmlFor="available">Available</Label>
                </div>
              </div>


            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddSlot(false)}>
                Cancel
              </Button>
              <Button onClick={editingSlot ? handleUpdateSlot : handleAddSlot}>
                {editingSlot ? 'Update Slot' : 'Add Slot'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Schedule Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateSlots.length > 0 ? (
                selectedDateSlots.map((slot) => (
                  <div key={slot.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={slot.isAvailable ? 'default' : 'secondary'}>
                            {slot.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                          <Badge variant="outline">{slot.appointmentType}</Badge>
                        </div>
                        <p className="text-sm font-medium">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-xs text-gray-600">
                          Max {slot.maxAppointments} appointment{slot.maxAppointments > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEditSlot(slot)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteSlot(slot.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {slot.notes && (
                      <p className="text-xs text-gray-600 mt-2">{slot.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No schedule slots for selected date</p>
                  <p className="text-sm">Add a time slot to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium">{appointment.patientName}</h4>
                        <p className="text-xs text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{appointment.type}</Badge>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No appointments for selected date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const daySlots = scheduleSlots.filter(slot => {
                const slotDate = new Date(`${slot.date}T00:00:00`);
                return slotDate.getDay() === index;
              });

              const dayAppointments = appointments.filter(app => {
                if (!app.date) return false;
                const appointmentDate = new Date(`${app.date}T00:00:00`);
                return appointmentDate.getDay() === index;
              });

              return (
                <div key={day} className="text-center p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">{day}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-600">{daySlots.filter(s => s.isAvailable).length} slots</p>
                    <p className="text-green-600">{dayAppointments.length} appointments</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
