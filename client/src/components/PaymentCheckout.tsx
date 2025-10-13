import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentCheckoutProps {
  sessionId: string;
  onSuccess: () => void;
}

export function PaymentCheckout({ sessionId, onSuccess }: PaymentCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-razorpay-order', { 
          sessionId 
        }) as unknown as { orderId: string; amount: number; currency: string; keyId: string };
        setOrderData(response);
      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    createOrder();
  }, [sessionId, toast]);

  const handlePayment = () => {
    if (!orderData) return;

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Premium Meal Delivery",
      description: "Clinical Plan Consultation Fee",
      order_id: orderData.orderId,
      handler: async function (response: any) {
        try {
          await apiRequest('POST', '/api/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            sessionId,
          });
          
          toast({
            title: "Payment Successful",
            description: "Your consultation has been booked!",
          });
          onSuccess();
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast({
            title: "Verification Failed",
            description: "Payment verification failed. Please contact support.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#10b981",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response: any) {
      toast({
        title: "Payment Failed",
        description: response.error.description || "Payment failed. Please try again.",
        variant: "destructive",
      });
    });
    razorpay.open();
  };

  if (isLoading) {
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
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">You will be redirected to Razorpay's secure payment gateway</p>
          </div>
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handlePayment}
            disabled={!orderData}
            data-testid="button-submit-payment"
          >
            Pay ₹5,000
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
