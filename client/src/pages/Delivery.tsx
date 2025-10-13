import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, CheckCircle2, Package } from 'lucide-react';
import type { Order } from '@shared/schema';
import { isUnauthorizedError } from '@/lib/authUtils';

export default function Delivery() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && user && user.role !== 'delivery') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const isAuthorized = isAuthenticated && user && user.role === 'delivery';

  const { data: readyOrders, isLoading: loadingReady } = useQuery<Order[]>({
    queryKey: ['/api/delivery/orders/ready'],
    enabled: isAuthorized,
  });

  const { data: outForDeliveryOrders, isLoading: loadingOutForDelivery } = useQuery<Order[]>({
    queryKey: ['/api/delivery/orders/out_for_delivery'],
    enabled: isAuthorized,
  });

  const { data: deliveredOrders, isLoading: loadingDelivered } = useQuery<Order[]>({
    queryKey: ['/api/delivery/orders/delivered'],
    enabled: isAuthorized,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest('PATCH', `/api/delivery/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/delivery/orders/ready'] });
      queryClient.invalidateQueries({ queryKey: ['/api/delivery/orders/out_for_delivery'] });
      queryClient.invalidateQueries({ queryKey: ['/api/delivery/orders/delivered'] });
      toast({
        title: "Success",
        description: "Order status updated",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  if (isLoading || loadingReady || loadingOutForDelivery || loadingDelivered || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover-elevate" data-testid={`order-card-${order.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold mb-1" data-testid={`order-id-${order.id}`}>
              Order #{order.id.slice(0, 8)}
            </p>
            <p className="text-sm text-muted-foreground">
              Delivery: {new Date(order.deliveryDate!).toLocaleDateString()}
            </p>
          </div>
          <Badge
            variant={
              order.status === 'ready' ? 'secondary' :
              order.status === 'out_for_delivery' ? 'default' :
              'outline'
            }
            data-testid={`order-status-${order.id}`}
          >
            {order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status}
          </Badge>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Address
          </p>
          <p className="text-sm text-muted-foreground pl-6">{order.deliveryAddress}</p>
        </div>

        <div className="flex gap-2">
          {order.status === 'ready' && (
            <Button
              size="sm"
              onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'out_for_delivery' })}
              disabled={updateOrderMutation.isPending}
              data-testid={`button-pick-up-${order.id}`}
            >
              <Truck className="h-4 w-4 mr-2" />
              Pick Up Order
            </Button>
          )}
          {order.status === 'out_for_delivery' && (
            <Button
              size="sm"
              onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'delivered' })}
              disabled={updateOrderMutation.isPending}
              data-testid={`button-mark-delivered-${order.id}`}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-delivery-title">
            Delivery Management
          </h1>
          <p className="text-muted-foreground">Track and manage order deliveries</p>
        </div>

        <Tabs defaultValue="ready" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ready" className="flex items-center gap-2" data-testid="tab-ready">
              <Package className="h-4 w-4" />
              Ready ({readyOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="out_for_delivery" className="flex items-center gap-2" data-testid="tab-out-for-delivery">
              <Truck className="h-4 w-4" />
              Out for Delivery ({outForDeliveryOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center gap-2" data-testid="tab-delivered">
              <CheckCircle2 className="h-4 w-4" />
              Delivered ({deliveredOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ready" className="space-y-4 mt-6">
            {readyOrders && readyOrders.length > 0 ? (
              <div className="grid gap-4">
                {readyOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders ready for pickup</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="out_for_delivery" className="space-y-4 mt-6">
            {outForDeliveryOrders && outForDeliveryOrders.length > 0 ? (
              <div className="grid gap-4">
                {outForDeliveryOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders out for delivery</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4 mt-6">
            {deliveredOrders && deliveredOrders.length > 0 ? (
              <div className="grid gap-4">
                {deliveredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No delivered orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
