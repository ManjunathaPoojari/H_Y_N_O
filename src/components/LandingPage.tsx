import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Activity, Calendar, Heart, Pill, Apple, Dumbbell, Shield, Users, Clock, 
  ArrowRight, Sparkles, Award, CheckCircle, Star, Video, MessageSquare, 
  MapPin, Hospital, ChevronUp, UserCheck, TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

// Smooth counter hook
function useCountTo(target: number, duration = 1200, start = 0, trigger = true) {
  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!trigger) return () => {};
    const startTime = performance.now();
    const diff = target - start;
    
    function step(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easing out cubic
      setValue(Math.round(start + diff * eased));
      if (t < 1 && rafRef.current !== null) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, start, trigger]);
  
  return value;
}

// Floating shapes for hero
const FloatingShapes = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  return (
    <>
      <motion.div
        style={{ transform: `translate(${mouseX * -10}px, ${mouseY * -6}px)` }}
        className="absolute -left-16 -top-24 w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-400 opacity-20 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ transform: `translate(${mouseX * 8}px, ${mouseY * 10}px)` }}
        className="absolute right-10 top-36 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-300 opacity-16 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ transform: `translate(${mouseX * -4}px, ${mouseY * 16}px)` }}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 w-60 h-60 rounded-full bg-gradient-to-br from-emerald-200 to-indigo-200 opacity-10 blur-2xl pointer-events-none"
      />
    </>
  );
};

