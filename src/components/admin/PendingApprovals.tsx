import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle, XCircle, Building2, UserCog, Dumbbell } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';

export const PendingApprovals = () => {
  const {
    hospitals,
    doctors,
    trainers,
    approveHospital,
    rejectHospital,
    approveDoctor,
    suspendDoctor,
    approveTrainer,
    rejectTrainer
  } = useAppStore();

  const pendingHospitals = hospitals.filter(h => h.status === 'pending');
  const pendingDoctors = doctors.filter(d => d.status === 'pending');
  const pendingTrainers = trainers.filter(t => t.status === 'pending');

  const handleApproveHospital = (id: string) => {
    approveHospital(id);
  };

  const handleRejectHospital = (id: string) => {
    rejectHospital(id);
  };

  const handleApproveDoctor = (id: string) => {
    approveDoctor(id);
  };

  const handleRejectDoctor = (id: string) => {
    suspendDoctor(id);
  };

  const handleApproveTrainer = (id: string) => {
    approveTrainer(id);
  };

  const handleRejectTrainer = (id: string) => {
    rejectTrainer(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Pending Approvals</h1>
        <p className="text-gray-600">Review and approve pending registrations</p>
      </div>

      <Tabs defaultValue="hospitals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hospitals" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hospitals ({pendingHospitals.length})
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Doctors ({pendingDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="trainers" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Trainers ({pendingTrainers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Hospital Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingHospitals.length > 0 ? (
                  pendingHospitals.map((hospital) => (
                    <div key={hospital.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1">{hospital.name}</h4>
                          <p className="text-sm text-gray-600">{hospital.city}, {hospital.state}</p>
                          <p className="text-xs text-gray-500 mt-1">Reg: {hospital.registrationNumber}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1" onClick={() => handleApproveHospital(hospital.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejectHospital(hospital.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending hospital approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Doctor Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDoctors.length > 0 ? (
                  pendingDoctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1" onClick={() => handleApproveDoctor(doctor.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejectDoctor(doctor.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending doctor approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Trainer Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTrainers.length > 0 ? (
                  pendingTrainers.map((trainer) => (
                    <div key={trainer.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1">{trainer.name}</h4>
                          <p className="text-sm text-gray-600">{trainer.trainerType}</p>
                          <p className="text-xs text-gray-500 mt-1">{trainer.location}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1" onClick={() => handleApproveTrainer(trainer.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRejectTrainer(trainer.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending trainer approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
