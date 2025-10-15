import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle2, Loader2 } from 'lucide-react';

type Plan = {
  id: string;
  listPrice: string;
  consultationFeeCredited: string;
  finalPayable: string;
  type: string;
};

export default function DummyPayment() {
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  // Fetch user's active plan
  const { data: plan, isLoading: isPlanLoading } = useQuery<Plan>({
    queryKey: ['/api/user/plan'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get stored data from localStorage
      const userId = localStorage.getItem('pendingUserId');
      const paymentSessionId = localStorage.getItem('pendingPaymentSessionId');

      if (!userId || !paymentSessionId) {
        throw new Error('Missing payment session data');
      }

      // Call backend to complete payment
      const response = await fetch('/api/payment/complete-dummy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          paymentSessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }

      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/payment-success');
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    }
  };

  const consultationData = JSON.parse(localStorage.getItem('consultationData') || '{}');
  const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/30 via-white to-blue-50/20">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-12 space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" data-testid="icon-success" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground">
                  Your consultation has been booked. Redirecting to your dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/30 via-white to-emerald-50/20">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    This is a test payment gateway. No real charges will be made.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="JOHN DOE"
                        value={cardData.name}
                        onChange={handleInputChange}
                        required
                        data-testid="input-card-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">Card Number</Label>
                      <Input
                        id="number"
                        name="number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardData.number}
                        onChange={handleInputChange}
                        required
                        data-testid="input-card-number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={handleInputChange}
                          required
                          data-testid="input-card-expiry"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          placeholder="123"
                          maxLength={3}
                          value={cardData.cvv}
                          onChange={handleInputChange}
                          required
                          data-testid="input-card-cvv"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Your payment is secure and encrypted. This is a demo gateway for testing.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing || isPlanLoading || !plan}
                      data-testid="button-pay-now"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </span>
                      ) : plan ? (
                        `Pay ₹${parseFloat(plan.finalPayable).toLocaleString('en-IN')}`
                      ) : (
                        'Loading...'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium" data-testid="text-plan-type">
                        {consultationData.planType || 'Clinical-Level Guided'}
                      </span>
                    </div>

                    {consultationData.doctorName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Doctor</span>
                        <span className="font-medium" data-testid="text-doctor">
                          {consultationData.doctorName}
                        </span>
                      </div>
                    )}

                    {consultationData.date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium" data-testid="text-date">
                          {consultationData.date}
                        </span>
                      </div>
                    )}

                    {consultationData.time && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium" data-testid="text-time">
                          {consultationData.time}
                        </span>
                      </div>
                    )}

                    {signupData.name && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Patient</span>
                        <span className="font-medium" data-testid="text-patient-name">
                          {signupData.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {plan ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Plan Price</span>
                          <span className="font-mono font-medium" data-testid="text-plan-price">
                            ₹{parseFloat(plan.listPrice).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600">Consultation Credit</span>
                          <span className="font-mono font-medium text-emerald-600" data-testid="text-consultation-credit">
                            -₹{parseFloat(plan.consultationFeeCredited).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Final Payable</span>
                            <span className="font-mono text-2xl font-bold" data-testid="text-final-payable">
                              ₹{parseFloat(plan.finalPayable).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
