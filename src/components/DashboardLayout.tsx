import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Activity, Bell, Search, LogOut,
  LayoutDashboard, Users, Calendar, MessageSquare, Video,
  FileText, Settings, Building2, UserCog, AlertCircle,
  Pill, User, Hospital, Stethoscope, Apple, Dumbbell
} from 'lucide-react';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useAuth } from '../lib/auth-context';
import { useSearch } from '../lib/search-context';
import { useNotifications } from '../lib/notification-context';

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
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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
          { icon: AlertCircle, label: 'Emergency', path: '/hospital/emergency' },
          { icon: FileText, label: 'Reports', path: '/hospital/reports' },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl text-blue-600">HYNO</span>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onNavigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              {role === 'patient' && (
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Emergency
                </Button>
              )}
            </div>

            {/* Centered Search Bar */}
            <div className="flex-1 flex justify-center px-4">
              <div className="hidden md:flex items-center gap-4 w-full max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Handle search redirects for admin
                        if (role === 'admin') {
                          const query = searchQuery.toLowerCase().trim();
                          if (query === 'doctor') {
                            window.location.href = '/admin/doctors';
                          } else if (query === 'patient') {
                            window.location.href = '/admin/patients';
                          } else if (query === 'hospital') {
                            window.location.href = '/admin/hospitals';
                          }
                        }
                        e.currentTarget.blur();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        {unreadCount} unread
                      </Badge>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {notification.unread && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <span className="text-xs text-gray-400">{notification.time}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={markAllAsRead}
                    >
                      Mark All as Read
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
