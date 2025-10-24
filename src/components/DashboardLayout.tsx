import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Activity, Bell, Search, LogOut, Menu, X,
  LayoutDashboard, Users, Calendar, MessageSquare, Video, 
  FileText, Settings, Building2, UserCog, AlertCircle,
  Pill, User, Hospital, Stethoscope, Apple, Dumbbell
} from 'lucide-react';
import { Input } from './ui/input';
import { useAuth } from '../lib/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'patient' | 'doctor' | 'hospital' | 'admin';
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  role, 
  onNavigate,
  currentPath 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  // Navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
          { icon: Calendar, label: 'Book Appointment', path: '/patient/book', children: [
            { label: 'In-Person', path: '/patient/book/inperson' },
            { label: 'Video Consultation', path: '/patient/book/video' },
            { label: 'Chat Consultation', path: '/patient/book/chat' },
            { label: 'Hospital', path: '/patient/book/hospital' },
          ]},
          { icon: Calendar, label: 'My Appointments', path: '/patient/appointments' },
          { icon: MessageSquare, label: 'Chat', path: '/patient/chat' },
          { icon: Video, label: 'Video Consultation', path: '/patient/meetings' },
          { icon: FileText, label: 'Reports', path: '/patient/reports' },
          { icon: Pill, label: 'Online Pharmacy', path: '/patient/pharmacy' },
          { icon: Apple, label: 'Nutrition & Diet', path: '/patient/nutrition' },
          { icon: Dumbbell, label: 'Yoga & Fitness', path: '/patient/yoga' },
          { icon: User, label: 'Profile', path: '/my-profile' },
        ];
      
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor-dashboard' },
          { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
          { icon: Users, label: 'Patients', path: '/doctor/patients' },
          { icon: Calendar, label: 'Schedule', path: '/doctor/schedule' },
          { icon: MessageSquare, label: 'Chat', path: '/doctor/chat' },
          { icon: Video, label: 'Video Consultation', path: '/doctor/meetings' },
          { icon: User, label: 'Profile', path: '/doctor/profile' },
        ];
      
      case 'hospital':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hospital-dashboard' },
          { icon: Stethoscope, label: 'Doctors', path: '/hospital/doctors' },
          { icon: Calendar, label: 'Appointments', path: '/hospital/appointments' },
          { icon: Users, label: 'Patients', path: '/hospital/patients' },
          { icon: User, label: 'Profile', path: '/hospital/profile' },
        ];
      
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
          { icon: Building2, label: 'Hospitals', path: '/admin/hospitals' },
          { icon: UserCog, label: 'Doctors', path: '/admin/doctors' },
          { icon: Users, label: 'Patients', path: '/admin/patients' },
          { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
          { icon: AlertCircle, label: 'Emergency', path: '/admin/emergency' },
          { icon: FileText, label: 'Reports', path: '/admin/reports' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl text-blue-600">HYNO</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'patient' && (
              <Button variant="outline" size="sm" className="hidden md:flex">
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                Emergency
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:sticky top-0 left-0 z-30 h-[calc(100vh-57px)] bg-white border-r w-64
            transition-transform duration-200 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-2 overflow-y-auto h-full">
            {navItems.map((item) => (
              <div key={item.path}>
                <Button
                  variant={currentPath === item.path ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate(item.path);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
                {item.children && (
                  <div className="ml-7 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.path}
                        variant={currentPath === child.path ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          onNavigate(child.path);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                      >
                        {child.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
