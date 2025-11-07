import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Heart, Users, Shield, Clock } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Health Management System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionizing healthcare through technology, connecting patients, doctors, and hospitals in one seamless platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Patient-Centric Care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Empowering patients with easy access to healthcare services, appointments, and wellness resources.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <CardTitle>Connected Healthcare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Bridging the gap between patients, doctors, and hospitals for better coordination and care.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your health data is protected with industry-leading security measures and privacy standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <CardTitle>24/7 Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access healthcare services anytime, anywhere with our round-the-clock digital platform.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Our Health Management System is dedicated to transforming healthcare delivery by leveraging cutting-edge technology.
              We provide a comprehensive platform that enables seamless communication, efficient appointment scheduling,
              telemedicine consultations, and comprehensive health tracking. Our goal is to make quality healthcare accessible
              to everyone, regardless of location or time constraints.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Patients</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Online appointment booking</li>
                  <li>• Video and chat consultations</li>
                  <li>• Health records management</li>
                  <li>• Online pharmacy access</li>
                  <li>• Wellness and nutrition tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Healthcare Providers</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Patient management system</li>
                  <li>• Schedule optimization</li>
                  <li>• Telemedicine capabilities</li>
                  <li>• Emergency response coordination</li>
                  <li>• Comprehensive reporting tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
