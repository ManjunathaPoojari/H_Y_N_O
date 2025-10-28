import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Building2, MapPin, Phone, Mail, Users, Stethoscope, Calendar, Star } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';

export const HospitalProfile = () => {
  const { doctors, appointments } = useAppStore();
  const { user } = useAuth();

  // For demo purposes, using hardcoded hospital data
  // In a real app, this would come from the API based on the logged-in hospital user
  const hospitalData = {
    id: 'H001',
    name: 'Apollo Hospital',
    email: 'info@apollohospital.com',
    phone: '+91 9876543210',
    address: '123 Medical Center, New Delhi, India',
    description: 'Apollo Hospital is a leading healthcare provider with state-of-the-art facilities and experienced medical professionals.',
    established: '1995',
    bedCount: 500,
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Emergency Care'],
    facilities: ['ICU', 'Emergency', 'Surgery', 'Lab', 'Pharmacy', 'Radiology', 'Ambulance'],
    rating: 4.5,
    totalReviews: 1250
  };

  // Filter doctors for this hospital
  const hospitalDoctors = doctors.filter(d => d.hospital?.id === 'H001');

  // Get appointments for this hospital
  const hospitalAppointments = appointments.filter(a => a.hospitalId === hospitalData.id);
  const upcomingAppointments = hospitalAppointments.filter(a => a.status === 'upcoming');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Hospital Profile</h1>
        <p className="text-gray-600">Manage your hospital information and view associated doctors</p>
      </div>

      {/* Hospital Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {hospitalData.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{hospitalData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{hospitalData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{hospitalData.address}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Established:</span>
                <span className="text-sm">{hospitalData.established}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bed Count:</span>
                <span className="text-sm">{hospitalData.bedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{hospitalData.rating} ({hospitalData.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{hospitalData.description}</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{hospitalDoctors.length}</p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{hospitalAppointments.length}</p>
                <p className="text-sm text-gray-600">Total Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {hospitalData.specializations.map((spec) => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {hospitalData.facilities.map((facility) => (
              <Badge key={facility} variant="outline">{facility}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Associated Doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Our Doctors ({hospitalDoctors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hospitalDoctors.length > 0 ? (
            <div className="space-y-4">
              {hospitalDoctors.map((doctor) => (
                <div key={doctor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{doctor.name}</h4>
                        <Badge variant={doctor.available ? 'default' : 'secondary'}>
                          {doctor.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                      <p className="text-xs text-gray-500 mb-2">{doctor.qualification}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{doctor.experience} years exp.</span>
                        <span>Rating: {doctor.rating}/5</span>
                        <span>Fee: ₹{doctor.consultationFee}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">View Profile</Button>
                      <Button size="sm" variant="outline">View Schedule</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No doctors associated with this hospital yet.</p>
              <Button className="mt-4">Add Doctor</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
