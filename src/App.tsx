import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { AppProvider } from './lib/app-context';
import { AppStoreProvider } from './lib/app-store';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { DashboardLayout } from './components/DashboardLayout';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { BookAppointment } from './components/patient/BookAppointment';
import { MyAppointments } from './components/patient/MyAppointments';
import { PatientProfile } from './components/patient/PatientProfile';
import { OnlinePharmacy } from './components/patient/OnlinePharmacy';
import { NutritionWellness } from './components/patient/NutritionWellness';
import { YogaFitness } from './components/patient/YogaFitness';
import { ChatInterface } from './components/common/ChatInterface';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HospitalManagement } from './components/admin/HospitalManagement';
import { DoctorManagement } from './components/admin/DoctorManagement';
import { ConfigStatus } from './components/ConfigStatus';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPath, setCurrentPath] = useState('/');
  const { isAuthenticated, user } = useAuth();

  // Initialize path from URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path && path !== '/') {
      setCurrentPath(path);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path);
  };

  // Render based on current path
  const renderContent = () => {
    // Public routes
    if (currentPath === '/') {
      return <LandingPage onNavigate={navigate} />;
    }

    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} role="patient" />;
    }

    if (currentPath === '/admin-login') {
      return <LoginPage onNavigate={navigate} role="admin" />;
    }

    if (currentPath === '/doctor-login') {
      return <LoginPage onNavigate={navigate} role="doctor" />;
    }

    if (currentPath === '/hospital-login') {
      return <LoginPage onNavigate={navigate} role="hospital" />;
    }

    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }

    // Protected routes - require authentication
    if (!isAuthenticated) {
      return <LandingPage onNavigate={navigate} />;
    }

    // Patient routes
    if (user?.role === 'patient') {
      return (
        <DashboardLayout role="patient" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/patient/dashboard' && <PatientDashboard onNavigate={navigate} />}
          {currentPath === '/patient/book/video' && <BookAppointment type="video" />}
          {currentPath === '/patient/book/chat' && <BookAppointment type="chat" />}
          {currentPath === '/patient/book/inperson' && <BookAppointment type="inperson" />}
          {currentPath === '/patient/book/hospital' && <BookAppointment type="hospital" />}
          {currentPath === '/patient/appointments' && <MyAppointments />}
          {currentPath === '/patient/chat' && <ChatInterface />}
          {currentPath === '/patient/meetings' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Video Consultations</h1>
              <p className="text-gray-600">Your video consultation meetings</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Video meeting interface will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/patient/reports' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Medical Reports</h1>
              <p className="text-gray-600">View and download your medical reports</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Reports list will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/patient/pharmacy' && <OnlinePharmacy />}
          {currentPath === '/patient/nutrition' && <NutritionWellness />}
          {currentPath === '/patient/yoga' && <YogaFitness />}
          {currentPath === '/my-profile' && <PatientProfile />}
        </DashboardLayout>
      );
    }

    // Doctor routes
    if (user?.role === 'doctor') {
      return (
        <DashboardLayout role="doctor" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/doctor-dashboard' && <DoctorDashboard />}
          {currentPath === '/doctor/appointments' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Appointments</h1>
              <p className="text-gray-600">Manage your patient appointments</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Appointments management will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/doctor/patients' && (
            <div className="space-y-4">
              <h1 className="text-3xl">My Patients</h1>
              <p className="text-gray-600">View patient records and history</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Patient list will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/doctor/schedule' && (
            <div className="space-y-4">
              <h1 className="text-3xl">My Schedule</h1>
              <p className="text-gray-600">Manage your availability</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Schedule management will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/doctor/chat' && <ChatInterface />}
          {currentPath === '/doctor/meetings' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Video Consultations</h1>
              <p className="text-gray-600">Conduct video consultations</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Video meeting interface will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/doctor/profile' && (
            <div className="space-y-4">
              <h1 className="text-3xl">My Profile</h1>
              <p className="text-gray-600">Manage your profile and credentials</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Profile settings will be displayed here</p>
              </div>
            </div>
          )}
        </DashboardLayout>
      );
    }

    // Hospital routes
    if (user?.role === 'hospital') {
      return (
        <DashboardLayout role="hospital" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/hospital-dashboard' && <HospitalDashboard />}
          {currentPath === '/hospital/doctors' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Manage Doctors</h1>
              <p className="text-gray-600">Add and manage doctors at your facility</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Doctor management will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/hospital/appointments' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Appointments</h1>
              <p className="text-gray-600">Manage hospital appointments</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Appointment management will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/hospital/patients' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Patients</h1>
              <p className="text-gray-600">View patient records</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Patient records will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/hospital/profile' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Hospital Profile</h1>
              <p className="text-gray-600">Manage hospital information</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Hospital profile will be displayed here</p>
              </div>
            </div>
          )}
        </DashboardLayout>
      );
    }

    // Admin routes
    if (user?.role === 'admin') {
      return (
        <DashboardLayout role="admin" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/admin-dashboard' && <AdminDashboard />}
          {currentPath === '/admin/hospitals' && <HospitalManagement />}
          {currentPath === '/admin/doctors' && <DoctorManagement />}
          {currentPath === '/admin/patients' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Patients</h1>
              <p className="text-gray-600">View and manage patient records</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Patient records will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/admin/appointments' && (
            <div className="space-y-4">
              <h1 className="text-3xl">All Appointments</h1>
              <p className="text-gray-600">Monitor system-wide appointments</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Appointment monitoring will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/admin/emergency' && (
            <div className="space-y-4">
              <h1 className="text-3xl">Emergency Requests</h1>
              <p className="text-gray-600">Handle emergency consultations</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Emergency management will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/admin/reports' && (
            <div className="space-y-4">
              <h1 className="text-3xl">System Reports</h1>
              <p className="text-gray-600">Generate and export system reports</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Reports will be displayed here</p>
              </div>
            </div>
          )}
          {currentPath === '/admin/settings' && (
            <div className="space-y-4">
              <h1 className="text-3xl">System Settings</h1>
              <p className="text-gray-600">Configure system settings</p>
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Settings will be displayed here</p>
              </div>
            </div>
          )}
        </DashboardLayout>
      );
    }

    // Default fallback
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <>
      {renderContent()}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStoreProvider>
        <AppContent />
        <ConfigStatus />
      </AppStoreProvider>
    </AuthProvider>
  );
}
