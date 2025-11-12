import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User, Mail, Phone, MapPin, Award, Star, Calendar,
  Edit, Save, X, Plus, Trash2, Camera, Globe
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import apiClient from '../../lib/api-client';
import { toast } from 'sonner';

interface TrainerProfileProps {
  onNavigate: (path: string) => void;
}

interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  experience: number;
  rating: number;
  reviews: number;
  specialties: string[];
  qualifications: string[];
  languages: string[];
  pricePerSession: number;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  socialLinks: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  profileImage: string;
}

const mockProfile: TrainerProfile = {
  id: '1',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 9876543210',
  bio: 'Certified yoga instructor with 8+ years of experience specializing in Hatha Yoga, Prenatal Yoga, and Meditation. Passionate about helping people achieve wellness through mindful movement and breathwork.',
  location: 'Mumbai, Maharashtra, India',
  experience: 8,
  rating: 4.9,
  reviews: 156,
  specialties: ['Hatha Yoga', 'Prenatal Yoga', 'Meditation', 'Breathing Techniques'],
  qualifications: ['RYT 500 Certified', 'Prenatal Yoga Specialist', 'Meditation Teacher Certification'],
  languages: ['English', 'Hindi', 'Marathi'],
  pricePerSession: 800,
  availability: {
    monday: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'],
    tuesday: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'],
    wednesday: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'],
    thursday: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'],
    friday: ['06:00 AM', '07:00 AM', '05:00 PM', '06:00 PM'],
    saturday: ['08:00 AM', '09:00 AM', '10:00 AM'],
    sunday: ['08:00 AM', '09:00 AM', '10:00 AM']
  },
  socialLinks: {
    website: 'https://priyayoga.com',
    instagram: '@priya_yoga_mumbai',
    youtube: '@PriyaYogaStudio'
  },
  profileImage: '🧘‍♀️'
};

export const TrainerProfile: React.FC<TrainerProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TrainerProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<TrainerProfile>(mockProfile);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setEditedProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setEditedProfile(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setEditedProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 p-6 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 -z-10"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-600">Manage your trainer profile and availability</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="text-8xl">{profile.profileImage}</div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <h2 className="text-2xl mb-2">{profile.name}</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{profile.rating}</span>
                  <span className="text-slate-600">({profile.reviews} reviews)</span>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{profile.experience} years experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Session (₹)</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.pricePerSession}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, pricePerSession: parseInt(e.target.value) || 0 }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">₹{profile.pricePerSession}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Years of Experience</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.experience}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.experience} years</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-slate-600">{profile.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specialties Tab */}
            <TabsContent value="specialties" className="space-y-4">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Specialties & Qualifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Specialties */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Yoga Specialties</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(isEditing ? editedProfile : profile).specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {specialty}
                          {isEditing && (
                            <button
                              onClick={() => removeSpecialty(index)}
                              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new specialty"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                        />
                        <Button onClick={addSpecialty} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Qualifications & Certifications</label>
                    <div className="space-y-2 mb-3">
                      {(isEditing ? editedProfile : profile).qualifications.map((qualification, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm">{qualification}</span>
                          {isEditing && (
                            <Button
                              onClick={() => removeQualification(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new qualification"
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                        />
                        <Button onClick={addQualification} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Languages Spoken</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(isEditing ? editedProfile : profile).languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {language}
                          {isEditing && (
                            <button
                              onClick={() => removeLanguage(index)}
                              className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new language"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                        />
                        <Button onClick={addLanguage} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-4">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Weekly Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(isEditing ? editedProfile.availability : profile.availability).map(([day, times]) => (
                      <div key={day} className="p-4 border rounded-lg">
                        <h4 className="font-medium capitalize mb-2">{day}</h4>
                        <div className="flex flex-wrap gap-1">
                          {times.map((time, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                        {times.length === 0 && (
                          <p className="text-sm text-slate-500 mt-1">No availability</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Availability editing will be implemented in the schedule management section.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Social Media & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    {isEditing ? (
                      <Input
                        placeholder="https://yourwebsite.com"
                        value={editedProfile.socialLinks.website || ''}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, website: e.target.value }
                        }))}
                      />
                    ) : (
                      <p className="text-sm text-slate-600">
                        {profile.socialLinks.website || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    {isEditing ? (
                      <Input
                        placeholder="@yourhandle"
                        value={editedProfile.socialLinks.instagram || ''}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                        }))}
                      />
                    ) : (
                      <p className="text-sm text-slate-600">
                        {profile.socialLinks.instagram || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube</label>
                    {isEditing ? (
                      <Input
                        placeholder="@YourChannel"
                        value={editedProfile.socialLinks.youtube || ''}
                        onChange={(e) => setEditedProfile(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                        }))}
                      />
                    ) : (
                      <p className="text-sm text-slate-600">
                        {profile.socialLinks.youtube || 'Not provided'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
