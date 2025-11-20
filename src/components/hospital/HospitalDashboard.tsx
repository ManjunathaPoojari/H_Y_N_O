import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Activity,
  AlertCircle,
  Bed,
  Building2,
  Landmark,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';

interface HospitalDashboardProps {
  onNavigate: (path: string) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onNavigate }) => {
  const departments = [
    { name: 'Cardiology', load: 78, state: 'Busy' },
    { name: 'Neurology', load: 54, state: 'Stable' },
    { name: 'Pediatrics', load: 61, state: 'Stable' },
    { name: 'Orthopedics', load: 83, state: 'Busy' },
    { name: 'Emergency', load: 92, state: 'Critical' },
  ];

  const admissions = [
    { name: 'James Wilson', dept: 'Cardiology', time: '10 min ago' },
    { name: 'Linda Martinez', dept: 'Emergency', time: '25 min ago' },
    { name: 'Robert Taylor', dept: 'Neurology', time: '1 hr ago' },
    { name: 'Susan Anderson', dept: 'Pediatrics', time: '2 hr ago' },
  ];

  const infra = [
    { label: 'ICU beds', used: 26, total: 30 },
    { label: 'Ventilators', used: 14, total: 20 },
    { label: 'Operating rooms', used: 6, total: 8 },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Network command center</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Hospital overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor occupancy, emergency readiness, and care teams in real time.
          </p>
        </div>
        <Button variant="outline" onClick={() => onNavigate('/hospital/emergency')}>
          <AlertCircle className="h-4 w-4" />
          Emergency status
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Bed occupancy', value: '85%', helper: '142 / 167 beds', icon: Bed },
          { title: 'Clinical staff on duty', value: '64', helper: '12 doctors • 52 nurses', icon: Stethoscope },
          { title: 'Patients admitted', value: '1,893', helper: '+124 this week', icon: Users },
          { title: 'Financial outlook', value: '+12.5%', helper: 'Month over month', icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
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
              <CardTitle>Department load</CardTitle>
              <CardDescription>Live utilization by speciality</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/hospital/reports')}>
              View detailed report
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.name} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{dept.name}</p>
                    <p className="text-sm text-muted-foreground">{dept.load}% capacity</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      dept.state === 'Critical'
                        ? 'border-red-200 text-red-600'
                        : dept.state === 'Busy'
                          ? 'border-amber-200 text-amber-600'
                          : 'border-emerald-200 text-emerald-600'
                    }
                  >
                    {dept.state}
                  </Badge>
                </div>
                <Progress value={dept.load} className="mt-4 bg-slate-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent admissions</CardTitle>
            <CardDescription>Last 2 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {admissions.map((patient) => (
              <div key={patient.name} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                  {patient.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.dept}</p>
                </div>
                <span className="text-xs text-slate-500">{patient.time}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate('/hospital/patients')}>
              View all patients
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Emergency readiness</CardTitle>
            <CardDescription>Live vitals from critical units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Resuscitation bays', status: 'Available', icon: Activity },
              { label: 'Surge triage', status: 'High traffic', icon: Building2 },
              { label: 'Helipad', status: 'Operational', icon: Landmark },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.status}</p>
                  </div>
                </div>
                <Badge variant="outline">Live</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate('/hospital/emergency')}>
              Open emergency board
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Infrastructure usage</CardTitle>
            <CardDescription>Key life-support resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {infra.map((item) => {
              const percent = Math.round((item.used / item.total) * 100);
              return (
                <div key={item.label} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <span className="text-slate-500">
                      {item.used}/{item.total}
                    </span>
                  </div>
                  <Progress value={percent} className="mt-3 bg-slate-100" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
