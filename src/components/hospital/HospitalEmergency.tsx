import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  AlertTriangle,
  Phone,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  UserCheck,
  MessageSquare,
  Video
} from 'lucide-react';
import { EmergencyRequest } from '../../types';
import { useAppStore } from '../../lib/app-store';

export const HospitalEmergency = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'assigned' | 'in_progress' | 'completed'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notes, setNotes] = useState('');

  // Mock emergency requests data for hospital
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      patientPhone: '+1234567890',
      patientLocation: 'Emergency Ward',
      emergencyType: 'cardiac',
      severity: 'critical',
      symptoms: 'Chest pain, shortness of breath',
      description: 'Patient experiencing severe chest pain and difficulty breathing. Heart rate elevated.',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      priority: 5
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      patientPhone: '+1234567891',
      patientLocation: 'ICU',
      emergencyType: 'accident',
      severity: 'high',
      symptoms: 'Head injury, unconscious',
      description: 'Car accident victim with head trauma. Unconscious upon arrival.',
      status: 'assigned',
      assignedDoctorId: 'd1',
      assignedDoctorName: 'Dr. Sarah Johnson',
      requestedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      assignedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      priority: 4
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Mike Wilson',
      patientPhone: '+1234567892',
      emergencyType: 'respiratory',
      severity: 'medium',
      symptoms: 'Difficulty breathing, wheezing',
      description: 'Asthma attack. Patient has history of respiratory issues.',
      status: 'in_progress',
      assignedDoctorId: 'd2',
      assignedDoctorName: 'Dr. Robert Chen',
      requestedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      assignedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      priority: 3
    }
  ]);

  const { doctors } = useAppStore();

  // Filter doctors to only show hospital's doctors
  const hospitalDoctors = doctors.filter(doctor => doctor.hospitalId === 'H001' && doctor.available && doctor.status === 'approved');

  const filteredRequests = emergencyRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientPhone.includes(searchTerm) ||
                         request.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || request.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignDoctor = (request: EmergencyRequest) => {
    setSelectedRequest(request);
    setShowAssignDialog(true);
  };

  const handleAssignConfirm = () => {
    if (selectedRequest && selectedDoctor) {
      const doctor = hospitalDoctors.find(d => d.id === selectedDoctor);
      if (doctor) {
        setEmergencyRequests(prev => prev.map(request =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: 'assigned' as const,
                assignedDoctorId: doctor.id,
                assignedDoctorName: doctor.name,
                assignedAt: new Date().toISOString()
              }
            : request
        ));
      }
      setShowAssignDialog(false);
      setSelectedDoctor('');
      setNotes('');
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    setEmergencyRequests(prev => prev.map(request =>
      request.id === requestId
        ? { ...request, status: newStatus as any }
        : request
    ));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Emergency Management</h1>
          <p className="text-gray-600">Handle critical medical emergencies in your hospital</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {filteredRequests.filter(r => r.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, phone, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSeverityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className={request.severity === 'critical' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{request.patientName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.patientPhone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {request.emergencyType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(request.severity)}`} />
                      <span className="capitalize font-medium">{request.severity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(request.requestedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.assignedDoctorName ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{request.assignedDoctorName}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              Emergency Details - {request.patientName}
                            </DialogTitle>
                            <DialogDescription>
                              View detailed information about this emergency request.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Patient Name</label>
                                <p className="text-sm text-gray-600">{request.patientName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <p className="text-sm text-gray-600">{request.patientPhone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Emergency Type</label>
                                <p className="text-sm text-gray-600 capitalize">{request.emergencyType}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Severity</label>
                                <p className="text-sm text-gray-600 capitalize">{request.severity}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium">Symptoms</label>
                                <p className="text-sm text-gray-600">{request.symptoms}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-gray-600">{request.description}</p>
                              </div>
                              {request.patientLocation && (
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">Location</label>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {request.patientLocation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAssignDoctor(request)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Assign Doctor
                        </Button>
                      )}

                      {request.status === 'assigned' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Start Treatment
                        </Button>
                      )}

                      {request.status === 'in_progress' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(request.id, 'completed')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(request.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Doctor Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Doctor to Emergency</DialogTitle>
            <DialogDescription>
              Assign an available doctor from your hospital to handle this emergency case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedRequest.patientName}</h4>
                <p className="text-sm text-gray-600">{selectedRequest.emergencyType} - {selectedRequest.severity} priority</p>
                <p className="text-sm text-gray-600">{selectedRequest.symptoms}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Select Doctor</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {hospitalDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignConfirm} disabled={!selectedDoctor}>
              Assign Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
