import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Calendar,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

interface ReportData {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  totalHospitals: number;
  totalRevenue: number;
  monthlyAppointments: number[];
  appointmentTypes: { type: string; count: number }[];
  userRegistrations: { month: string; count: number }[];
}

export function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data
      const mockData: ReportData = {
        totalAppointments: 1247,
        totalPatients: 892,
        totalDoctors: 156,
        totalHospitals: 23,
        totalRevenue: 456780,
        monthlyAppointments: [120, 145, 167, 189, 201, 234, 256, 278, 301, 323, 345, 367],
        appointmentTypes: [
          { type: 'Video Consultation', count: 456 },
          { type: 'Chat Consultation', count: 323 },
          { type: 'In-Person Visit', count: 289 },
          { type: 'Hospital Appointment', count: 179 }
        ],
        userRegistrations: [
          { month: 'Jan', count: 45 },
          { month: 'Feb', count: 52 },
          { month: 'Mar', count: 48 },
          { month: 'Apr', count: 61 },
          { month: 'May', count: 55 },
          { month: 'Jun', count: 67 }
        ]
      };
      setReportData(mockData);
    } catch (error) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
    // In a real implementation, this would trigger the actual export
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 animate-spin mr-2" />
        <span>Loading reports...</span>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Failed to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and system insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalAppointments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalDoctors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appointment Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Appointment Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.appointmentTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{type.count}</span>
                    <Badge variant="secondary">
                      {((type.count / reportData.totalAppointments) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Appointment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData.monthlyAppointments.map((count, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">Month {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...reportData.monthlyAppointments)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Registration Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">New Registrations</TableHead>
                <TableHead className="text-right">Growth Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.userRegistrations.map((reg, index) => {
                const prevCount = index > 0 ? reportData.userRegistrations[index - 1].count : reg.count;
                const growthRate = ((reg.count - prevCount) / prevCount * 100).toFixed(1);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{reg.month}</TableCell>
                    <TableCell className="text-right">{reg.count}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={parseFloat(growthRate) >= 0 ? "default" : "destructive"}>
                        {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <p className="text-sm text-gray-600">Support Availability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
