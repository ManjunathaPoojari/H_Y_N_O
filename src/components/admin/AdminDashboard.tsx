import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileBarChart,
  LineChart,
  ShieldCheck,
  Users,
  RefreshCw,
} from 'lucide-react';
import { adminAPI } from '../../lib/api-client';

interface DashboardStats {
  networkStats: {
    hospitalsLive: number;
    hospitalsPending: number;
    doctorsVerified: number;
    doctorsPending: number;
    doctorsThisWeek: number;
    criticalAlerts: number;
    complianceScore: number;
  };
  pendingApprovals: {
    items: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      entityType: string;
    }>;
    totalCount: number;
  };
  operationalMetrics: {
    telehealthCapacity: number;
    pharmacySLA: number;
    insuranceClaims: number;
  };
  complianceChecklist: Array<{
    title: string;
    detail: string;
    status: string;
  }>;
  networkHealth: Array<{
    message: string;
    time: string;
  }>;
  performanceForecast: {
    utilization: number;
    utilizationTrend: string;
    satisfaction: number;
    satisfactionChange: string;
    riskIndex: string;
    riskMonitoring: string;
  };
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getStats();
      console.log('Dashboard API Response:', data);
      console.log('Response keys:', Object.keys(data));
      console.log('Has networkStats?', !!data.networkStats);
      console.log('Has pendingApprovals?', !!data.pendingApprovals);
      console.log('Has operationalMetrics?', !!data.operationalMetrics);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats || !stats.networkStats || !stats.pendingApprovals || !stats.operationalMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Invalid Data Format</h3>
              <p className="text-gray-600 mb-4">The dashboard data is not in the expected format.</p>
              <Button onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const networkStats = [
    {
      label: 'Hospitals live',
      value: stats.networkStats.hospitalsLive.toString(),
      helper: `${stats.networkStats.hospitalsPending} pending onboarding`,
      icon: Building2,
    },
    {
      label: 'Doctors verified',
      value: stats.networkStats.doctorsVerified.toString(),
      helper: `+${stats.networkStats.doctorsThisWeek} this week`,
      icon: Users,
    },
    {
      label: 'Critical alerts',
      value: stats.networkStats.criticalAlerts.toString(),
      helper: 'Escalated to emergency',
      icon: AlertTriangle,
    },
    {
      label: 'Compliance score',
      value: `${stats.networkStats.complianceScore}%`,
      helper: 'ISO 27001, HIPAA',
      icon: ShieldCheck,
    },
  ];

  const operations = [
    { label: 'Telehealth capacity', value: stats.operationalMetrics.telehealthCapacity },
    { label: 'Pharmacy SLAs', value: stats.operationalMetrics.pharmacySLA },
    { label: 'Insurance claims', value: stats.operationalMetrics.insuranceClaims },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Command & performance</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin control room</h1>
          <p className="text-muted-foreground mt-2">
            Track provider onboarding, network health, compliance, and escalations at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <FileBarChart className="h-4 w-4" />
            Export metrics
          </Button>
          <Button variant="outline">
            <CheckCircle2 className="h-4 w-4" />
            Approvals board
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {networkStats.map((stat) => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                <stat.icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Pending approvals</CardTitle>
              <CardDescription>Items that need your decision</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Review all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.pendingApprovals.items.length > 0 ? (
              stats.pendingApprovals.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending approvals</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Operational scorecard</CardTitle>
            <CardDescription>Live service levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operations.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-slate-900">{metric.label}</p>
                  <span className="text-slate-500">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="mt-2 bg-slate-100" />
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full">
              Update targets
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Network health</CardTitle>
            <CardDescription>Signals from partner facilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.networkHealth.length > 0 ? (
              stats.networkHealth.map((alert, index) => (
                <div key={index} className="border-l-2 border-slate-200 pl-4">
                  <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent alerts</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Compliance checklist</CardTitle>
            <CardDescription>Automated monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.complianceChecklist.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 px-4 py-3 transition hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === 'Action required'
                        ? 'border-amber-200 text-amber-600'
                        : 'border-emerald-200 text-emerald-600'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View audit trail
            </Button>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Performance forecast</CardTitle>
            <CardDescription>Rolling 6-week projection</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <LineChart className="h-4 w-4" />
            Open analytics
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-muted-foreground">Utilization</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.performanceForecast.utilization}%
            </p>
            <p className="text-xs text-slate-500">{stats.performanceForecast.utilizationTrend}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-muted-foreground">Satisfaction</p>
            <p className="text-2xl font-semibold text-slate-900">
              {stats.performanceForecast.satisfaction} / 5
            </p>
            <p className="text-xs text-slate-500">{stats.performanceForecast.satisfactionChange}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-muted-foreground">Risk index</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.performanceForecast.riskIndex}</p>
            <p className="text-xs text-slate-500">{stats.performanceForecast.riskMonitoring}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

