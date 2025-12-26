import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    CheckCircle2,
    Circle,
    Clock,
    Activity,
    Droplet,
    Pill,
    Heart,
    Target,
    Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';

const iconMap: Record<string, any> = {
    Pill,
    Droplet,
    Activity,
    Heart
};

export const PatientCarePlan = () => {
    const { user } = useAuth();
    const { carePlanTasks, toggleTask, saveVitals } = useAppStore();

    const [vitals, setVitals] = useState({
        bpSystolic: '',
        bpDiastolic: '',
        weight: '',
        glucose: ''
    });

    const handleTaskToggle = async (taskId: string) => {
        await toggleTask(taskId);
    };

    const handleVitalsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        await saveVitals({
            id: Math.random().toString(36).substr(2, 9),
            patientId: user.id,
            date: new Date().toISOString(),
            bpSystolic: Number(vitals.bpSystolic) || undefined,
            bpDiastolic: Number(vitals.bpDiastolic) || undefined,
            weight: Number(vitals.weight) || undefined,
            glucose: Number(vitals.glucose) || undefined
        });

        // Reset form
        setVitals({
            bpSystolic: '',
            bpDiastolic: '',
            weight: '',
            glucose: ''
        });
    };

    const completedCount = carePlanTasks.filter(t => t.status === 'completed').length;
    const progress = carePlanTasks.length > 0 ? Math.round((completedCount / carePlanTasks.length) * 100) : 0;

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Care Plan</h1>
                    <p className="text-muted-foreground mt-2">
                        Stay on top of your health with daily tasks and goals.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Trophy className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Adherence Score</p>
                                <p className="text-2xl font-bold text-primary">92%</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Daily Checklist</CardTitle>
                                <CardDescription>Your prescribed tasks for today</CardDescription>
                            </div>
                            <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                                {progress}% Complete
                            </Badge>
                        </div>
                        <Progress value={progress} className="h-2 mt-4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {carePlanTasks.length === 0 && (
                            <div className="text-center py-6 text-slate-500">
                                No tasks assigned for today. Enjoy your day!
                            </div>
                        )}
                        {carePlanTasks.map((task) => {
                            const Icon = iconMap[task.iconName || ''] || Circle;
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskToggle(task.id)}
                                    className={`
                  flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                  ${task.status === 'completed'
                                            ? 'bg-slate-50 border-slate-200 opacity-60'
                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                        }
                `}
                                >
                                    <div className={`
                  mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${task.status === 'completed'
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-slate-300'
                                        }
                `}>
                                        {task.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-white" />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                                {task.title}
                                            </h3>
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                {task.time}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                    </div>

                                    <div className={`p-2 rounded-full ${task.status === 'completed' ? 'bg-slate-100' : 'bg-slate-50'}`}>
                                        <Icon className={`h-5 w-5 ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Record Vitals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleVitalsSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Blood Pressure (mmHg)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Systolic"
                                            value={vitals.bpSystolic}
                                            onChange={e => setVitals({ ...vitals, bpSystolic: e.target.value })}
                                        />
                                        <span className="text-2xl text-slate-300">/</span>
                                        <Input
                                            placeholder="Diastolic"
                                            value={vitals.bpDiastolic}
                                            onChange={e => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.0"
                                        value={vitals.weight}
                                        onChange={e => setVitals({ ...vitals, weight: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">Save Records</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-600" />
                                Goals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Daily Steps</p>
                                    <p className="text-xs text-muted-foreground">Goal: 8,000 / day</p>
                                </div>
                                <Badge className="bg-white text-blue-700 hover:bg-white">35%</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Droplet className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Water Intake</p>
                                    <p className="text-xs text-muted-foreground">Goal: 2,500ml / day</p>
                                </div>
                                <Badge className="bg-white text-blue-700 hover:bg-white">60%</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
