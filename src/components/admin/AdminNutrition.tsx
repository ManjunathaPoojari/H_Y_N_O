import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Utensils, Apple, ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const AdminNutrition = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Nutrition Management</h1>
                <p className="text-gray-600">Manage diet plans, nutrition guidelines, and foods</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Diet Plans</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+4 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">3 requiring attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Food Database</CardTitle>
                        <Apple className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450+</div>
                        <p className="text-xs text-muted-foreground">Items logged</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="plans" className="w-full">
                <TabsList>
                    <TabsTrigger value="plans">Diet Plans</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                    <TabsTrigger value="database">Food Database</TabsTrigger>
                </TabsList>

                <TabsContent value="plans" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Standard Diet Plans</h2>
                        <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Plan
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <p>No diet plans created yet. Start by creating a standard plan.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                    <h2 className="text-lg font-semibold">Patient Requests</h2>
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <p>No pending nutrition requests.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="database" className="space-y-4">
                    <h2 className="text-lg font-semibold">Food Items</h2>
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            <p>Food database is up to date.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
