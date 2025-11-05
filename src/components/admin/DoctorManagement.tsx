import { useState } from 'react';
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
  DialogTrigger
} from '../ui/dialog';
import {
  CheckCircle, XCircle, Eye, Search, UserCog,
  Star, Phone, Mail, Ban, Building, Calendar
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';

export const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const { doctors, approveDoctor, suspendDoctor } = useAppStore();

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

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>All Doctors</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
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
