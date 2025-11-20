import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  CheckCircle,
  XCircle,
  Building2,
  UserCog,
  Dumbbell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import api from '../../lib/api-client';
import { useAppStore } from '../../lib/app-store';

interface PendingItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  [key: string]: any;
}

export const PendingApprovals = () => {
  const { refreshData } = useAppStore();
  const [pendingDoctors, setPendingDoctors] = useState<PendingItem[]>([]);
  const [pendingHospitals, setPendingHospitals] = useState<PendingItem[]>([]);
  const [pendingTrainers, setPendingTrainers] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Load all pending approvals
  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      setLoading(true);
      const [doctors, hospitals, trainers] = await Promise.all([
        api.admin.getPendingDoctors(),
        api.admin.getPendingHospitals(),
        api.admin.getPendingTrainers(),
      ]);
      setPendingDoctors(doctors || []);
      setPendingHospitals(hospitals || []);
      setPendingTrainers(trainers || []);
      console.log('Loaded pending approvals:', {
        doctors: doctors?.length || 0,
        hospitals: hospitals?.length || 0,
        trainers: trainers?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      await api.admin.approveDoctor(doctorId);
      toast.success('Doctor approved successfully');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to approve doctor:', error);
      toast.error('Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId: string) => {
    try {
      await api.admin.suspendDoctor(doctorId);
      toast.success('Doctor rejected');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to reject doctor:', error);
      toast.error('Failed to reject doctor');
    }
  };

  const handleApproveHospital = async (hospitalId: string) => {
    try {
      await api.admin.approveHospital(hospitalId);
      toast.success('Hospital approved successfully');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to approve hospital:', error);
      toast.error('Failed to approve hospital');
    }
  };

  const handleRejectHospital = async (hospitalId: string) => {
    try {
      await api.admin.rejectHospital(hospitalId);
      toast.success('Hospital rejected');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to reject hospital:', error);
      toast.error('Failed to reject hospital');
    }
  };

  const handleApproveTrainer = async (trainerId: string) => {
    try {
      await api.admin.approveTrainer(trainerId);
      toast.success('Trainer approved successfully');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to approve trainer:', error);
      toast.error('Failed to approve trainer');
    }
  };

  const handleRejectTrainer = async (trainerId: string) => {
    try {
      await api.admin.rejectTrainer(trainerId);
      toast.success('Trainer rejected');
      await loadPendingApprovals();
      if (refreshData) await refreshData();
    } catch (error) {
      console.error('Failed to reject trainer:', error);
      toast.error('Failed to reject trainer');
    }
  };

  const totalPending = pendingDoctors.length + pendingHospitals.length + pendingTrainers.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Pending Approvals</h1>
        <p className="text-gray-600">Review and verify new registrations before they can use our services</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <UserCog className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDoctors.length}</div>
            <p className="text-xs text-gray-600 mt-1">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingHospitals.length}</div>
            <p className="text-xs text-gray-600 mt-1">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trainers</CardTitle>
            <Dumbbell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTrainers.length}</div>
            <p className="text-xs text-gray-600 mt-1">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({totalPending})
          </TabsTrigger>
          <TabsTrigger value="doctors">
            Doctors ({pendingDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="hospitals">
            Hospitals ({pendingHospitals.length})
          </TabsTrigger>
          <TabsTrigger value="trainers">
            Trainers ({pendingTrainers.length})
          </TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Doctors Section */}
          {pendingDoctors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-blue-600" />
                  Pending Doctors ({pendingDoctors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDoctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{doctor.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {doctor.specialization && (
                              <p className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {doctor.specialization}
                              </p>
                            )}
                            {doctor.qualification && (
                              <p className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {doctor.qualification}
                              </p>
                            )}
                            {doctor.email && (
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {doctor.email}
                              </p>
                            )}
                            {doctor.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {doctor.phone}
                              </p>
                            )}
                            {doctor.experience !== undefined && (
                              <p>Experience: {doctor.experience} years</p>
                            )}
                            {doctor.consultationFee !== undefined && (
                              <p>Consultation Fee: ₹{doctor.consultationFee}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveDoctor(doctor.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectDoctor(doctor.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hospitals Section */}
          {pendingHospitals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Pending Hospitals ({pendingHospitals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingHospitals.map((hospital) => (
                    <div key={hospital.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{hospital.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {hospital.city && hospital.state && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {hospital.city}, {hospital.state}
                              </p>
                            )}
                            {hospital.email && (
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {hospital.email}
                              </p>
                            )}
                            {hospital.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {hospital.phone}
                              </p>
                            )}
                            {hospital.registrationNumber && (
                              <p className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Registration: {hospital.registrationNumber}
                              </p>
                            )}
                            {hospital.address && (
                              <p className="text-xs text-gray-500 mt-1">{hospital.address}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveHospital(hospital.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectHospital(hospital.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trainers Section */}
          {pendingTrainers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-green-600" />
                  Pending Trainers ({pendingTrainers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTrainers.map((trainer) => (
                    <div key={trainer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{trainer.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {trainer.trainerType && (
                              <p className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4" />
                                Type: {trainer.trainerType}
                              </p>
                            )}
                            {trainer.location && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {trainer.location}
                              </p>
                            )}
                            {trainer.email && (
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {trainer.email}
                              </p>
                            )}
                            {trainer.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {trainer.phone}
                              </p>
                            )}
                            {trainer.experienceYears !== undefined && (
                              <p>Experience: {trainer.experienceYears} years</p>
                            )}
                            {trainer.pricePerSession !== undefined && (
                              <p>Price per Session: ₹{trainer.pricePerSession}</p>
                            )}
                            {trainer.specialties && trainer.specialties.length > 0 && (
                              <p>Specialties: {trainer.specialties.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveTrainer(trainer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectTrainer(trainer.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {totalPending === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                <p className="text-gray-600">There are no pending approvals at this time.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-4">
          {pendingDoctors.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Pending Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDoctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{doctor.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {doctor.specialization && <p>Specialization: {doctor.specialization}</p>}
                            {doctor.qualification && <p>Qualification: {doctor.qualification}</p>}
                            {doctor.email && <p>Email: {doctor.email}</p>}
                            {doctor.phone && <p>Phone: {doctor.phone}</p>}
                            {doctor.experience !== undefined && <p>Experience: {doctor.experience} years</p>}
                            {doctor.consultationFee !== undefined && <p>Fee: ₹{doctor.consultationFee}</p>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveDoctor(doctor.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectDoctor(doctor.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Doctors</h3>
                <p className="text-gray-600">All doctors have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals" className="space-y-4">
          {pendingHospitals.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Pending Hospitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingHospitals.map((hospital) => (
                    <div key={hospital.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{hospital.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {hospital.city && hospital.state && (
                              <p>Location: {hospital.city}, {hospital.state}</p>
                            )}
                            {hospital.email && <p>Email: {hospital.email}</p>}
                            {hospital.phone && <p>Phone: {hospital.phone}</p>}
                            {hospital.registrationNumber && (
                              <p>Registration: {hospital.registrationNumber}</p>
                            )}
                            {hospital.address && <p className="text-xs text-gray-500">{hospital.address}</p>}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveHospital(hospital.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectHospital(hospital.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Hospitals</h3>
                <p className="text-gray-600">All hospitals have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trainers Tab */}
        <TabsContent value="trainers" className="space-y-4">
          {pendingTrainers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Pending Trainers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTrainers.map((trainer) => (
                    <div key={trainer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{trainer.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {trainer.trainerType && <p>Type: {trainer.trainerType}</p>}
                            {trainer.location && <p>Location: {trainer.location}</p>}
                            {trainer.email && <p>Email: {trainer.email}</p>}
                            {trainer.phone && <p>Phone: {trainer.phone}</p>}
                            {trainer.experienceYears !== undefined && (
                              <p>Experience: {trainer.experienceYears} years</p>
                            )}
                            {trainer.pricePerSession !== undefined && (
                              <p>Price: ₹{trainer.pricePerSession}/session</p>
                            )}
                            {trainer.specialties && trainer.specialties.length > 0 && (
                              <p>Specialties: {trainer.specialties.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-black"
                          onClick={() => handleApproveTrainer(trainer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRejectTrainer(trainer.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Trainers</h3>
                <p className="text-gray-600">All trainers have been reviewed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

