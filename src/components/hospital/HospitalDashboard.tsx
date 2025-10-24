import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, Users, Calendar, UserPlus, Stethoscope, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';

export const HospitalDashboard = () => {
  const { doctors, appointments, updateAppointment } = useAppStore();
  const hospitalDoctors = doctors.filter(d => d.hospitalId === 'H001');
  const hospitalAppointments = appointments.filter(a => a.hospitalId === 'H001');
  const pendingAppointments = hospitalAppointments.filter(a => a.status === 'pending');

  const stats = {
    totalDoctors: hospitalDoctors.length,
    totalAppointments: hospitalAppointments.length,
    pendingApprovals: pendingAppointments.length,
    todayAppointments: 8,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Apollo Hospital</h1>
        <p className="text-gray-600">Hospital Management Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-600 mt-1">Active practitioners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.todayAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled for today</p>
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
            <Button className="h-auto py-4 flex flex-col gap-2">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm">Add Doctor</span>
            </Button>
            <Button className="h-auto py-4 flex flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Appointments</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Stethoscope className="h-5 w-5" />
              <span className="text-sm">Manage Doctors</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Our Doctors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Our Doctors</CardTitle>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hospitalDoctors.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{doctor.name}</h4>
                      <Badge variant={doctor.available ? 'default' : 'secondary'}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>{doctor.experience} years exp.</span>
                      <span>Rating: {doctor.rating}/5</span>
                      <span>Fee: ₹{doctor.consultationFee}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View Schedule</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Appointment Approvals</CardTitle>
          <Badge variant="secondary">{pendingAppointments.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{appointment.patientName}</h4>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Doctor: {appointment.doctorName}</p>
                      <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
                      <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        updateAppointment(booking.id, { status: 'upcoming' });
                      }}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        updateAppointment(booking.id, { status: 'cancelled' });
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specializations Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cardiology</span>
                <Badge variant="secondary">1 Doctor</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Neurology</span>
                <Badge variant="secondary">1 Doctor</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>General Medicine</span>
                <Badge variant="secondary">3 Doctors</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['ICU', 'Emergency', 'Surgery', 'Lab', 'Pharmacy', 'Radiology'].map((facility) => (
                <Badge key={facility} variant="outline">{facility}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Appointments</span>
                <span>156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Patients</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span>₹2,45,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
