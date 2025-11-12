import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, Shield, AlertTriangle, Mail } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our healthcare management system.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By accessing and using HYNO Healthcare Management System, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                2. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                3. Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                HYNO provides healthcare management services including appointment booking, telemedicine consultations, and health record management. Services are subject to availability and may change without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-indigo-600" />
                4. Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                5. Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                6. Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                The information on this service is provided on an 'as is' basis. To the fullest extent permitted by law, HYNO excludes all liability for damages arising out of or in connection with your use of this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-600" />
                7. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at support@hynohealth.com.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
