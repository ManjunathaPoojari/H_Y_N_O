import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileText, Download, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'appointment', label: 'Appointment Report', icon: Calendar },
    { value: 'patient', label: 'Patient Report', icon: Users },
    { value: 'doctor-performance', label: 'Doctor Performance Report', icon: TrendingUp },
    { value: 'overview', label: 'Hospital Overview Report', icon: BarChart3 },
  ];

  const generateReport = async () => {
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    setLoading(true);
    try {
      const hospitalId = 'H001'; // In a real app, get from auth context
      let endpoint = '';

      switch (selectedReport) {
        case 'appointment':
          endpoint = `/api/hospitals/${hospitalId}/reports/appointments`;
          break;
        case 'patient':
          endpoint = `/api/hospitals/${hospitalId}/reports/patients`;
          break;
        case 'doctor-performance':
          endpoint = `/api/hospitals/${hospitalId}/reports/doctors`;
          break;
        case 'overview':
          endpoint = `/api/hospitals/${hospitalId}/reports/overview`;
          break;
        default:
          throw new Error('Invalid report type');
      }

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${endpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReportData(data);
      toast.success('Report generated successfully');
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
