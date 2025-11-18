import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
  DialogTrigger
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  CheckCircle, XCircle, Eye, Search, UserCog, Users, Building2, Dumbbell,
  Star, Phone, Mail, Ban, Calendar, Plus, Edit, Trash2, RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { Patient, Doctor, Hospital, Trainer } from '../../types';
import { toast } from 'sonner';
import { USE_BACKEND } from '../../lib/config';

export const AdminUserManagement = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');

  // Loading states
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState<any>({});
  const [addForm, setAddForm] = useState<any>({});

  const {
    patients, doctors, hospitals, trainers,
    addPatient, updatePatient, deletePatient,
    addDoctor, updateDoctor, deleteDoctor,
    addHospital, updateHospital, deleteHospital,
    addTrainer, updateTrainer, deleteTrainer,
    approveDoctor, suspendDoctor,
    approveHospital, rejectHospital,
    approveTrainer, suspendTrainer
  } = useAppStore();

  // Stats calculation
  const getStats = (users: any[], type: string) => {
    const userArray = Array.isArray(users) ? users : [];
    return {
      total: userArray.length,
      approved: userArray.filter(u => u.status === 'approved').length,
      pending: userArray.filter(u => u.status === 'pending').length,
      suspended: userArray.filter(u => u.status === 'suspended').length,
    };
  };

  const patientStats = getStats(patients, 'patients');
  const doctorStats = getStats(doctors, 'doctors');
  const hospitalStats = getStats(hospitals, 'hospitals');
  const trainerStats = getStats(trainers, 'trainers');

  // Filtered data
  const getFilteredUsers = (users: any[]) => {
    const userArray = Array.isArray(users) ? users : [];
    return userArray.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || user.status === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredPatients = getFilteredUsers(patients);
  const filteredDoctors = getFilteredUsers(doctors);
  const filteredHospitals = getFilteredUsers(hospitals);
  const filteredTrainers = getFilteredUsers(trainers);

  // Handle actions
  const handleApprove = (userId: string, type: string) => {
    if (type === 'doctor') approveDoctor(userId);
    else if (type === 'hospital') approveHospital(userId);
    else if (type === 'trainer') approveTrainer(userId);
    toast.success(`${type} approved successfully`);
  };

  const handleSuspend = (userId: string, type: string) => {
    if (type === 'doctor') suspendDoctor(userId);
    else if (type === 'hospital') rejectHospital(userId); // Use rejectHospital for hospitals
    else if (type === 'trainer') suspendTrainer(userId);
    toast.success(`${type} suspended successfully`);
  };

  const handleDeleteUser = async (userId: string, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'patient') await deletePatient(userId);
        else if (type === 'doctor') await deleteDoctor(userId);
        else if (type === 'hospital') await deleteHospital(userId);
        else if (type === 'trainer') await deleteTrainer(userId);
        toast.success(`${type} deleted successfully`);
      } catch (error) {
        toast.error(`Failed to delete ${type}`);
      }
    }
  };

  const handleEditUser = (user: any, type: string) => {
    setEditForm({ ...user, type });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const { type, ...userData } = editForm;
      if (type === 'patient') await updatePatient(userData.id, userData);
      else if (type === 'doctor') await updateDoctor(userData.id, userData);
      else if (type === 'hospital') await updateHospital(userData.id, userData);
      else if (type === 'trainer') await updateTrainer(userData.id, userData);
      setIsEditDialogOpen(false);
      toast.success(`${type} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${editForm.type}`);
    }
  };

  const handleAddUser = async () => {
    try {
      const { type, ...userData } = addForm;
      if (type === 'patient') await addPatient(userData);
      else if (type === 'doctor') await addDoctor(userData);
      else if (type === 'hospital') await addHospital(userData);
      else if (type === 'trainer') await addTrainer(userData);
      setIsAddDialogOpen(false);
      setAddForm({});
      toast.success(`${type} added successfully`);
    } catch (error) {
      toast.error(`Failed to add ${addForm.type}`);
    }
  };

  const renderStats = (stats: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="cursor-pointer" onClick={() => setFilter('all')}>
        <CardContent className="pt-6">
          <div className="text-2xl mb-1">{stats.total}</div>
          <p className="text-sm text-gray-600">Total</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer" onClick={() => setFilter('approved')}>
        <CardContent className="pt-6">
          <div className="text-2xl mb-1 text-green-600">{stats.approved}</div>
          <p className="text-sm text-gray-600">Approved</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer" onClick={() => setFilter('pending')}>
        <CardContent className="pt-6">
          <div className="text-2xl mb-1 text-orange-600">{stats.pending}</div>
          <p className="text-sm text-gray-600">Pending</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer" onClick={() => setFilter('suspended')}>
        <CardContent className="pt-6">
          <div className="text-2xl mb-1 text-red-600">{stats.suspended}</div>
          <p className="text-sm text-gray-600">Suspended</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderTable = (users: any[], type: string, icon: any) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <div>{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{user.phone}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {type === 'doctor' && (
                  <>
                    <div>{user.specialization}</div>
                    <div className="text-xs text-gray-500">{user.experience} years</div>
                  </>
                )}
                {type === 'hospital' && (
                  <>
                    <div>{user.city}, {user.state}</div>
                    <div className="text-xs text-gray-500">{user.totalDoctors} doctors</div>
                  </>
                )}
                {type === 'trainer' && (
                  <>
                    <div>{user.trainerType}</div>
                    <div className="text-xs text-gray-500">{user.experienceYears} years</div>
                  </>
                )}
                {type === 'patient' && (
                  <>
                    <div>{user.age} years old</div>
                    <div className="text-xs text-gray-500">{user.gender}</div>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  user.status === 'approved' ? 'default' :
                  user.status === 'pending' ? 'secondary' :
                  'destructive'
                }
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setIsViewDialogOpen(true); }}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditUser(user, type)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteUser(user.id, type)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
                {user.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleApprove(user.id, type)}>
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleSuspend(user.id, type)}>
                      <Ban className="h-3 w-3" />
                    </Button>
                  </>
                )}
                {user.status === 'approved' && (
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleSuspend(user.id, type)}>
                    <Ban className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users in the system</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
        </TabsList>

        {/* Search and Filter */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => { setAddForm({ type: activeTab.slice(0, -1) }); setIsAddDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab.slice(0, -1)}
              </Button>
              {(['all', 'approved', 'pending', 'suspended'] as const).map(status => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <TabsContent value="patients">
          {renderStats(patientStats)}
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(filteredPatients, 'patient', <Users className="h-4 w-4 text-blue-600" />)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          {renderStats(doctorStats)}
          <Card>
            <CardHeader>
              <CardTitle>Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(filteredDoctors, 'doctor', <UserCog className="h-4 w-4 text-green-600" />)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitals">
          {renderStats(hospitalStats)}
          <Card>
            <CardHeader>
              <CardTitle>Hospitals</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(filteredHospitals, 'hospital', <Building2 className="h-4 w-4 text-purple-600" />)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers">
          {renderStats(trainerStats)}
          <Card>
            <CardHeader>
              <CardTitle>Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTable(filteredTrainers, 'trainer', <Dumbbell className="h-4 w-4 text-orange-600" />)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="user-details-description">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <p id="user-details-description" className="sr-only">View detailed information about the selected user</p>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedUser.status === 'approved' ? 'default' : selectedUser.status === 'pending' ? 'secondary' : 'destructive'}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              {/* Type-specific Information */}
              {activeTab === 'patients' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age</Label>
                      <p className="text-sm">{selectedUser.age}</p>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <p className="text-sm">{selectedUser.gender}</p>
                    </div>
                    <div>
                      <Label>Blood Group</Label>
                      <p className="text-sm">{selectedUser.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <p className="text-sm">{selectedUser.dateOfBirth || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <p className="text-sm">{selectedUser.address || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Emergency Contact</Label>
                      <p className="text-sm">{selectedUser.emergencyContact || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Allergies</Label>
                      <p className="text-sm">{selectedUser.allergies?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Medical History</Label>
                      <p className="text-sm">{selectedUser.medicalHistory?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Current Medications</Label>
                      <p className="text-sm">{selectedUser.currentMedications?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Notes</Label>
                      <p className="text-sm">{selectedUser.notes || 'No notes'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'doctors' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Doctor Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Specialization</Label>
                      <p className="text-sm">{selectedUser.specialization}</p>
                    </div>
                    <div>
                      <Label>Qualification</Label>
                      <p className="text-sm">{selectedUser.qualification}</p>
                    </div>
                    <div>
                      <Label>Experience (years)</Label>
                      <p className="text-sm">{selectedUser.experience}</p>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <p className="text-sm">{selectedUser.rating}/5</p>
                    </div>
                    <div>
                      <Label>Available</Label>
                      <p className="text-sm">{selectedUser.available ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label>Consultation Fee</Label>
                      <p className="text-sm">₹{selectedUser.consultationFee}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Hospital</Label>
                      <p className="text-sm">{selectedUser.hospital?.name || 'Not assigned'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Avatar URL</Label>
                      <p className="text-sm">{selectedUser.avatarUrl || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hospitals' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hospital Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <p className="text-sm">{selectedUser.address}</p>
                    </div>
                    <div>
                      <Label>City</Label>
                      <p className="text-sm">{selectedUser.city}</p>
                    </div>
                    <div>
                      <Label>State</Label>
                      <p className="text-sm">{selectedUser.state}</p>
                    </div>
                    <div>
                      <Label>Total Doctors</Label>
                      <p className="text-sm">{selectedUser.totalDoctors}</p>
                    </div>
                    <div>
                      <Label>Registration Number</Label>
                      <p className="text-sm">{selectedUser.registrationNumber}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Facilities</Label>
                      <p className="text-sm">{selectedUser.facilities?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'trainers' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trainer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Trainer Type</Label>
                      <p className="text-sm">{selectedUser.trainerType}</p>
                    </div>
                    <div>
                      <Label>Experience (years)</Label>
                      <p className="text-sm">{selectedUser.experienceYears}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p className="text-sm">{selectedUser.location}</p>
                    </div>
                    <div>
                      <Label>Price per Session</Label>
                      <p className="text-sm">₹{selectedUser.pricePerSession}</p>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <p className="text-sm">{selectedUser.rating}/5</p>
                    </div>
                    <div>
                      <Label>Reviews</Label>
                      <p className="text-sm">{selectedUser.reviews}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Bio</Label>
                      <p className="text-sm">{selectedUser.bio || 'No bio'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Specialties</Label>
                      <p className="text-sm">{selectedUser.specialties?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Qualifications</Label>
                      <p className="text-sm">{selectedUser.qualifications?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Languages</Label>
                      <p className="text-sm">{selectedUser.languages?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Modes</Label>
                      <p className="text-sm">{selectedUser.modes?.join(', ') || 'None'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Profile Image</Label>
                      <p className="text-sm">{selectedUser.profileImage || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit {editForm.type}</DialogTitle>
            <p id="edit-user-description" className="sr-only">Edit the details of the selected user</p>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editForm.status || ''} onValueChange={(value: string) => setEditForm({...editForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Type-specific Edit Fields */}
            {editForm.type === 'patient' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Age</Label>
                    <Input type="number" value={editForm.age || ''} onChange={(e) => setEditForm({...editForm, age: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={editForm.gender || ''} onValueChange={(value: string) => setEditForm({...editForm, gender: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Input value={editForm.bloodGroup || ''} onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})} />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input type="date" value={editForm.dateOfBirth || ''} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Textarea value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Emergency Contact</Label>
                    <Input value={editForm.emergencyContact || ''} onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Allergies (comma-separated)</Label>
                    <Input value={editForm.allergies?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, allergies: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Medical History (comma-separated)</Label>
                    <Input value={editForm.medicalHistory?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, medicalHistory: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Current Medications (comma-separated)</Label>
                    <Input value={editForm.currentMedications?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, currentMedications: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <Textarea value={editForm.notes || ''} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {editForm.type === 'doctor' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Doctor Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Specialization</Label>
                    <Input value={editForm.specialization || ''} onChange={(e) => setEditForm({...editForm, specialization: e.target.value})} />
                  </div>
                  <div>
                    <Label>Qualification</Label>
                    <Input value={editForm.qualification || ''} onChange={(e) => setEditForm({...editForm, qualification: e.target.value})} />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input type="number" value={editForm.experience || ''} onChange={(e) => setEditForm({...editForm, experience: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={editForm.rating || ''} onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Available</Label>
                    <Select value={editForm.available ? 'true' : 'false'} onValueChange={(value: string) => setEditForm({...editForm, available: value === 'true'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Consultation Fee</Label>
                    <Input type="number" value={editForm.consultationFee || ''} onChange={(e) => setEditForm({...editForm, consultationFee: parseInt(e.target.value)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Hospital ID</Label>
                    <Input value={editForm.hospitalId || ''} onChange={(e) => setEditForm({...editForm, hospitalId: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Avatar URL</Label>
                    <Input value={editForm.avatarUrl || ''} onChange={(e) => setEditForm({...editForm, avatarUrl: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {editForm.type === 'hospital' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hospital Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Textarea value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={editForm.city || ''} onChange={(e) => setEditForm({...editForm, city: e.target.value})} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={editForm.state || ''} onChange={(e) => setEditForm({...editForm, state: e.target.value})} />
                  </div>
                  <div>
                    <Label>Total Doctors</Label>
                    <Input type="number" value={editForm.totalDoctors || ''} onChange={(e) => setEditForm({...editForm, totalDoctors: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input value={editForm.registrationNumber || ''} onChange={(e) => setEditForm({...editForm, registrationNumber: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Facilities (comma-separated)</Label>
                    <Input value={editForm.facilities?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, facilities: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                </div>
              </div>
            )}

            {editForm.type === 'trainer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trainer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Trainer Type</Label>
                    <Input value={editForm.trainerType || ''} onChange={(e) => setEditForm({...editForm, trainerType: e.target.value})} />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input type="number" value={editForm.experienceYears || ''} onChange={(e) => setEditForm({...editForm, experienceYears: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={editForm.location || ''} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                  </div>
                  <div>
                    <Label>Price per Session</Label>
                    <Input type="number" value={editForm.pricePerSession || ''} onChange={(e) => setEditForm({...editForm, pricePerSession: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={editForm.rating || ''} onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Reviews</Label>
                    <Input type="number" value={editForm.reviews || ''} onChange={(e) => setEditForm({...editForm, reviews: parseInt(e.target.value)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Textarea value={editForm.bio || ''} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Specialties (comma-separated)</Label>
                    <Input value={editForm.specialties?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Qualifications (comma-separated)</Label>
                    <Input value={editForm.qualifications?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, qualifications: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Languages (comma-separated)</Label>
                    <Input value={editForm.languages?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, languages: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Modes (comma-separated)</Label>
                    <Input value={editForm.modes?.join(', ') || ''} onChange={(e) => setEditForm({...editForm, modes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Profile Image URL</Label>
                    <Input value={editForm.profileImage || ''} onChange={(e) => setEditForm({...editForm, profileImage: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="add-user-description">
          <DialogHeader>
            <DialogTitle>Add New {addForm.type}</DialogTitle>
            <p id="add-user-description" className="sr-only">Add a new user to the system</p>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={addForm.name || ''} onChange={(e) => setAddForm({...addForm, name: e.target.value})} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={addForm.email || ''} onChange={(e) => setAddForm({...addForm, email: e.target.value})} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={addForm.phone || ''} onChange={(e) => setAddForm({...addForm, phone: e.target.value})} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={addForm.password || ''} onChange={(e) => setAddForm({...addForm, password: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Type-specific Add Fields */}
            {addForm.type === 'patient' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Patient Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Age</Label>
                    <Input type="number" value={addForm.age || ''} onChange={(e) => setAddForm({...addForm, age: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={addForm.gender || ''} onValueChange={(value: string) => setAddForm({...addForm, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Input value={addForm.bloodGroup || ''} onChange={(e) => setAddForm({...addForm, bloodGroup: e.target.value})} />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input type="date" value={addForm.dateOfBirth || ''} onChange={(e) => setAddForm({...addForm, dateOfBirth: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Textarea value={addForm.address || ''} onChange={(e) => setAddForm({...addForm, address: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Emergency Contact</Label>
                    <Input value={addForm.emergencyContact || ''} onChange={(e) => setAddForm({...addForm, emergencyContact: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Allergies (comma-separated)</Label>
                    <Input value={addForm.allergies?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, allergies: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Medical History (comma-separated)</Label>
                    <Input value={addForm.medicalHistory?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, medicalHistory: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Current Medications (comma-separated)</Label>
                    <Input value={addForm.currentMedications?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, currentMedications: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <Textarea value={addForm.notes || ''} onChange={(e) => setAddForm({...addForm, notes: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {addForm.type === 'doctor' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Doctor Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Specialization</Label>
                    <Input value={addForm.specialization || ''} onChange={(e) => setAddForm({...addForm, specialization: e.target.value})} />
                  </div>
                  <div>
                    <Label>Qualification</Label>
                    <Input value={addForm.qualification || ''} onChange={(e) => setAddForm({...addForm, qualification: e.target.value})} />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input type="number" value={addForm.experience || ''} onChange={(e) => setAddForm({...addForm, experience: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={addForm.rating || ''} onChange={(e) => setAddForm({...addForm, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Available</Label>
                    <Select value={addForm.available ? 'true' : 'false'} onValueChange={(value: string) => setAddForm({...addForm, available: value === 'true'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Consultation Fee</Label>
                    <Input type="number" value={addForm.consultationFee || ''} onChange={(e) => setAddForm({...addForm, consultationFee: parseInt(e.target.value)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Hospital ID</Label>
                    <Input value={addForm.hospitalId || ''} onChange={(e) => setAddForm({...addForm, hospitalId: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Avatar URL</Label>
                    <Input value={addForm.avatarUrl || ''} onChange={(e) => setAddForm({...addForm, avatarUrl: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {addForm.type === 'hospital' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hospital Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Textarea value={addForm.address || ''} onChange={(e) => setAddForm({...addForm, address: e.target.value})} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={addForm.city || ''} onChange={(e) => setAddForm({...addForm, city: e.target.value})} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={addForm.state || ''} onChange={(e) => setAddForm({...addForm, state: e.target.value})} />
                  </div>
                  <div>
                    <Label>Total Doctors</Label>
                    <Input type="number" value={addForm.totalDoctors || ''} onChange={(e) => setAddForm({...addForm, totalDoctors: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input value={addForm.registrationNumber || ''} onChange={(e) => setAddForm({...addForm, registrationNumber: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Facilities (comma-separated)</Label>
                    <Input value={addForm.facilities?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, facilities: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                </div>
              </div>
            )}

            {addForm.type === 'trainer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trainer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Trainer Type</Label>
                    <Input value={addForm.trainerType || ''} onChange={(e) => setAddForm({...addForm, trainerType: e.target.value})} />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input type="number" value={addForm.experienceYears || ''} onChange={(e) => setAddForm({...addForm, experienceYears: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={addForm.location || ''} onChange={(e) => setAddForm({...addForm, location: e.target.value})} />
                  </div>
                  <div>
                    <Label>Price per Session</Label>
                    <Input type="number" value={addForm.pricePerSession || ''} onChange={(e) => setAddForm({...addForm, pricePerSession: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={addForm.rating || ''} onChange={(e) => setAddForm({...addForm, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Reviews</Label>
                    <Input type="number" value={addForm.reviews || ''} onChange={(e) => setAddForm({...addForm, reviews: parseInt(e.target.value)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Textarea value={addForm.bio || ''} onChange={(e) => setAddForm({...addForm, bio: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Specialties (comma-separated)</Label>
                    <Input value={addForm.specialties?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Qualifications (comma-separated)</Label>
                    <Input value={addForm.qualifications?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, qualifications: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Languages (comma-separated)</Label>
                    <Input value={addForm.languages?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, languages: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Modes (comma-separated)</Label>
                    <Input value={addForm.modes?.join(', ') || ''} onChange={(e) => setAddForm({...addForm, modes: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Profile Image URL</Label>
                    <Input value={addForm.profileImage || ''} onChange={(e) => setAddForm({...addForm, profileImage: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
