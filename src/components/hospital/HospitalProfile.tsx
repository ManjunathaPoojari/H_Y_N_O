import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Building2, MapPin, Phone, Mail, Users, Stethoscope, Calendar, Star, AlertCircle, Edit } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { useState, useEffect } from 'react';
import { hospitalAPI, doctorAPI } from '../../lib/api-client';
import { toast } from 'sonner';

export const HospitalProfile = () => {
  const { doctors, appointments, updateDoctor } = useAppStore();
  const { user } = useAuth();

  const [hospitalData, setHospitalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    establishedYear: '',
    bedCount: '',
  });
  const [updating, setUpdating] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [isEditDoctorDialogOpen, setIsEditDoctorDialogOpen] = useState(false);
  const [editDoctorForm, setEditDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    bio: '',
    languages: [] as string[],
  });
  const [updatingDoctor, setUpdatingDoctor] = useState(false);
  const [doctorScheduleModalOpen, setDoctorScheduleModalOpen] = useState(false);
  const [doctorScheduleData, setDoctorScheduleData] = useState<any>(null);
  const [loadingDoctorSchedule, setLoadingDoctorSchedule] = useState(false);

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await hospitalAPI.getById(user.id);
        setHospitalData(data);
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          description: data.description || '',
          establishedYear: data.establishedYear || '',
          bedCount: data.bedCount || '',
        });
        setError(null);
      } catch (err: any) {
        console.error('Error fetching hospital data:', err);
        if (err.message?.includes('404') || err.message?.includes('Not Found') || err.message?.includes('500')) {
          setError('No profile found. Please complete your hospital information.');
        } else {
          setError('Failed to load hospital profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [user?.id]);

  const handleEditProfile = async () => {
    if (!user?.id) return;

    try {
      setUpdating(true);

      // Only send fields that have values (make fields optional for editing)
      const updateData: any = {};

      if (editForm.name.trim()) updateData.name = editForm.name.trim();
      if (editForm.email.trim()) updateData.email = editForm.email.trim();
      if (editForm.phone.trim()) updateData.phone = editForm.phone.trim();
      if (editForm.address.trim()) updateData.address = editForm.address.trim();
      if (editForm.description.trim()) updateData.description = editForm.description.trim();
      if (editForm.establishedYear) updateData.establishedYear = parseInt(editForm.establishedYear);
      if (editForm.bedCount) updateData.bedCount = parseInt(editForm.bedCount);

      // If no fields to update, just close the dialog
      if (Object.keys(updateData).length === 0) {
        setIsEditDialogOpen(false);
        toast.success('No changes made.');
        return;
      }

      const updatedData = await hospitalAPI.update(user.id, updateData);

      setHospitalData(updatedData);
      setIsEditDialogOpen(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDoctorProfile = (doctor: any) => {
    setSelectedDoctor(doctor);
    setDoctorModalOpen(true);
  };

  const handleEditDoctorProfile = (doctor: any) => {
    setSelectedDoctor(doctor);
    setEditDoctorForm({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      bio: doctor.bio || '',
      languages: doctor.languages || [],
    });
    setDoctorModalOpen(false);
    setIsEditDoctorDialogOpen(true);
  };

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor?.id) return;

    try {
      setUpdatingDoctor(true);
      const updatedDoctor = await doctorAPI.update(selectedDoctor.id, {
        name: editDoctorForm.name,
        email: editDoctorForm.email,
        phone: editDoctorForm.phone,
        specialization: editDoctorForm.specialization,
        qualification: editDoctorForm.qualification,
        experience: parseInt(editDoctorForm.experience) || 0,
        consultationFee: parseInt(editDoctorForm.consultationFee) || 0,
        bio: editDoctorForm.bio,
        languages: editDoctorForm.languages,
      });

      // Update the doctor in the store
      updateDoctor(selectedDoctor.id, updatedDoctor);

      setIsEditDoctorDialogOpen(false);
      setDoctorModalOpen(false);
      toast.success('Doctor profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating doctor profile:', err);
      toast.error('Failed to update doctor profile. Please try again.');
    } finally {
      setUpdatingDoctor(false);
    }
  };

  const handleViewDoctorSchedule = async (doctor: any) => {
    setSelectedDoctor(doctor);
    setLoadingDoctorSchedule(true);
    setDoctorScheduleModalOpen(true);

    try {
      const scheduleData = await doctorAPI.getSchedule(doctor.id);
      setDoctorScheduleData(scheduleData);
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      toast.error('Failed to load doctor schedule');
      setDoctorScheduleData(null);
    } finally {
      setLoadingDoctorSchedule(false);
    }
  };

  // Filter doctors for this hospital
  const hospitalDoctors = doctors.filter(d => (d.hospitalId === user?.id || d.hospital?.id === user?.id) && (d.status === 'approved' || d.status === 'pending'));

  // Get appointments for this hospital
  const hospitalAppointments = appointments.filter(a => a.hospitalId === user?.id);
  const upcomingAppointments = hospitalAppointments.filter(a => a.status === 'booked');

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Hospital Profile</h1>
          <p className="text-gray-600">Loading your hospital information...</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Hospital Profile</h1>
          <p className="text-gray-600">Manage your hospital information and view associated doctors</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center text-center">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button>Contact Administrator</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hospitalData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Hospital Profile</h1>
          <p className="text-gray-600">Manage your hospital information and view associated doctors</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center text-center">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Data</h3>
                <p className="text-gray-600 mb-4">No profile found. Please complete your hospital information.</p>
                <Button>Contact Administrator</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <span className="text-sm">{hospitalData.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{hospitalData.address || 'Not provided'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Established:</span>
                <span className="text-sm">{hospitalData.establishedYear || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bed Count:</span>
                <span className="text-sm">{hospitalData.bedCount || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{hospitalData.rating || 0}/5</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{hospitalData.description || 'No description available.'}</p>
          </div>
          <div className="flex justify-end">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Hospital Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Hospital Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter hospital name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        value={editForm.establishedYear}
                        onChange={(e) => setEditForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                        placeholder="e.g., 1990"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedCount">Bed Count</Label>
                      <Input
                        id="bedCount"
                        type="number"
                        value={editForm.bedCount}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bedCount: e.target.value }))}
                        placeholder="Enter bed count"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter hospital description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditProfile} disabled={updating}>
                    {updating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

      {/* Facilities */}
      {hospitalData.facilities && hospitalData.facilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hospitalData.facilities.map((facility: string, index: number) => (
                <Badge key={index} variant="secondary">{facility}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                      <Button size="sm" variant="outline" onClick={() => handleViewDoctorProfile(doctor)}>View Profile</Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDoctorSchedule(doctor)}>View Schedule</Button>
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

      {/* Doctor Profile Modal */}
      <Dialog open={doctorModalOpen} onOpenChange={setDoctorModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Profile</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                  <p className="text-gray-600">{selectedDoctor.specialization}</p>
                  <Badge variant={selectedDoctor.available ? 'default' : 'secondary'}>
                    {selectedDoctor.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Qualification</Label>
                  <p className="text-sm text-gray-600">{selectedDoctor.qualification}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience</Label>
                  <p className="text-sm text-gray-600">{selectedDoctor.experience} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedDoctor.rating}/5</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Consultation Fee</Label>
                  <p className="text-sm text-gray-600">₹{selectedDoctor.consultationFee}</p>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div>
                  <Label className="text-sm font-medium">Bio</Label>
                  <p className="text-sm text-gray-600">{selectedDoctor.bio}</p>
                </div>
              )}

              {selectedDoctor.languages && selectedDoctor.languages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDoctor.languages.map((lang: string, index: number) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleEditDoctorProfile(selectedDoctor)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => setDoctorModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Profile Modal */}
      <Dialog open={isEditDoctorDialogOpen} onOpenChange={setIsEditDoctorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Name</Label>
                <Input
                  id="doctor-name"
                  value={editDoctorForm.name}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter doctor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-email">Email</Label>
                <Input
                  id="doctor-email"
                  type="email"
                  value={editDoctorForm.email}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-phone">Phone</Label>
                <Input
                  id="doctor-phone"
                  value={editDoctorForm.phone}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-specialization">Specialization</Label>
                <Input
                  id="doctor-specialization"
                  value={editDoctorForm.specialization}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Enter specialization"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-qualification">Qualification</Label>
                <Input
                  id="doctor-qualification"
                  value={editDoctorForm.qualification}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, qualification: e.target.value }))}
                  placeholder="Enter qualification"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-experience">Experience (years)</Label>
                <Input
                  id="doctor-experience"
                  type="number"
                  value={editDoctorForm.experience}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Enter experience"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-fee">Consultation Fee</Label>
                <Input
                  id="doctor-fee"
                  type="number"
                  value={editDoctorForm.consultationFee}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, consultationFee: e.target.value }))}
                  placeholder="Enter fee"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-languages">Languages (comma-separated)</Label>
                <Input
                  id="doctor-languages"
                  value={editDoctorForm.languages.join(', ')}
                  onChange={(e) => setEditDoctorForm(prev => ({ ...prev, languages: e.target.value.split(',').map(l => l.trim()) }))}
                  placeholder="Enter languages"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-bio">Bio</Label>
              <Textarea
                id="doctor-bio"
                value={editDoctorForm.bio}
                onChange={(e) => setEditDoctorForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter bio"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDoctorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDoctor} disabled={updatingDoctor}>
              {updatingDoctor ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Schedule Modal */}
      <Dialog open={doctorScheduleModalOpen} onOpenChange={setDoctorScheduleModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Doctor Schedule - {selectedDoctor?.name}</DialogTitle>
          </DialogHeader>
          {loadingDoctorSchedule ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading schedule...</span>
            </div>
          ) : doctorScheduleData ? (
            <div className="space-y-4">
              {Array.isArray(doctorScheduleData) && doctorScheduleData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctorScheduleData.map((slot: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{slot.day || slot.date}</span>
                            <Badge variant={slot.available ? 'default' : 'secondary'}>
                              {slot.available ? 'Available' : 'Booked'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Time: {slot.startTime} - {slot.endTime}</p>
                            {slot.location && <p>Location: {slot.location}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No schedule data available.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500">Failed to load doctor schedule.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDoctorScheduleModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
