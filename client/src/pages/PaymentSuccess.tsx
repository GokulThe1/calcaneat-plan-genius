import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, User, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  
  const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}');
  const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');

  useEffect(() => {
    // Auto-redirect to login after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/api/login';
    }, 3000);

    return () => {
      clearTimeout(timer);
      localStorage.removeItem('consultationData');
      localStorage.removeItem('signupData');
      localStorage.removeItem('pendingUserId');
      localStorage.removeItem('pendingPaymentSessionId');
      localStorage.removeItem('userEmail');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/30 via-white to-blue-50/20">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-8">
          <Card className="text-center">
            <CardContent className="p-12 space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-600" data-testid="icon-success" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold" data-testid="text-success-title">
                  Payment Successful!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your consultation has been booked successfully
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 space-y-4 text-left">
                <h3 className="font-semibold text-center mb-4">Booking Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Patient Name</p>
                      <p className="font-medium" data-testid="text-patient-name">{signupData.name}</p>
                    </div>
                  </div>

                  {consultationData.doctorName && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium" data-testid="text-doctor">{consultationData.doctorName}</p>
                      </div>
                    </div>
                  )}

                  {consultationData.date && consultationData.time && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Appointment</p>
                        <p className="font-medium" data-testid="text-appointment">
                          {consultationData.date} at {consultationData.time}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                  <p className="font-semibold mb-1">What's Next?</p>
                  <p>Redirecting you to sign in... You'll be able to access your dashboard and track your progress through our 5-stage wellness journey.</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Preparing your dashboard...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
