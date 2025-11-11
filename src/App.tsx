import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { AppProvider } from './lib/app-context';
import { AppStoreProvider } from './lib/app-store';
import { SearchProvider } from './lib/search-context';
import { NotificationProvider } from './lib/notification-context';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { DashboardLayout } from './components/DashboardLayout';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { BookAppointment } from './components/patient/BookAppointment';
import { MyAppointments } from './components/patient/MyAppointments';
import { PatientProfile } from './components/patient/PatientProfile';
import { PatientReports } from './components/patient/PatientReports';
import { OnlinePharmacy } from './components/patient/OnlinePharmacy';
import { NutritionWellness } from './components/patient/NutritionWellness';
import { YogaFitness } from './components/patient/YogaFitness';
import { PatientMeetings } from './components/patient/PatientMeetings';
import { ChatInterface } from './components/common/ChatInterface';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorProfile } from './components/doctor/DoctorProfile';
import { DoctorAppointments } from './components/doctor/DoctorAppointments';
import { DoctorPatients } from './components/doctor/DoctorPatients';
import { DoctorSchedule } from './components/doctor/DoctorSchedule';
import { DoctorMeetings } from './components/doctor/DoctorMeetings';
import { VideoCall } from './components/doctor/VideoCall';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { HospitalProfile } from './components/hospital/HospitalProfile';
import { HospitalDoctors } from './components/hospital/HospitalDoctors';
import { HospitalAppointments } from './components/hospital/HospitalAppointments';
import { HospitalPatients } from './components/hospital/HospitalPatients';
import { HospitalReports } from './components/hospital/HospitalReports';
import { HospitalEmergency } from './components/hospital/HospitalEmergency';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPatients } from './components/admin/AdminPatients';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminEmergency } from './components/admin/AdminEmergency';
import { HospitalManagement } from './components/admin/HospitalManagement';
import { DoctorManagement } from './components/admin/DoctorManagement';
import { AdminPharmacy } from './components/admin/AdminPharmacy';
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { ConfigStatus } from './components/ConfigStatus';
import { AboutUs } from './components/AboutUs';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent } from './components/ui/card';
import { Video, MessageSquare, MapPin, Building2 } from 'lucide-react';

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

    if (currentPath === '/doctor-dashboard') {
      if (!isAuthenticated) {
        return <LoginPage onNavigate={navigate} role="doctor" />;
      }
      // If authenticated, continue to doctor routes below
    }

    if (currentPath === '/hospital-login') {
      return <LoginPage onNavigate={navigate} role="hospital" />;
    }

    if (currentPath === '/trainer-login') {
      return <LoginPage onNavigate={navigate} role="trainer" />;
    }

    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }

    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }

    if (currentPath === '/reset-password') {
      return <ResetPasswordPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutUs />;
    }

    if (currentPath === '/terms') {
      return <TermsOfService />;
    }

    if (currentPath === '/privacy') {
      return <PrivacyPolicy />;
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
          {currentPath === '/patient/book' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl mb-2">Book Appointment</h1>
                <p className="text-gray-600">Choose your preferred consultation type</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/patient/book/video')}>
                  <CardContent className="p-6 text-center">
                    <Video className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Video Consultation</h3>
                    <p className="text-gray-600 text-sm">Connect with doctor via video call</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/patient/book/chat')}>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <h3 className="text-lg font-semibold mb-2">Chat Consultation</h3>
                    <p className="text-gray-600 text-sm">Text-based consultation with doctor</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/patient/book/inperson')}>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                    <h3 className="text-lg font-semibold mb-2">In-Person Visit</h3>
                    <p className="text-gray-600 text-sm">Visit doctor at clinic/hospital</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/patient/book/hospital')}>
                  <CardContent className="p-6 text-center">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="text-lg font-semibold mb-2">Hospital Appointment</h3>
                    <p className="text-gray-600 text-sm">Book hospital-based consultation</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {currentPath === '/patient/book/video' && <BookAppointment type="video" />}
          {currentPath === '/patient/book/chat' && <BookAppointment type="chat" />}
          {currentPath === '/patient/book/inperson' && <BookAppointment type="inperson" />}
          {currentPath === '/patient/book/hospital' && <BookAppointment type="hospital" />}
          {currentPath === '/patient/appointments' && <MyAppointments />}
          {currentPath === '/patient/chat' && <ChatInterface />}
          {currentPath === '/patient/meetings' && <PatientMeetings />}
          {currentPath === '/video-call' && (
            <ErrorBoundary>
              <VideoCall
                appointmentId={new URLSearchParams(window.location.search).get('appointmentId') || undefined}
                patientId={user?.id}
              />
            </ErrorBoundary>
          )}
          {currentPath === '/patient/reports' && <PatientReports />}
          {currentPath === '/patient/pharmacy' && <OnlinePharmacy />}
          {currentPath === '/patient/nutrition' && <NutritionWellness onNavigate={navigate} />}
          {currentPath === '/patient/yoga' && <YogaFitness onNavigate={navigate} />}
          {currentPath === '/my-profile' && <PatientProfile />}
        </DashboardLayout>
      );
    }

    // Doctor routes
    if (user?.role === 'doctor') {
      return (
        <DashboardLayout role="doctor" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/doctor-dashboard' && <DoctorDashboard />}
          {currentPath === '/doctor/appointments' && <DoctorAppointments />}
          {currentPath === '/doctor/patients' && <DoctorPatients />}
          {currentPath === '/doctor/schedule' && <DoctorSchedule />}
          {currentPath === '/doctor/chat' && <ChatInterface />}
          {currentPath === '/doctor/meetings' && <DoctorMeetings onNavigate={navigate} />}
          {currentPath === '/video-call' && (
            <ErrorBoundary>
              <VideoCall
                appointmentId={new URLSearchParams(window.location.search).get('appointmentId') || undefined}
                patientId={new URLSearchParams(window.location.search).get('patientId') || undefined}
              />
            </ErrorBoundary>
          )}
          {currentPath === '/doctor/video-call' && (
            <ErrorBoundary>
              <VideoCall
                appointmentId={new URLSearchParams(window.location.search).get('appointmentId') || undefined}
                patientId={new URLSearchParams(window.location.search).get('patientId') || undefined}
              />
            </ErrorBoundary>
          )}
          {currentPath === '/doctor/profile' && <DoctorProfile />}
        </DashboardLayout>
      );
    }

    // Hospital routes
    if (user?.role === 'hospital') {
      return (
        <DashboardLayout role="hospital" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/hospital-dashboard' && <HospitalDashboard onNavigate={navigate} />}
          {currentPath === '/hospital/doctors' && <HospitalDoctors />}
          {currentPath === '/hospital/appointments' && <HospitalAppointments />}
          {currentPath === '/hospital/patients' && <HospitalPatients />}
          {currentPath === '/hospital/emergency' && <HospitalEmergency />}
          {currentPath === '/hospital/reports' && <HospitalReports />}
          {currentPath === '/hospital/profile' && <HospitalProfile />}
        </DashboardLayout>
      );
    }

    // Trainer routes
    if (user?.role === 'trainer') {
      return (
        <DashboardLayout role="trainer" onNavigate={navigate} currentPath={currentPath}>
          {currentPath === '/trainer-dashboard' && <TrainerDashboard onNavigate={navigate} />}
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
          {currentPath === '/admin/patients' && <AdminPatients />}
          {currentPath === '/admin/appointments' && <AdminAppointments />}
          {currentPath === '/admin/pharmacy' && <AdminPharmacy />}
          {currentPath === '/admin/emergency' && <AdminEmergency />}
          {currentPath === '/admin/reports' && <AdminReports />}
          {currentPath === '/admin/settings' && <AdminSettings />}
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
    <ErrorBoundary>
      <AuthProvider>
        <AppStoreProvider>
          <SearchProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </SearchProvider>
        </AppStoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