// Doctor Card with 3D Flip
const DoctorCard = ({ doctor, onBook }: { doctor: any; onBook: () => void }) => {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-80 transition-all duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-white p-6 shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
              {doctor.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg">{doctor.name}</h4>
              <div className="text-sm text-slate-500">{doctor.specialty}</div>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">
            10+ years experience • MBBS, MD
          </p>
          
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-full text-sm text-indigo-700">
              <Star className="h-4 w-4 fill-current" />
              4.8
            </div>
            <div className="flex gap-2">
              <Button onClick={onBook} size="sm" className="bg-gradient-to-r from-teal-500 to-indigo-600">
                Book
              </Button>
              <Button onClick={() => setFlipped(true)} size="sm" variant="outline">
                Details
              </Button>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 shadow-xl"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg">{doctor.name}</h4>
              <div className="text-sm text-slate-500">{doctor.specialty}</div>
            </div>
            <Button onClick={() => setFlipped(false)} variant="ghost" size="sm">
              Back
            </Button>
          </div>
          
          <p className="text-sm text-slate-600 mb-3">
            Specializes in patient-centered care, clinical diagnosis, and follow-up plans.
          </p>
          
          <ul className="text-sm text-slate-600 space-y-1 mb-4">
            <li>• Clinic: Mon - Sat, 9AM - 1PM</li>
            <li>• Video Consult: Daily 3PM - 8PM</li>
            <li>• Languages: English, Hindi</li>
          </ul>
          
          <Button onClick={onBook} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            Book Appointment
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Scroll to Top Button
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  if (!visible) return null;
  
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-all"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Mouse parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    symptoms: '',
    preferredDoctor: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [newsletter, setNewsletter] = useState('');

  // Intersection observer for stats
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  const doctors = [
    { name: 'Dr. Akshay Hiremath', specialty: 'General Physician' },
    { name: 'Dr. Sanjana Reddy', specialty: 'Gynecologist' },
    { name: 'Dr. Madhu M', specialty: 'Dermatologist' },
    { name: 'Dr. Abhishek Patil', specialty: 'Pediatrician' },
    { name: 'Dr. Rakshatha S', specialty: 'Neurologist' },
    { name: 'Dr. Priya Sharma', specialty: 'Psychiatrist' },
  ];

  const services = [
    { title: 'Book Consults', icon: Heart, desc: 'Verified doctors & fast booking' },
    { title: 'Wellness Plans', icon: Dumbbell, desc: 'Personalized fitness & diet' },
    { title: 'Nutrition', icon: Apple, desc: 'Diet plans & counseling' },
    { title: 'Pharmacy', icon: Pill, desc: 'Fast medicine delivery' },
  ];

  const testimonials = [
    { name: 'John Doe', text: 'Easy booking, reliable doctors.', rating: 5 },
    { name: 'Jane Smith', text: 'Good follow-up & teleconsult.', rating: 5 },
    { name: 'Mike Johnson', text: 'Pharmacy delivered quickly.', rating: 4 },
  ];

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill your name and email.');
      return;
    }
    alert('Appointment requested — we\'ll contact you soon!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      symptoms: '',
      preferredDoctor: '',
      appointmentDate: '',
      appointmentTime: '',
    });
  };

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletter) return;
    alert('Successfully subscribed! Check your email for a welcome message.');
    setNewsletter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 antialiased">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <FloatingShapes mouseX={mouse.x} mouseY={mouse.y} />

        {/* Logo */}
        <div className="flex justify-center pt-12 mb-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl">
              <Activity className="h-32 w-32 text-white" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50 backdrop-blur-sm mb-6">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">Trusted Healthcare • 24/7 Support</span>
              </div>

              <h1 className="text-5xl md:text-6xl leading-tight mb-6">
                Care that fits your life —{' '}
                <span className="bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  easy, instant, trusted.
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
                Book in-clinic & video consultations, follow personalized wellness plans, 
                and get medicines delivered — all from HYNO.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  onClick={() => onNavigate('/login')}
                  size="lg"
                  className="px-8 py-6 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105"
                >
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => onNavigate('/login')}
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300"
                >
                  Explore Services
                </Button>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                  <Users className="h-6 w-6 text-teal-500" />
                  <div>
                    <div className="text-xs text-slate-500">Trusted by</div>
                    <div className="font-semibold">10,000+ patients</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                  <UserCheck className="h-6 w-6 text-indigo-500" />
                  <div>
                    <div className="text-xs text-slate-500">Verified</div>
                    <div className="font-semibold">500+ doctors</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              style={{
                transform: `translateY(${mouse.y * -8}px) translateX(${mouse.x * 8}px)`,
              }}
            >
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Instant Care</div>
                      <CardTitle>Video & Clinic Appointments</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Next available</div>
                      <div className="text-sm">Dr. Akshay</div>
                      <div className="text-xs text-blue-600">Today 4:30 PM</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Pharmacy</div>
                      <div className="text-sm">Delivery</div>
                      <div className="text-xs text-green-600">In 2 hours</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => onNavigate('/login')} className="flex-1 bg-gradient-to-r from-teal-500 to-indigo-600">
                      Book Now
                    </Button>
                    <Button onClick={() => onNavigate('/login')} variant="outline" className="flex-1">
                      See Doctors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="-mt-8">
          <svg viewBox="0 0 1440 80" className="w-full h-20">
            <path fill="#f8fafc" d="M0,0 C300,80 1140,-40 1440,40 L1440,80 L0,80 Z"></path>
          </svg>
        </div>

        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 opacity-10 -z-10"
          animate={{
            background: [
              'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
              'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </header>

      {/* SERVICES */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent"
            >
              Our Services
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-center text-slate-600 max-w-2xl mx-auto text-lg mb-12"
            >
              Complete healthcare solutions for the whole family.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                    <CardContent className="pt-8">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <service.icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl mb-2">{service.title}</h4>
                      <p className="text-sm text-slate-600">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROMOTIONAL OFFERS */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 mb-4">
              <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
              <span className="text-sm text-amber-700">Limited Time Offers</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Special Offers & Promotions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Take advantage of our limited-time offers to get the best healthcare at affordable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Free First Consultation', desc: 'Get your first video consultation absolutely free!', emoji: '🎁', cta: 'Claim Now' },
              { title: '20% Off Wellness Plans', desc: 'Discount on personalized fitness and nutrition plans.', emoji: '💪', cta: 'Get Plan' },
              { title: 'Health Checkup Package', desc: 'Comprehensive health screening at special rates.', emoji: '💉', cta: 'Book Slot' },
              { title: 'Nutrition Consultation', desc: 'Expert diet advice from certified nutritionists.', emoji: '🥗', cta: 'Consult Now' },
            ].map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="pt-8">
                    <div className="text-5xl mb-4">{offer.emoji}</div>
                    <h4 className="text-lg mb-2">{offer.title}</h4>
                    <p className="text-sm text-slate-600 mb-6">{offer.desc}</p>
                    <Button 
                      onClick={() => onNavigate('/login')}
                      className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 group-hover:scale-105 transition-transform"
                    >
                      {offer.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: 10000, label: 'Happy Patients', cta: 'Join Us' },
              { icon: UserCheck, value: 500, label: 'Expert Doctors', cta: 'Meet Doctors' },
              { icon: Award, value: 50, label: 'Awards Won', cta: 'Learn More' },
              { icon: TrendingUp, value: 99, label: 'Success Rate %', cta: 'Book Now' },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="pt-8 text-center">
                  <stat.icon className="h-10 w-10 mx-auto mb-4" />
                  <div className="text-4xl mb-2">
                    {stat.label.includes('%') 
                      ? `${useCountTo(stat.value, 1400, 0, statsInView)}%`
                      : useCountTo(stat.value, 1400, 0, statsInView).toLocaleString()
                    }
                  </div>
                  <div className="text-sm opacity-90 mb-4">{stat.label}</div>
                  <Button 
                    onClick={() => onNavigate('/login')}
                    variant="outline"
                    size="sm"
                    className="border-white/40 text-white hover:bg-white/20"
                  >
                    {stat.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Meet Our Doctors
            </h3>
            <p className="text-slate-600 text-lg">
              Experienced professionals across specialties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <DoctorCard doctor={doc} onBook={() => onNavigate('/login')} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS + CONTACT */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testimonials */}
          <div>
            <h3 className="text-3xl mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              What patients say
            </h3>
            <p className="text-slate-600 mb-6">Real reviews from real users.</p>

            <div className="space-y-4">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="flex gap-1 mt-1">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700">{t.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader>
                <CardTitle>Request an Appointment</CardTitle>
                <p className="text-sm text-slate-600">Fill details and we'll contact you to confirm.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitContact} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    required
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                  <select
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <input
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Preferred Doctor (optional)"
                    value={formData.preferredDoctor}
                    onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                  />
                  <input
                    type="date"
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                  <input
                    type="time"
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  />
                  <textarea
                    className="p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all sm:col-span-2"
                    rows={3}
                    placeholder="Describe symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <Button
                      type="submit"
                      className="w-full py-6 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 shadow-lg"
                    >
                      Request Appointment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-black text-slate-200 py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HYNO</span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm">
                HYNO — trusted healthcare at your fingertips. Book, consult, and get meds delivered with care.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors">About us</button></li>
                <li><button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4">Newsletter</h4>
              <form onSubmit={submitNewsletter} className="flex gap-2">
                <input
                  className="flex-1 p-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Your email"
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                />
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-3">
                © {new Date().getFullYear()} HYNO. All rights reserved.
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
          
          <div className="text-center text-sm text-slate-500">
            Built with ❤️ for better healthcare
          </div>
        </div>
      </footer>

      <ScrollToTop />

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};
