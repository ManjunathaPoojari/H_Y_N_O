import { Card, CardContent } from '../ui/card';
import { Video, MessageSquare, MapPin, Building2 } from 'lucide-react';

interface BookAppointmentSelectionProps {
  onNavigate: (path: string) => void;
}

export const BookAppointmentSelection: React.FC<BookAppointmentSelectionProps> = ({ onNavigate }) => {
  const consultationTypes = [
    {
      id: 'video',
      title: 'Video Consultation',
      description: 'Connect with doctor via video call',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/patient/book/video'
    },
    {
      id: 'chat',
      title: 'Chat Consultation',
      description: 'Text-based consultation with doctor',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/patient/book/chat'
    },
    {
      id: 'inperson',
      title: 'In-Person Visit',
      description: 'Visit doctor at clinic/hospital',
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/patient/book/inperson'
    },
    {
      id: 'hospital',
      title: 'Hospital Appointment',
      description: 'Book hospital-based consultation',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/patient/book/hospital'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-gray-600">Choose your preferred consultation type</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {consultationTypes.map((type) => (
          <Card
            key={type.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-sm"
            onClick={() => onNavigate(type.path)}
          >
            <CardContent className="p-8 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${type.bgColor} mb-4`}>
                <type.icon className={`h-8 w-8 ${type.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Need help choosing? <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Learn more about consultation types</span>
        </p>
      </div>
    </div>
  );
};
