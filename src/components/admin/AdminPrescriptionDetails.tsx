import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, FileText, User, Stethoscope, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../lib/api-client';

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  medicines?: any[];
  notes?: string;
  patientId?: string;
  doctorId?: string;
  diagnosis?: string;
  instructions?: string;
}

interface AdminPrescriptionDetailsProps {
  onNavigate: (path: string) => void;
  prescriptionId: string;
}

export const AdminPrescriptionDetails = ({ onNavigate, prescriptionId }: AdminPrescriptionDetailsProps) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPrescription();
  }, [prescriptionId]);

  const loadPrescription = async () => {
    try {
      setLoading(true);
      // Assuming there's an API to get prescription details
      // const data = await api.pharmacy.getPrescriptionById(prescriptionId);
      // For now, using mock data
      const mockData: Prescription = {
        id: prescriptionId,
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        date: '2024-01-15',
        status: 'pending',
        patientId: '1',
        doctorId: '1',
        diagnosis: 'Common cold with fever',
        instructions: 'Take medication as prescribed. Rest and drink plenty of fluids.',
        medicines: [
          { name: 'Paracetamol 500mg', dosage: '500mg', frequency: '3 times daily', duration: '5 days' },
          { name: 'Cough Syrup', dosage: '10ml', frequency: '3 times daily', duration: '7 days' },
        ],
        notes: 'Patient should monitor temperature and report if fever persists beyond 3 days.',
      };
      setPrescription(mockData);
    } catch (error) {
      console.error('Failed to load prescription:', error);
      toast.error('Failed to load prescription details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!prescription) return;

    try {
      setUpdating(true);
      // Assuming there's an API endpoint to update prescription status
      // await api.pharmacy.updatePrescriptionStatus(prescriptionId, newStatus);
      toast.success(`Prescription ${newStatus.toLowerCase()} successfully`);
      setPrescription({ ...prescription, status: newStatus });
    } catch (error) {
      console.error('Failed to update prescription status:', error);
      toast.error('Failed to update prescription status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusActions = () => {
    if (!prescription) return null;

    const status = prescription.status.toLowerCase();

    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-3">
            <Button
              onClick={() => handleStatusUpdate('approved')}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Prescription
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Prescription
            </Button>
          </div>
        );
      case 'approved':
        return (
          <Button
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('/admin/pharmacy/prescriptions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prescriptions
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescription not found</h3>
            <p className="text-gray-600">The requested prescription could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('/admin/pharmacy/prescriptions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Prescriptions
          </Button>
          <div>
            <h1 className="text-3xl mb-2">Prescription Details</h1>
            <p className="text-gray-600">Review and manage prescription #{prescription.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(prescription.status)}
          {getStatusActions()}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Prescription Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prescription Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium">{prescription.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">{prescription.doctorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{prescription.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    {getStatusBadge(prescription.status)}
                  </div>
                </div>
              </div>

              {prescription.diagnosis && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
                  <p className="font-medium">{prescription.diagnosis}</p>
                </div>
              )}

              {prescription.instructions && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instructions</p>
                  <p className="font-medium">{prescription.instructions}</p>
                </div>
              )}

              {prescription.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Additional Notes</p>
                  <p className="font-medium">{prescription.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicines */}
          {prescription.medicines && prescription.medicines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prescribed Medicines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{medicine.name}</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage</p>
                          <p className="font-medium">{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frequency</p>
                          <p className="font-medium">{medicine.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-medium">{medicine.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getStatusActions()}
              <Button variant="outline" className="w-full">
                Print Prescription
              </Button>
              <Button variant="outline" className="w-full">
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600">{prescription.date}</p>
                  </div>
                </div>
                {prescription.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      prescription.status === 'approved' ? 'bg-green-500' :
                      prescription.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{prescription.status}</p>
                      <p className="text-xs text-gray-600">Just now</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
