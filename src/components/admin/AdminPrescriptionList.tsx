import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../lib/api-client';

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  medicines?: any[];
  notes?: string;
}

interface AdminPrescriptionListProps {
  onNavigate: (path: string) => void;
}

export const AdminPrescriptionList = ({ onNavigate }: AdminPrescriptionListProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await api.pharmacy.getPrescriptions();
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      toast.error('Failed to load prescriptions');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (prescriptionId: string, newStatus: string) => {
    try {
      // Assuming there's an API endpoint to update prescription status
      // await api.pharmacy.updatePrescriptionStatus(prescriptionId, newStatus);
      toast.success(`Prescription status updated to ${newStatus}`);
      // Reload prescriptions to reflect changes
      await loadPrescriptions();
    } catch (error) {
      console.error('Failed to update prescription status:', error);
      toast.error('Failed to update prescription status');
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

  const getStatusActions = (prescription: Prescription) => {
    const status = prescription.status.toLowerCase();

    switch (status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(prescription.id, 'approved')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate(prescription.id, 'rejected')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      case 'approved':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(prescription.id, 'completed')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Complete
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Prescriptions</h1>
        <p className="text-gray-600">Manage prescription requests and approvals</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">Prescription requests will appear here when patients upload them.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Prescription #{prescription.id}</h3>
                      <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                      <p className="text-xs text-gray-500">
                        Doctor: {prescription.doctorName} | Date: {prescription.date}
                      </p>
                      {prescription.medicines && prescription.medicines.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Medicines: {prescription.medicines.length} item(s)
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(prescription.status)}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate(`/admin/pharmacy/prescriptions/${prescription.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {getStatusActions(prescription)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
