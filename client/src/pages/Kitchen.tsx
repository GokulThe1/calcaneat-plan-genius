import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Clock, CheckCircle2, Package } from 'lucide-react';
import type { Order } from '@shared/schema';
import { isUnauthorizedError } from '@/lib/authUtils';

export default function Kitchen() {
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

    if (!isLoading && user && user.role !== 'kitchen') {
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

  const isAuthorized = isAuthenticated && user && user.role === 'kitchen';

  const { data: pendingOrders, isLoading: loadingPending } = useQuery<Order[]>({
    queryKey: ['/api/kitchen/orders/pending'],
    enabled: isAuthorized,
  });

  const { data: preparingOrders, isLoading: loadingPreparing } = useQuery<Order[]>({
    queryKey: ['/api/kitchen/orders/preparing'],
    enabled: isAuthorized,
  });

  const { data: readyOrders, isLoading: loadingReady } = useQuery<Order[]>({
    queryKey: ['/api/kitchen/orders/ready'],
    enabled: isAuthorized,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest('PATCH', `/api/kitchen/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kitchen/orders/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kitchen/orders/preparing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/kitchen/orders/ready'] });
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

  if (isLoading || loadingPending || loadingPreparing || loadingReady || !isAuthorized) {
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
              order.status === 'pending' ? 'secondary' :
              order.status === 'preparing' ? 'default' :
              'outline'
            }
            data-testid={`order-status-${order.id}`}
          >
            {order.status}
          </Badge>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Delivery Address</p>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
        </div>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'preparing' })}
              disabled={updateOrderMutation.isPending}
              data-testid={`button-start-preparing-${order.id}`}
            >
              <ChefHat className="h-4 w-4 mr-2" />
              Start Preparing
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              size="sm"
              onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'ready' })}
              disabled={updateOrderMutation.isPending}
              data-testid={`button-mark-ready-${order.id}`}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Ready
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
          <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-kitchen-title">
            Kitchen Management
          </h1>
          <p className="text-muted-foreground">Manage meal preparation and orders</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2" data-testid="tab-pending">
              <Clock className="h-4 w-4" />
              Pending ({pendingOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="flex items-center gap-2" data-testid="tab-preparing">
              <ChefHat className="h-4 w-4" />
              Preparing ({preparingOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="ready" className="flex items-center gap-2" data-testid="tab-ready">
              <Package className="h-4 w-4" />
              Ready ({readyOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingOrders && pendingOrders.length > 0 ? (
              <div className="grid gap-4">
                {pendingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending orders</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4 mt-6">
            {preparingOrders && preparingOrders.length > 0 ? (
              <div className="grid gap-4">
                {preparingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders in preparation</p>
              </div>
            )}
          </TabsContent>

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
                <p className="text-muted-foreground">No ready orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
