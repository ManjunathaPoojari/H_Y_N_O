import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api-client';

interface HospitalDashboardProps {
  onNavigate: (path: string) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    bedOccupancy: 0,
    doctors: 0,
    nurses: 0,
    patients: 0,
    emergencyAlerts: 0,
    totalBeds: 100 // Default or fetched
  });
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const [doctorsData, patientsData] = await Promise.all([
          api.hospitals.getDoctors(user.id).catch(() => []),
          api.hospitals.getPatients(user.id).catch(() => [])
        ]);

        setStats(prev => ({
          ...prev,
          doctors: doctorsData ? doctorsData.length : 0,
          patients: patientsData ? patientsData.length : 0,
          // Placeholder for nurses as we don't have an API for them yet
          nurses: 0
        }));

        // Use patients data for recent admissions (mock logic: take last 5 added)
        if (patientsData && Array.isArray(patientsData)) {
          const recent = patientsData.slice(-5).map((p: any) => ({
            id: p.id,
            name: p.name,
            dept: 'General', // No dept data in patient object yet
            time: 'Recently'
          }));
          setAdmissions(recent);
        }

      } catch (error) {
        console.error("Failed to fetch hospital dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

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
          { title: 'Bed occupancy', value: `${stats.bedOccupancy}%`, helper: `${Math.round(stats.totalBeds * (stats.bedOccupancy / 100))} / ${stats.totalBeds} beds`, icon: Bed, badge: 0 },
          { title: 'Clinical staff on duty', value: `${stats.doctors + stats.nurses}`, helper: `${stats.doctors} doctors • ${stats.nurses} nurses`, icon: Stethoscope, badge: 0 },
          { title: 'Patients admitted', value: stats.patients.toString(), helper: 'Total active patients', icon: Users, badge: 0 },
          { title: 'Emergency alerts', value: stats.emergencyAlerts.toString(), helper: 'Critical situations', icon: AlertCircle, badge: stats.emergencyAlerts },
        ].map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                  <stat.icon className="h-4 w-4" />
                </span>
                {stat.badge > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stat.badge}
                  </Badge>
                )}
              </div>
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
            {/* Removed Demo Data */}
            <div className="text-center py-8 text-slate-500">
              No department data available.
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent admissions</CardTitle>
            <CardDescription>Latest patient activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {admissions.length > 0 ? admissions.map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                  {patient.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.dept}</p>
                </div>
                <span className="text-xs text-slate-500">{patient.time}</span>
              </div>
            )) : (
              <div className="text-center py-4 text-slate-500">
                No recent admissions.
              </div>
            )}
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
            {/* Removed Demo Data */}
            <div className="text-center py-8 text-slate-500">
              System online. No active emergency status data.
            </div>
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
            {/* Removed Demo Data */}
            <div className="text-center py-8 text-slate-500">
              No infrastructure data available.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
