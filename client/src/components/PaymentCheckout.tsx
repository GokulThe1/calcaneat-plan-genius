import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Your consultation has been booked!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={!stripe || !elements || isProcessing}
        data-testid="button-submit-payment"
      >
        {isProcessing ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  );
};

interface PaymentCheckoutProps {
  sessionId: string;
  onSuccess: () => void;
}

export function PaymentCheckout({ sessionId, onSuccess }: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', { 
          sessionId 
        }) as unknown as { clientSecret: string };
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [sessionId]);

  if (isLoading || !clientSecret) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-muted-foreground">Loading payment...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm onSuccess={onSuccess} />
        </Elements>
      </CardContent>
    </Card>
  );
}
