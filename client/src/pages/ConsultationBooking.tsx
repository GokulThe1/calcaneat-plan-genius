import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { BookingCalendar } from '@/components/BookingCalendar';
import { CharacterCreation } from '@/components/CharacterCreation';
import { PaymentCheckout } from '@/components/PaymentCheckout';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { PaymentSession } from '@shared/schema';

type Step = 'auth-check' | 'booking' | 'character' | 'payment' | 'complete';

export default function ConsultationBooking() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('auth-check');
  const [consultationDate, setConsultationDate] = useState<Date | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentStep('booking');
      } else {
        setCurrentStep('auth-check');
      }
    }
  }, [isLoading, isAuthenticated]);

  const createSessionMutation = useMutation({
    mutationFn: async (data: { consultationDate: Date }) => {
      const response = await apiRequest('POST', '/api/payment-sessions', {
        consultationDate: data.consultationDate.toISOString(),
        planType: 'clinical',
      }) as unknown as PaymentSession;
      return response;
    },
    onSuccess: (data: PaymentSession) => {
      setSessionId(data.id);
      setCurrentStep('character');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create booking session',
        variant: 'destructive',
      });
    },
  });

  const updateCharacterMutation = useMutation({
    mutationFn: async (data: { characterImageUrl?: string; characterType?: string }) => {
      await apiRequest('PATCH', '/api/user/character', data);
    },
    onSuccess: () => {
      setCurrentStep('payment');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save character',
        variant: 'destructive',
      });
    },
  });

  const handleDateSelect = (date: Date) => {
    setConsultationDate(date);
  };

  const handleBookingConfirm = () => {
    if (!consultationDate) {
      toast({
        title: 'Please select a date',
        description: 'Choose a consultation date to continue',
        variant: 'destructive',
      });
      return;
    }
    createSessionMutation.mutate({ consultationDate });
  };

  const handleCharacterComplete = (characterData: { characterImageUrl?: string; characterType?: string }) => {
    updateCharacterMutation.mutate(characterData);
  };

  const handleCharacterSkip = () => {
    setCurrentStep('payment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'auth-check') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 space-y-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold" data-testid="text-auth-required-title">
                  Sign In Required
                </h2>
                <p className="text-muted-foreground" data-testid="text-auth-required-subtitle">
                  Please sign in to book your consultation and save your details
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/auth/login')}
                  data-testid="button-sign-in"
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'booking') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <Badge className="bg-chart-4 text-white border-0" data-testid="badge-step-booking">
                  Step 1 of 3
                </Badge>
                <h1 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-booking-title">
                  Select Your Consultation Date
                </h1>
                <p className="text-lg text-muted-foreground" data-testid="text-booking-subtitle">
                  Choose a convenient time for your physician consultation
                </p>
              </div>

              <BookingCalendar onDateSelect={handleDateSelect} />

              {consultationDate && (
                <Card className="border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Date</p>
                        <p className="font-semibold" data-testid="text-selected-date">
                          {consultationDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        size="lg"
                        onClick={handleBookingConfirm}
                        disabled={createSessionMutation.isPending}
                        data-testid="button-confirm-booking"
                      >
                        {createSessionMutation.isPending ? 'Processing...' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'character') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <Badge className="bg-chart-4 text-white border-0" data-testid="badge-step-character">
                  Step 2 of 3
                </Badge>
              </div>
              <CharacterCreation
                onComplete={handleCharacterComplete}
                onSkip={handleCharacterSkip}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <Badge className="bg-chart-4 text-white border-0" data-testid="badge-step-payment">
                  Step 3 of 3
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-semibold" data-testid="text-payment-title">
                  Complete Payment
                </h2>
                <p className="text-muted-foreground" data-testid="text-payment-subtitle">
                  Secure your consultation booking
                </p>
              </div>

              <div className="p-6 bg-muted/50 rounded-md text-center">
                <p className="font-mono text-3xl font-semibold" data-testid="text-payment-amount">₹5,000</p>
                <p className="text-sm text-muted-foreground mt-1">Initial Consultation Fee</p>
              </div>

              {sessionId && (
                <PaymentCheckout
                  sessionId={sessionId}
                  onSuccess={() => {
                    toast({
                      title: 'Payment Successful',
                      description: 'Your consultation has been booked!',
                    });
                    navigate('/dashboard');
                  }}
                />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}
