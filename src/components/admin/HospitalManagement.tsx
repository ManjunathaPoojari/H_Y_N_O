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
  CheckCircle, XCircle, Eye, Search, Building2, 
  MapPin, Phone, Mail 
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { Hospital } from '../../types';

export const HospitalManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const { hospitals, approveHospital, rejectHospital } = useAppStore();

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || hospital.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: hospitals.length,
    approved: hospitals.filter(h => h.status === 'approved').length,
    pending: hospitals.filter(h => h.status === 'pending').length,
    rejected: hospitals.filter(h => h.status === 'rejected').length,
  };

  const handleApprove = (hospitalId: string) => {
    approveHospital(hospitalId);
  };

  const handleReject = (hospitalId: string) => {
    rejectHospital(hospitalId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Hospital Management</h1>
        <p className="text-gray-600">Approve and manage hospital registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Hospitals</p>
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
        <Card className="cursor-pointer" onClick={() => setFilter('rejected')}>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1 text-red-600">{stats.rejected}</div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>All Hospitals</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Doctors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.map((hospital) => (
                <TableRow key={hospital.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <div>{hospital.name}</div>
                        <div className="text-xs text-gray-500">{hospital.registrationNumber}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {hospital.city}, {hospital.state}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {hospital.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {hospital.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{hospital.totalDoctors}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        hospital.status === 'approved' ? 'default' :
                        hospital.status === 'pending' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {hospital.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {hospital.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(hospital.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(hospital.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHospitals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hospitals found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
