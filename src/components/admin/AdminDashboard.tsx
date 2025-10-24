import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Building2, UserCog, Calendar, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import api from '../../lib/api-client';

export const AdminDashboard = () => {
  const { patients, doctors, hospitals, appointments, approveHospital, rejectHospital, approveDoctor, suspendDoctor } = useAppStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalHospitals: 0,
    pendingApprovals: 0,
    activeAppointments: 0,
    emergencies: 2,
  });

  // Load admin stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await api.admin.getStats();
        setStats({
          totalPatients: statsData.totalPatients || 0,
          totalDoctors: statsData.totalDoctors || 0,
          totalHospitals: statsData.totalHospitals || 0,
          pendingApprovals: statsData.pendingApprovals || 0,
          activeAppointments: statsData.activeAppointments || 0,
          emergencies: 2,
        });
      } catch (error) {
        console.error('Failed to load admin stats:', error);
        // Fallback to local data
        setStats({
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalHospitals: hospitals.length,
          pendingApprovals: hospitals.filter(h => h.status === 'pending').length +
                            doctors.filter(d => d.status === 'pending').length,
          activeAppointments: appointments.filter(a => a.status === 'upcoming').length,
          emergencies: 2,
        });
      }
    };

    loadStats();
  }, [patients, doctors, hospitals, appointments]);

  const pendingHospitals = hospitals.filter(h => h.status === 'pending');
  const pendingDoctors = doctors.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalPatients}</div>
            <p className="text-xs text-gray-600 mt-1">Active users in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Doctors</CardTitle>
            <UserCog className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-600 mt-1">Registered practitioners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Partner Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalHospitals}</div>
            <p className="text-xs text-gray-600 mt-1">Healthcare facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled consultations</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-red-900">Emergency Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-900">{stats.emergencies}</div>
            <p className="text-xs text-red-700 mt-1">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Hospitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Hospital Approvals</span>
              <Badge variant="secondary">{pendingHospitals.length}</Badge>
            </CardTitle>
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
                      <Button size="sm" className="flex-1" onClick={() => approveHospital(hospital.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => rejectHospital(hospital.id)}>
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

        {/* Pending Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Doctor Approvals</span>
              <Badge variant="secondary">{pendingDoctors.length}</Badge>
            </CardTitle>
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
                      <Button size="sm" className="flex-1" onClick={() => approveDoctor(doctor.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => suspendDoctor(doctor.id)}>
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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/patients'}>
              <Users className="h-5 w-5" />
              <span className="text-sm">View All Patients</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/doctors'}>
              <UserCog className="h-5 w-5" />
              <span className="text-sm">Manage Doctors</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/hospitals'}>
              <Building2 className="h-5 w-5" />
              <span className="text-sm">View Hospitals</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/appointments'}>
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Appointments</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
