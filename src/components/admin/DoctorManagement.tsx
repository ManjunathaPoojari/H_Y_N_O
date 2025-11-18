import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
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
  CheckCircle, XCircle, Eye, Search, UserCog,
  Star, Phone, Mail, Ban, Building, Calendar, Plus
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { Doctor } from '../../types';

export const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: 0,
    consultationFee: 0,
    rating: 0,
    available: true,
    status: 'pending',
  });
  const { doctors, hospitals, trainers, patients, approveDoctor, suspendDoctor, addDoctor } = useAppStore();

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doctor.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: doctors.length,
    approved: doctors.filter(d => d.status === 'approved').length,
    pending: doctors.filter(d => d.status === 'pending').length,
    suspended: doctors.filter(d => d.status === 'suspended').length,
  };

  const handleApprove = (doctorId: string) => {
    approveDoctor(doctorId);
  };

  const handleSuspend = (doctorId: string) => {
    suspendDoctor(doctorId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Doctor Management</h1>
        <p className="text-gray-600">Approve and manage doctor registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Doctors</p>
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



      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newDoctor.name}
                          onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                          placeholder="Enter doctor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newDoctor.email}
                          onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newDoctor.phone}
                          onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={newDoctor.specialization}
                          onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                          placeholder="e.g., Cardiology, Neurology"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input
                          id="qualification"
                          value={newDoctor.qualification}
                          onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})}
                          placeholder="e.g., MBBS, MD"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience (Years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={newDoctor.experience}
                          onChange={(e) => setNewDoctor({...newDoctor, experience: parseInt(e.target.value) || 0})}
                          placeholder="Enter years of experience"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                        <Input
                          id="consultationFee"
                          type="number"
                          value={newDoctor.consultationFee}
                          onChange={(e) => setNewDoctor({...newDoctor, consultationFee: parseInt(e.target.value) || 0})}
                          placeholder="Enter consultation fee"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={newDoctor.rating}
                          onChange={(e) => setNewDoctor({...newDoctor, rating: parseFloat(e.target.value) || 0})}
                          placeholder="Enter rating (0-5)"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        if (newDoctor.name && newDoctor.email && newDoctor.phone && newDoctor.specialization) {
                          const doctorToAdd: Doctor = {
                            id: `D${String(doctors.length + 1).padStart(3, '0')}`,
                            ...newDoctor,
                            createdAt: new Date().toISOString(),
                          } as Doctor;
                          addDoctor(doctorToAdd);
                          setIsAddDialogOpen(false);
                          setNewDoctor({
                            name: '',
                            email: '',
                            phone: '',
                            specialization: '',
                            qualification: '',
                            experience: 0,
                            consultationFee: 0,
                            rating: 0,
                            available: true,
                            status: 'pending',
                          });
                        }
                      }}>
                        Add Doctor
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-gray-400" />
                      <div>
                        <div>{doctor.name}</div>
                        <div className="text-xs text-gray-500">{doctor.qualification}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {doctor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.experience} years</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {doctor.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doctor.status === 'approved' ? 'default' :
                        doctor.status === 'pending' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {doctor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDoctor(doctor)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Doctor Details - {selectedDoctor?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedDoctor && (
                            <div className="space-y-6">
                              {/* Basic Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm text-gray-700">Basic Information</h3>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <UserCog className="h-4 w-4 text-gray-400" />
                                      <span className="font-medium">{selectedDoctor.name}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">{selectedDoctor.qualification}</div>
                                    <div className="text-sm text-gray-600">{selectedDoctor.specialization}</div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm text-gray-700">Professional Details</h3>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      <span>{selectedDoctor.rating} rating</span>
                                    </div>
                                    <div className="text-sm text-gray-600">{selectedDoctor.experience} years experience</div>
                                    <div className="text-sm text-gray-600">₹{selectedDoctor.consultationFee} consultation fee</div>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Information */}
                              <div className="space-y-2">
                                <h3 className="font-semibold text-sm text-gray-700">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{selectedDoctor.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{selectedDoctor.email}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Hospital Affiliation */}
                              {selectedDoctor.hospital && (
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm text-gray-700">Hospital Affiliation</h3>
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{selectedDoctor.hospital.name}</span>
                                  </div>
                                </div>
                              )}

                              {/* Status */}
                              <div className="space-y-2">
                                <h3 className="font-semibold text-sm text-gray-700">Status</h3>
                                <Badge
                                  variant={
                                    selectedDoctor.status === 'approved' ? 'default' :
                                    selectedDoctor.status === 'pending' ? 'secondary' :
                                    'destructive'
                                  }
                                >
                                  {selectedDoctor.status}
                                </Badge>
                              </div>

                              {/* Registration Date */}
                              {selectedDoctor.createdAt && (
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm text-gray-700">Registration Date</h3>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{new Date(selectedDoctor.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {doctor.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(doctor.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleSuspend(doctor.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      {doctor.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleSuspend(doctor.id)}
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No doctors found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
