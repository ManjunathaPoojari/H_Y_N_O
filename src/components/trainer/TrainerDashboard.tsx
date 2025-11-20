import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Activity, Calendar, Dumbbell, MessageSquare, Users } from 'lucide-react';

interface TrainerDashboardProps {
  onNavigate?: (path: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate }) => {
  const sessions = [
    { client: 'Nina Patel', time: '08:00 AM', focus: 'Yoga flow', status: 'Completed' },
    { client: 'Marcus Lee', time: '10:30 AM', focus: 'Strength circuit', status: 'Upcoming' },
    { client: 'Alex Rivera', time: '01:00 PM', focus: 'Mobility', status: 'Upcoming' },
    { client: 'Selena Park', time: '04:00 PM', focus: 'Cardio reset', status: 'Upcoming' },
  ];

  const clientProgress = [
    { name: 'Priya Singh', goal: 'Endurance', completion: 68 },
    { name: 'Leo Carter', goal: 'Posture', completion: 54 },
    { name: 'Emma Boyd', goal: 'Weight loss', completion: 82 },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Daily coaching dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome, Coach Avery</h1>
          <p className="text-muted-foreground mt-2">
            Track client progress, upcoming sessions, and personalized programs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => onNavigate?.('/trainer/schedule')}>
            <Calendar className="h-4 w-4" />
            Open schedule
          </Button>
          <Button variant="outline" onClick={() => onNavigate?.('/trainer/messages')}>
            <MessageSquare className="h-4 w-4" />
            Check messages
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active clients', value: '32', helper: '+3 in onboarding', icon: Users },
          { label: 'Sessions today', value: '6', helper: '2 virtual • 4 onsite', icon: Calendar },
          { label: 'Programs updated', value: '9', helper: 'This week', icon: Activity },
          { label: 'Avg. engagement', value: '92%', helper: 'Last 30 days', icon: Dumbbell },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
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
              <CardTitle>Today&apos;s sessions</CardTitle>
              <CardDescription>Prepare for the next clients</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('/trainer/schedule')}>
              View calendar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.client}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{session.client}</p>
                    <p className="text-sm text-muted-foreground">{session.focus}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      session.status === 'Completed'
                        ? 'border-emerald-200 text-emerald-600'
                        : 'border-slate-200 text-slate-600'
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-500">{session.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Client momentum</CardTitle>
            <CardDescription>Progress toward active goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientProgress.map((client) => (
              <div key={client.name} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.goal}</p>
                  </div>
                  <span className="text-slate-500">{client.completion}%</span>
                </div>
                <Progress value={client.completion} className="mt-3 bg-slate-100" />
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => onNavigate?.('/trainer/clients')}>
              Manage clients
            </Button>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Resource library</CardTitle>
          <CardDescription>Newest routines and learning drops</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Mindful mobility set', detail: '12-min reset routine' },
            { title: 'Strength micro-cycle', detail: 'Progressive overload blocks' },
            { title: 'Client messaging guide', detail: 'Tone and best practices' },
          ].map((resource) => (
            <div key={resource.title} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-muted-foreground">{resource.detail}</p>
              <p className="text-lg font-semibold text-slate-900">{resource.title}</p>
              <Button variant="ghost" size="sm" className="mt-2 px-0 text-primary">
                Open
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

