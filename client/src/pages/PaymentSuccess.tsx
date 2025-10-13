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
    // Clear the stored data after showing success
    return () => {
      localStorage.removeItem('consultationData');
      localStorage.removeItem('signupData');
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

                  {consultationData.doctor && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium" data-testid="text-doctor">{consultationData.doctor}</p>
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
                  <p>You'll receive a confirmation email shortly with all the details. Please sign in to access your dashboard and track your progress through our 5-stage wellness journey.</p>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/auth/login')}
                  data-testid="button-go-to-dashboard"
                >
                  Sign In to View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
