import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Stethoscope,
  Users,
} from 'lucide-react';

export const DoctorDashboard = () => {
  const schedule = [
    { patient: 'Sarah Johnson', time: '09:30 AM', type: 'Follow-up', room: 'Telehealth', status: 'Ready' },
    { patient: 'Michael Brown', time: '11:00 AM', type: 'Consultation', room: 'Room 214', status: 'Waiting' },
    { patient: 'Emily Davis', time: '01:15 PM', type: 'Post-op', room: 'Room 118', status: 'Ready' },
    { patient: 'Robert Wilson', time: '03:00 PM', type: 'Emergency', room: 'ER Bay 2', status: 'Critical' },
  ];

  const tasks = [
    { label: 'Lab reviews', value: 68 },
    { label: 'Discharge notes', value: 42 },
    { label: 'Prescription renewals', value: 80 },
  ];

  const careTeam = [
    { name: 'Nurse Patel', role: 'Lead nurse', availability: 'On shift' },
    { name: 'Dr. Moore', role: 'Cardiology', availability: 'In surgery' },
    { name: 'Dr. Lee', role: 'Telehealth', availability: 'Available' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">Today&apos;s workload</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Good morning, Dr. Smith</h1>
        <p className="mt-2 text-muted-foreground">
          Stay ahead of your appointments, reports, and team coordination from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Active patients', value: '128', helper: '+6 since yesterday', icon: Users },
          { title: 'Today’s visits', value: '12', helper: '4 virtual, 8 in-person', icon: Calendar },
          { title: 'Reports pending', value: '7', helper: 'Review before 5 PM', icon: FileText },
          { title: 'Average wait', value: '11 min', helper: '↓ 2 min vs last week', icon: Clock },
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
              <CardTitle>Today&apos;s agenda</CardTitle>
              <CardDescription>Your next four consultations</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              See calendar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((item) => (
              <div
                key={item.patient}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.type}</p>
                    <p className="text-xl font-semibold text-slate-900">{item.patient}</p>
                    <p className="text-sm text-muted-foreground">{item.room}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.status === 'Critical'
                        ? 'border-red-200 text-red-600'
                        : item.status === 'Waiting'
                          ? 'border-amber-200 text-amber-600'
                          : 'border-emerald-200 text-emerald-600'
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {item.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Clinical queue</CardTitle>
            <CardDescription>Items awaiting your sign-off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div key={task.label}>
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-slate-900">{task.label}</p>
                  <span className="text-slate-500">{task.value}%</span>
                </div>
                <Progress value={task.value} className="mt-2 bg-slate-100" />
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full">
              Review items
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent updates</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { message: 'CT results uploaded for Daniel Cole', time: '12 min ago' },
              { message: 'Medication query from Jane Cooper', time: '34 min ago' },
              { message: 'Vitals update from Ward 5B', time: '1 hr ago' },
              { message: 'Discharge summary ready for Lisa Wong', time: '3 hr ago' },
            ].map((update) => (
              <div key={update.message} className="border-l-2 border-slate-200 pl-4">
                <p className="text-sm font-medium text-slate-900">{update.message}</p>
                <p className="text-xs text-muted-foreground">{update.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Care team</CardTitle>
            <CardDescription>Who is available now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {careTeam.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <Stethoscope className="h-4 w-4 text-slate-400" />
                  {member.availability}
                </span>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Message team
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
