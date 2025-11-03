import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar, Clock, User, Stethoscope, MapPin, Video, MessageSquare, Building2, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api-client';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  hospitalName?: string;
  hospitalId?: string;
  type: 'VIDEO' | 'CHAT' | 'INPERSON' | 'HOSPITAL';
  status: 'UPCOMING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Load appointments data
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast.error('Failed to load appointments data');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Handle status filter change
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Handle type filter change
  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = statusFilter === 'all' || appointment.status?.toLowerCase() === statusFilter.toLowerCase();
    const typeMatch = typeFilter === 'all' || appointment.type?.toLowerCase() === typeFilter.toLowerCase();
    return statusMatch && typeMatch;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge className="bg-orange-100 text-orange-800">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  // Get type icon and label
  const getTypeInfo = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return { icon: Video, label: 'Video Call', color: 'text-blue-600' };
      case 'chat':
        return { icon: MessageSquare, label: 'Chat', color: 'text-green-600' };
      case 'inperson':
        return { icon: MapPin, label: 'In-Person', color: 'text-orange-600' };
      case 'hospital':
        return { icon: Building2, label: 'Hospital', color: 'text-purple-600' };
      default:
        return { icon: Calendar, label: type || 'Unknown', color: 'text-gray-600' };
    }
  };

  // Handle appointment actions
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await api.admin.confirmAppointment(appointmentId);
      toast.success('Appointment confirmed successfully');
      loadAppointments(); // Refresh data
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await api.admin.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      loadAppointments(); // Refresh data
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await api.admin.completeAppointment(appointmentId);
      toast.success('Appointment marked as completed');
      loadAppointments(); // Refresh data
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      toast.error('Failed to complete appointment');
    }
  };

  // Group appointments by status for stats
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'UPCOMING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Appointment Management</h1>
        <p className="text-gray-600">Monitor and manage all system appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.upcoming}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.confirmed}</div>
            <p className="text-xs text-gray-600 mt-1">Approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.completed}</div>
            <p className="text-xs text-gray-600 mt-1">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.cancelled}</div>
            <p className="text-xs text-gray-600 mt-1">Not completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="inperson">In-Person</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const typeInfo = getTypeInfo(appointment.type);
                    const TypeIcon = typeInfo.icon;

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{appointment.patientName}</div>
                              <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{appointment.doctorName}</div>
                              <div className="text-sm text-gray-500">ID: {appointment.doctorId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                            <span className="text-sm">{typeInfo.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}</div>
                            <div className="text-gray-500">{appointment.appointmentTime || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          {appointment.hospitalName ? (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-gray-500" />
                              <span className="text-sm">{appointment.hospitalName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {appointment.status === 'UPCOMING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {appointment.status === 'CONFIRMED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-purple-600 hover:text-purple-700"
                                onClick={() => handleCompleteAppointment(appointment.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found</p>
              <p className="text-sm text-gray-500 mt-1">
                {statusFilter !== 'all' || typeFilter !== 'all' ?
                  'Try adjusting your filters' :
                  'Appointment records will appear here'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
