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
import { API_URL } from '../../lib/config';
import { toast } from 'sonner';

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

interface Appointment {
  id: string;
  patientName: string;
  type: string;
  status: string;
  time: string;
  reason: string;
}

export const DoctorSchedule = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);

  // Form state
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAppointments, setMaxAppointments] = useState(1);
  const [appointmentType, setAppointmentType] = useState('general');
  const [isAvailable, setIsAvailable] = useState(true);
  const [slotNotes, setSlotNotes] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadScheduleData();
    }
  }, [user, selectedDate]);

  const loadScheduleData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Call the backend API to get schedule data
      const response = await fetch(`${API_URL}/doctors/${user.id}/schedule`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schedule data');
      }

      const scheduleData = await response.json();

      // Transform the backend data to match our frontend interface
      const slots: ScheduleSlot[] = (scheduleData.availableSlots || []).map((slot: any) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable,
        maxAppointments: slot.maxAppointments,
        appointmentType: slot.appointmentType,
        notes: slot.notes
      }));

      // For appointments, we need to get them from the appointments API
      // For now, we'll keep mock appointments until we have the full appointments API
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientName: 'John Doe',
          type: 'general',
          status: 'confirmed',
          time: '09:00',
          reason: 'Regular checkup'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          type: 'followup',
          status: 'confirmed',
          time: '10:00',
          reason: 'Follow-up visit'
        }
      ];

      setScheduleSlots(slots);
      setAppointments(mockAppointments);
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

    try {
      const slotData = {
        date: slotDate,
        startTime,
        endTime,
        isAvailable,
        maxAppointments,
        appointmentType,
        notes: slotNotes
      };

      const response = await fetch(`${API_URL}/doctors/${user?.id}/schedule/slots`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slotData),
      });

      if (!response.ok) {
        throw new Error('Failed to add schedule slot');
      }

      const result = await response.json();

      // Add the new slot to the local state
      const newSlot: ScheduleSlot = {
        id: result.id,
        date: slotDate,
        startTime,
        endTime,
        isAvailable,
        maxAppointments,
        appointmentType,
        notes: slotNotes
      };

      setScheduleSlots(prev => [...prev, newSlot]);
      toast.success('Schedule slot added successfully');

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
    setSlotNotes(slot.notes);
    setShowAddSlot(true);
  };

  const handleUpdateSlot = async () => {
    if (!editingSlot) return;

    try {
      const slotData = {
        date: slotDate,
        startTime,
        endTime,
        isAvailable,
        maxAppointments,
        appointmentType,
        notes: slotNotes
      };

      const response = await fetch(`${API_URL}/doctors/${user?.id}/schedule/slots/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slotData),
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule slot');
      }

      const updatedSlot: ScheduleSlot = {
        ...editingSlot,
        date: slotDate,
        startTime,
        endTime,
        isAvailable,
        maxAppointments,
        appointmentType,
        notes: slotNotes
      };

      setScheduleSlots(prev => prev.map(slot =>
        slot.id === editingSlot.id ? updatedSlot : slot
      ));

      toast.success('Schedule slot updated successfully');
      resetForm();
      setEditingSlot(null);
      setShowAddSlot(false);
    } catch (error) {
      console.error('Error updating schedule slot:', error);
      toast.error('Failed to update schedule slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule slot?')) {
      try {
        const response = await fetch(`${API_URL}/doctors/${user?.id}/schedule/slots/${slotId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete schedule slot');
        }

        setScheduleSlots(prev => prev.filter(slot => slot.id !== slotId));
        toast.success('Schedule slot deleted successfully');
      } catch (error) {
        console.error('Error deleting schedule slot:', error);
        toast.error('Failed to delete schedule slot');
      }
    }
  };

  const resetForm = () => {
    setSlotDate('');
    setStartTime('');
    setEndTime('');
    setMaxAppointments(1);
    setAppointmentType('general');
    setIsAvailable(true);
    setSlotNotes('');
  };

  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return scheduleSlots.filter(slot => slot.date === dateString);
  };

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return appointments.filter(app => {
      // In a real implementation, we'd have appointment dates
      // For now, we'll show all appointments
      return true;
    });
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
            <Button onClick={() => { resetForm(); setEditingSlot(null); }}>
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
                    max="10"
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

              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes for this time slot..."
                  value={slotNotes}
                  onChange={(e) => setSlotNotes(e.target.value)}
                  rows={3}
                />
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
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const daySlots = scheduleSlots.filter(slot => {
                const slotDate = new Date(slot.date);
                return slotDate.getDay() === (index + 1) % 7; // Adjust for Monday start
              });

              const dayAppointments = appointments.filter(app => {
                // In a real implementation, we'd filter by day
                return true;
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
