import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3, FileBarChart } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';

interface ReportData {
  hospitalId: string;
  totalPatients?: number;
  activePatients?: number;
  reportPeriod?: string;
  generatedAt?: string;
  ageDistribution?: Record<string, number>;
  summary?: {
    totalPatients: number;
    activePatients: number;
    totalAppointments: number;
    completedAppointments: number;
  };
  doctorMetrics?: string;
}

export const HospitalReports: React.FC = () => {
  const { patients, appointments, doctors } = useAppStore();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-31');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'appointment', label: 'Appointment Report', icon: Calendar },
    { value: 'patient', label: 'Patient Report', icon: Users },
    { value: 'doctor-performance', label: 'Doctor Performance Report', icon: TrendingUp },
    { value: 'overview', label: 'Hospital Overview Report', icon: BarChart3 },
    { value: 'comprehensive', label: 'Comprehensive Facility Report', icon: FileBarChart },
  ];

  const generateReport = async () => {
    if (!selectedReport || !user?.id) {
      toast.error('Please select a report type and ensure you are logged in');
      return;
    }

    setLoading(true);
    try {
      const hospitalId = user.id;
      const now = new Date().toISOString();
      const reportPeriod = startDate && endDate ? `${startDate} to ${endDate}` : 'All Time';
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      // Filter data for current hospital
      const hospitalPatients = patients.filter(p => p.hospitalId === hospitalId);
      const hospitalAppointments = appointments.filter(a => a.hospitalId === hospitalId && new Date(a.date) >= start && new Date(a.date) <= end);
      const hospitalDoctors = doctors.filter(d => d.hospitalId === hospitalId);

      let data: ReportData = {
        hospitalId,
        reportPeriod,
        generatedAt: now,
      };

      switch (selectedReport) {
        case 'appointment':
          const completedAppts = hospitalAppointments.filter(a => a.status === 'completed');
          const activePatients = hospitalPatients.filter(p => hospitalAppointments.some(a => a.patientId === p.id && a.status === 'booked')).length;
          data = {
            ...data,
            totalPatients: hospitalPatients.length,
            activePatients,
            summary: {
              totalAppointments: hospitalAppointments.length,
              completedAppointments: completedAppts.length,
              totalPatients: hospitalPatients.length,
              activePatients,
            }
          };
          break;

        case 'patient':
          const ageDistribution: Record<string, number> = {};
          hospitalPatients.forEach(p => {
            const age = p.age;
            let group = 'Unknown';
            if (age <= 18) group = '0-18';
            else if (age <= 35) group = '19-35';
            else if (age <= 50) group = '36-50';
            else if (age <= 65) group = '51-65';
            else group = '65+';
            ageDistribution[group] = (ageDistribution[group] || 0) + 1;
          });
          data = {
            ...data,
            totalPatients: hospitalPatients.length,
            ageDistribution,
          };
          break;

        case 'doctor-performance':
          const doctorMetrics: Record<string, { name: string; appointments: number; completed: number }> = {};
          hospitalDoctors.forEach(d => {
            const docAppts = hospitalAppointments.filter(a => a.doctorId === d.id);
            const docCompleted = docAppts.filter(a => a.status === 'completed');
            doctorMetrics[d.id] = {
              name: d.name,
              appointments: docAppts.length,
              completed: docCompleted.length,
            };
          });
          data = {
            ...data,
            totalPatients: hospitalPatients.length,
            doctorMetrics: JSON.stringify(doctorMetrics, null, 2),
          };
          break;

        case 'overview':
          const overviewCompleted = hospitalAppointments.filter(a => a.status === 'completed');
          data = {
            ...data,
            summary: {
              totalPatients: hospitalPatients.length,
              activePatients: hospitalPatients.filter(p => hospitalAppointments.some(a => a.patientId === p.id && a.status === 'booked')).length,
              totalAppointments: hospitalAppointments.length,
              completedAppointments: overviewCompleted.length,
            }
          };
          break;

        case 'comprehensive':
          const compAgeDist: Record<string, number> = {};
          hospitalPatients.forEach(p => {
            const age = p.age;
            let group = 'Unknown';
            if (age <= 18) group = '0-18';
            else if (age <= 35) group = '19-35';
            else if (age <= 50) group = '36-50';
            else if (age <= 65) group = '51-65';
            else group = '65+';
            compAgeDist[group] = (compAgeDist[group] || 0) + 1;
          });

          const compDoctorMetrics: Record<string, { name: string; appointments: number; completed: number }> = {};
          hospitalDoctors.forEach(d => {
            const docAppts = hospitalAppointments.filter(a => a.doctorId === d.id);
            const docCompleted = docAppts.filter(a => a.status === 'completed');
            compDoctorMetrics[d.id] = {
              name: d.name,
              appointments: docAppts.length,
              completed: docCompleted.length,
            };
          });

          const compCompleted = hospitalAppointments.filter(a => a.status === 'completed');
          const compActivePatients = hospitalPatients.filter(p => hospitalAppointments.some(a => a.patientId === p.id && a.status === 'booked')).length;
          data = {
            ...data,
            totalPatients: hospitalPatients.length,
            activePatients: compActivePatients,
            ageDistribution: compAgeDist,
            summary: {
              totalPatients: hospitalPatients.length,
              activePatients: compActivePatients,
              totalAppointments: hospitalAppointments.length,
              completedAppointments: compCompleted.length,
            },
            doctorMetrics: JSON.stringify(compDoctorMetrics, null, 2),
          };
          break;

        default:
          throw new Error('Invalid report type');
      }

      setReportData(data);
      toast.success('Report generated successfully using facility data');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const reportText = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully');
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (selectedReport) {
      case 'appointment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{reportData.totalPatients || 0}</div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{reportData.activePatients || 0}</div>
                  <p className="text-sm text-gray-600">Active Patients</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-sm text-gray-600">
              <p>Report Period: {reportData.reportPeriod}</p>
              <p>Generated At: {reportData.generatedAt}</p>
            </div>
          </div>
        );

      case 'patient':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{reportData.totalPatients || 0}</div>
                <p className="text-sm text-gray-600">Total Patients</p>
              </CardContent>
            </Card>
            {reportData.ageDistribution && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(reportData.ageDistribution).map(([ageGroup, count]) => (
                      <div key={ageGroup} className="flex justify-between">
                        <span>{ageGroup}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="text-sm text-gray-600">
              <p>Generated At: {reportData.generatedAt}</p>
            </div>
          </div>
        );

      case 'doctor-performance':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{reportData.totalPatients || 0}</div>
                <p className="text-sm text-gray-600">Total Patients</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-gray-600">{reportData.doctorMetrics || 'Doctor performance metrics will be calculated here'}</p>
              </CardContent>
            </Card>
            <div className="text-sm text-gray-600">
              <p>Report Period: {reportData.reportPeriod}</p>
              <p>Generated At: {reportData.generatedAt}</p>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="space-y-4">
            {reportData.summary && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{reportData.summary.totalPatients}</div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{reportData.summary.activePatients}</div>
                    <p className="text-sm text-gray-600">Active Patients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{reportData.summary.totalAppointments}</div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{reportData.summary.completedAppointments}</div>
                    <p className="text-sm text-gray-600">Completed Appointments</p>
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>Report Period: {reportData.reportPeriod}</p>
              <p>Generated At: {reportData.generatedAt}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Hospital Reports</h1>
        <p className="text-gray-600">Generate and view hospital reports</p>
      </div>

      {/* Report Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={generateReport} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Generating...' : 'Generate Report'}
            <FileText className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Report Display */}
      {reportData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Report Results</CardTitle>
            <Button onClick={downloadReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardHeader>
          <CardContent>
            {renderReportContent()}
          </CardContent>
        </Card>
      )}

      {/* Quick Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <Card
                key={type.value}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedReport(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-600">
                    {type.value === 'appointment' && 'Patient appointment statistics'}
                    {type.value === 'patient' && 'Patient demographics and data'}
                    {type.value === 'doctor-performance' && 'Doctor performance metrics'}
                    {type.value === 'overview' && 'Comprehensive hospital overview'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
