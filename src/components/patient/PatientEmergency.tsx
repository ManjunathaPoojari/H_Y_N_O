import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  User,
  Heart,
  Ambulance,
  Stethoscope,
  Thermometer,
  Activity,
  PhoneCall,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';

interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientLocation: string;
  emergencyType: 'cardiac' | 'accident' | 'respiratory' | 'neurological' | 'infection' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  symptoms: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedAt: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedAt?: string;
  priority: number;
}

export const PatientEmergency = () => {
  const { user } = useAuth();
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');

  // Emergency form state
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode this to get address
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentLocation('Location unavailable');
        }
      );
    }
  }, []);

  const emergencyTypes = [
    { value: 'cardiac', label: 'Cardiac Emergency', icon: Heart, color: 'text-red-500' },
    { value: 'accident', label: 'Accident/Trauma', icon: Ambulance, color: 'text-orange-500' },
    { value: 'respiratory', label: 'Respiratory Issues', icon: Activity, color: 'text-blue-500' },
    { value: 'neurological', label: 'Neurological', icon: Activity, color: 'text-purple-500' },
    { value: 'infection', label: 'Infection/Fever', icon: Thermometer, color: 'text-yellow-500' },
    { value: 'other', label: 'Other Emergency', icon: AlertTriangle, color: 'text-gray-500' }
  ];

  const severityLevels = [
    { value: 'critical', label: 'Critical - Life threatening', color: 'bg-red-500' },
    { value: 'high', label: 'High - Urgent medical attention needed', color: 'bg-orange-500' },
    { value: 'medium', label: 'Medium - Medical attention needed soon', color: 'bg-yellow-500' },
    { value: 'low', label: 'Low - Non-urgent medical concern', color: 'bg-green-500' }
  ];

  const getSeverityColor = (severity: string) => {
    const level = severityLevels.find(l => l.value === severity);
    return level ? level.color : 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEmergencySubmit = async () => {
    if (!emergencyType || !severity || !symptoms.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      const newEmergency: EmergencyRequest = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        patientPhone: user?.phone || '',
        patientLocation: currentLocation,
        emergencyType: emergencyType as any,
        severity: severity as any,
        symptoms,
        description,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        priority: severity === 'critical' ? 5 : severity === 'high' ? 4 : severity === 'medium' ? 3 : 2
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setEmergencyRequests(prev => [newEmergency, ...prev]);

      // Reset form
      setEmergencyType('');
      setSeverity('');
      setSymptoms('');
      setDescription('');
      setShowEmergencyDialog(false);

      toast.success('Emergency request submitted successfully! Help is on the way.');

    } catch (error) {
      console.error('Error submitting emergency:', error);
      toast.error('Failed to submit emergency request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Emergency Services</h1>
          <p className="text-gray-600">Get immediate medical assistance when you need it most</p>
        </div>
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-semibold shadow-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Request Emergency Help
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-6 h-6" />
                Emergency Request Form
              </DialogTitle>
              <DialogDescription>
                Please provide details about your emergency. This information will help medical professionals respond quickly.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Patient Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{user?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium">{user?.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{currentLocation || 'Detecting location...'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Type */}
              <div>
                <label className="text-sm font-medium mb-3 block">Type of Emergency *</label>
                <div className="grid grid-cols-2 gap-3">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setEmergencyType(type.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        emergencyType === type.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className={`w-5 h-5 ${type.color}`} />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="text-sm font-medium mb-3 block">Severity Level *</label>
                <div className="space-y-2">
                  {severityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSeverity(level.value)}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        severity === level.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${level.color}`} />
                        <span className="font-medium capitalize">{level.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="text-sm font-medium mb-2 block">Symptoms *</label>
                <Textarea
                  placeholder="Describe your symptoms in detail (e.g., chest pain, difficulty breathing, etc.)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Additional Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Details (Optional)</label>
                <Textarea
                  placeholder="Any additional information that might help medical professionals"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>

              {/* Emergency Warning */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Emergency Response</h4>
                    <p className="text-sm text-red-700 mt-1">
                      This will alert medical professionals immediately. Only use for genuine emergencies.
                      False reports may result in penalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEmergencySubmit}
                disabled={isSubmitting || !emergencyType || !severity || !symptoms.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Emergency Request
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Emergency Guidelines */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            When to Use Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-800 mb-3">Call Emergency If:</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  Chest pain or pressure
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  Difficulty breathing
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  Severe bleeding
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  Loss of consciousness
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                  Severe allergic reactions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-3">For Non-Emergencies:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  Schedule regular appointments
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  Use chat consultation
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                  Contact your primary doctor
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Emergency Requests */}
      {emergencyRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Emergency Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(request.severity)}`} />
                      <div>
                        <h4 className="font-medium capitalize">{request.emergencyType} Emergency</h4>
                        <p className="text-sm text-gray-600">{formatTimeAgo(request.requestedAt)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Symptoms:</span>
                      <p className="text-sm font-medium">{request.symptoms}</p>
                    </div>
                    {request.description && (
                      <div>
                        <span className="text-sm text-gray-600">Details:</span>
                        <p className="text-sm font-medium">{request.description}</p>
                      </div>
                    )}
                  </div>

                  {request.assignedDoctorName && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Stethoscope className="w-4 h-4" />
                      Assigned to: {request.assignedDoctorName}
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your emergency request has been submitted. Medical professionals are being notified.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-medium">Emergency Services</h4>
              <p className="text-sm text-gray-600">911</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Hospital</h4>
              <p className="text-sm text-gray-600">Direct Line</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium">Your Doctor</h4>
              <p className="text-sm text-gray-600">Emergency Contact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
