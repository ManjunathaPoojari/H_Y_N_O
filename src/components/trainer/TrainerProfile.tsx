import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Award, Edit, Mail, MapPin, Phone, Plus, Save, Star, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth-context';
import apiClient from '../../lib/api-client';

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
  availability: Record<string, string[]>;
  socialLinks: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  profileImage?: string;
}

const defaultAvailability: Record<string, string[]> = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export const TrainerProfile: React.FC<TrainerProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<TrainerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const normalizeTrainer = (trainer: any): TrainerProfile => ({
    id: String(trainer.id ?? ''),
    name: trainer.name ?? '',
    email: trainer.email ?? '',
    phone: trainer.phone ?? '',
    bio: trainer.bio ?? '',
    location: trainer.location ?? '',
    experience: trainer.experienceYears ?? trainer.experience ?? 0,
    rating: trainer.rating ?? 0,
    reviews: trainer.reviews ?? 0,
    specialties: Array.isArray(trainer.specialties) ? trainer.specialties : [],
    qualifications: Array.isArray(trainer.qualifications) ? trainer.qualifications : [],
    languages: Array.isArray(trainer.languages) ? trainer.languages : [],
    pricePerSession: Number(trainer.pricePerSession ?? 0),
    availability: trainer.availability && typeof trainer.availability === 'object'
      ? { ...defaultAvailability, ...trainer.availability }
      : { ...defaultAvailability },
    socialLinks: trainer.socialLinks && typeof trainer.socialLinks === 'object'
      ? trainer.socialLinks
      : {},
    profileImage: trainer.profileImage,
  });

  const fetchProfile = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiClient.trainers.getById(user.id);
      const normalized = normalizeTrainer(data);
      setProfile(normalized);
      setEditedProfile(normalized);
    } catch (error: any) {
      console.error('Failed to load trainer profile', error);
      toast.error(error?.message || 'Unable to load trainer profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateEditedProfile = (updater: (prev: TrainerProfile) => TrainerProfile) => {
    setEditedProfile(prev => (prev ? updater(prev) : prev));
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    setIsSaving(true);
    try {
      await apiClient.trainers.update(editedProfile.id, {
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        bio: editedProfile.bio,
        location: editedProfile.location,
        pricePerSession: editedProfile.pricePerSession,
        experienceYears: editedProfile.experience,
        specialties: editedProfile.specialties,
        qualifications: editedProfile.qualifications,
        languages: editedProfile.languages,
        socialLinks: editedProfile.socialLinks,
        availability: editedProfile.availability,
      });
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update trainer profile', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    updateEditedProfile(prev => ({
      ...prev,
      specialties: [...prev.specialties, newSpecialty.trim()],
    }));
    setNewSpecialty('');
  };

  const removeSpecialty = (index: number) => {
    updateEditedProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const addQualification = () => {
    if (!newQualification.trim()) return;
    updateEditedProfile(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, newQualification.trim()],
    }));
    setNewQualification('');
  };

  const removeQualification = (index: number) => {
    updateEditedProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    updateEditedProfile(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage.trim()],
    }));
    setNewLanguage('');
  };

  const removeLanguage = (index: number) => {
    updateEditedProfile(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading your profile...
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <div className="p-6 text-sm text-red-600">
        Trainer profile not found. Please contact support.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Trainer workspace</p>
          <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
          <p className="text-slate-600">Manage your professional details and availability</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-700">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{profile.name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
              <Star className="h-4 w-4 text-amber-500" />
              <span>{profile.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{profile.reviews} reviews</span>
            </div>
            <div className="mt-6 space-y-3 text-left text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{profile.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{profile.location || 'Add location'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-slate-500" />
                <span>{profile.experience} years experience</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Basic information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Full name</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.name}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({ ...prev, name: e.target.value }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({ ...prev, email: e.target.value }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Phone</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.phone}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({ ...prev, phone: e.target.value }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Location</label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.location}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({ ...prev, location: e.target.value }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.location || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">
                        Price per session (₹)
                      </label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.pricePerSession}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({
                              ...prev,
                              pricePerSession: Number(e.target.value) || 0,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">
                          ₹{profile.pricePerSession.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">
                        Years of experience
                      </label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.experience}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({
                              ...prev,
                              experience: Number(e.target.value) || 0,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">{profile.experience} years</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600">Bio</label>
                    {isEditing ? (
                      <Textarea
                        rows={4}
                        value={editedProfile.bio}
                        onChange={(e) =>
                          updateEditedProfile(prev => ({ ...prev, bio: e.target.value }))
                        }
                      />
                    ) : (
                      <p className="text-sm text-slate-600">
                        {profile.bio || 'Tell patients more about your experience and approach.'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specialties">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Specialties & qualifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? editedProfile : profile).specialties.map((specialty, index) => (
                        <Badge key={specialty + index} variant="secondary" className="flex items-center gap-1">
                          {specialty}
                          {isEditing && (
                            <button
                              onClick={() => removeSpecialty(index)}
                              className="rounded-full p-0.5 hover:bg-red-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {(!profile.specialties || profile.specialties.length === 0) && (
                        <span className="text-sm text-slate-500">No specialties listed yet.</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Add new specialty"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSpecialty()}
                        />
                        <Button onClick={addSpecialty} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Qualifications</p>
                    <div className="space-y-2">
                      {(isEditing ? editedProfile : profile).qualifications.map((qualification, index) => (
                        <div
                          key={qualification + index}
                          className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm"
                        >
                          <span>{qualification}</span>
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
                      {(!profile.qualifications || profile.qualifications.length === 0) && (
                        <span className="text-sm text-slate-500">Add your certifications.</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Add new qualification"
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addQualification()}
                        />
                        <Button onClick={addQualification} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? editedProfile : profile).languages.map((language, index) => (
                        <Badge key={language + index} variant="outline" className="flex items-center gap-1">
                          {language}
                          {isEditing && (
                            <button
                              onClick={() => removeLanguage(index)}
                              className="rounded-full p-0.5 hover:bg-red-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                      {(!profile.languages || profile.languages.length === 0) && (
                        <span className="text-sm text-slate-500">Share the languages you speak.</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Add new language"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
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

            <TabsContent value="availability">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Weekly availability</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(isEditing ? editedProfile.availability : profile.availability).map(([day, times]) => (
                    <div key={day} className="rounded-lg border border-slate-200 p-4">
                      <h4 className="text-sm font-semibold capitalize text-slate-700 mb-2">{day}</h4>
                      {times.length ? (
                        <div className="flex flex-wrap gap-2">
                          {times.map((time) => (
                            <Badge key={`${day}-${time}`} variant="secondary" className="text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No availability published</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Social & links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['website', 'instagram', 'youtube'].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-600 capitalize">{key}</label>
                      {isEditing ? (
                        <Input
                          placeholder={`Add your ${key}`}
                          value={editedProfile.socialLinks[key as keyof typeof editedProfile.socialLinks] || ''}
                          onChange={(e) =>
                            updateEditedProfile(prev => ({
                              ...prev,
                              socialLinks: { ...prev.socialLinks, [key]: e.target.value },
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm text-slate-600">
                          {profile.socialLinks[key as keyof typeof profile.socialLinks] || 'Not provided'}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
