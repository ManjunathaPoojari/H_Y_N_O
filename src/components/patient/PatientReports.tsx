import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Calendar,
  Search,
  Filter,
  Eye,
  FileCheck,
  Pill,
  Activity,
  Stethoscope
} from 'lucide-react';

interface MedicalReport {
  id: string;
  type: 'lab_test' | 'prescription' | 'visit_summary' | 'imaging' | 'vaccination';
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  status: 'completed' | 'pending' | 'reviewed';
  description: string;
  fileUrl?: string;
}

export function PatientReports() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, filterType]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Mock data - in real implementation, this would fetch from backend
      const mockReports: MedicalReport[] = [
        {
          id: '1',
          type: 'lab_test',
          title: 'Complete Blood Count (CBC)',
          date: '2024-01-15',
          doctor: 'Dr. Sarah Johnson',
          hospital: 'City General Hospital',
          status: 'completed',
          description: 'Routine blood test to evaluate overall health',
          fileUrl: '#'
        },
        {
          id: '2',
          type: 'prescription',
          title: 'Blood Pressure Medication',
          date: '2024-01-10',
          doctor: 'Dr. Michael Chen',
          hospital: 'Metro Health Center',
          status: 'completed',
          description: 'Amlodipine 5mg - Take once daily',
          fileUrl: '#'
        },
        {
          id: '3',
          type: 'visit_summary',
          title: 'Annual Physical Examination',
          date: '2024-01-08',
          doctor: 'Dr. Emily Davis',
          hospital: 'Wellness Medical Group',
          status: 'reviewed',
          description: 'Comprehensive health checkup - All vitals normal',
          fileUrl: '#'
        },
        {
          id: '4',
          type: 'imaging',
          title: 'Chest X-Ray',
          date: '2024-01-05',
          doctor: 'Dr. Robert Wilson',
          hospital: 'Radiology Center',
          status: 'completed',
          description: 'Clear chest X-ray - No abnormalities detected',
          fileUrl: '#'
        },
        {
          id: '5',
          type: 'vaccination',
          title: 'COVID-19 Booster',
          date: '2023-12-20',
          doctor: 'Dr. Lisa Anderson',
          hospital: 'Community Health Clinic',
          status: 'completed',
          description: 'Pfizer-BioNTech COVID-19 Vaccine Booster',
          fileUrl: '#'
        },
        {
          id: '6',
          type: 'lab_test',
          title: 'Lipid Profile',
          date: '2023-12-15',
          doctor: 'Dr. Sarah Johnson',
          hospital: 'City General Hospital',
          status: 'pending',
          description: 'Cholesterol and triglyceride levels',
          fileUrl: '#'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      toast.error('Failed to load medical reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.type === filterType);
    }

    setFilteredReports(filtered);
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'lab_test':
        return <Activity className="h-4 w-4" />;
      case 'prescription':
        return <Pill className="h-4 w-4" />;
      case 'visit_summary':
        return <Stethoscope className="h-4 w-4" />;
      case 'imaging':
        return <FileCheck className="h-4 w-4" />;
      case 'vaccination':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'lab_test':
        return 'Lab Test';
      case 'prescription':
        return 'Prescription';
      case 'visit_summary':
        return 'Visit Summary';
      case 'imaging':
        return 'Imaging';
      case 'vaccination':
        return 'Vaccination';
      default:
        return 'Report';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const downloadReport = (report: MedicalReport) => {
    toast.success(`Downloading ${report.title}`);
    // In real implementation, this would trigger actual download
  };

  const viewReport = (report: MedicalReport) => {
    setSelectedReport(report);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 animate-spin mr-2" />
        <span>Loading medical reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-gray-600">View and download your medical records</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lab_test">Lab Tests</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="visit_summary">Visit Summaries</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="vaccination">Vaccinations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Medical Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getReportTypeIcon(report.type)}
                      <span className="text-sm">{getReportTypeLabel(report.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{report.doctor}</TableCell>
                  <TableCell>{report.hospital}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReport(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Modal */}
      {selectedReport && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getReportTypeIcon(selectedReport.type)}
                <span>{selectedReport.title}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p>{new Date(selectedReport.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Doctor</label>
                <p>{selectedReport.doctor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Hospital</label>
                <p>{selectedReport.hospital}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="mt-1">{selectedReport.description}</p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => downloadReport(selectedReport)}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
