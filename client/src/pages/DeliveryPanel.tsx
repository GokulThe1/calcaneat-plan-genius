import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Truck, MapPin, Package, CheckCircle, Navigation } from "lucide-react";

type Order = {
  id: number;
  userId: string;
  status: string;
  totalAmount: number;
  deliveryDate: Date;
  assignedDeliveryPersonId: string | null;
  createdAt: Date;
};

type StaffActivity = {
  id: number;
  staffId: string;
  customerId: string;
  actionType: string;
  stage: number | null;
  description: string;
  metadata: any;
  createdAt: Date;
};

type DeliveryLocation = {
  id: number;
  deliveryPersonId: string;
  latitude: number;
  longitude: number;
  status: string;
  updatedAt: Date;
};

export default function DeliveryPanel() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Fetch assigned deliveries
  const { data: assignedOrders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/delivery/assigned']
  });

  // Fetch delivery activity logs
  const { data: activityLogs = [] } = useQuery<StaffActivity[]>({
    queryKey: ['/api/activity/staff']
  });

  // Update delivery status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { orderId: number; status: string }) => {
      return apiRequest('PATCH', `/api/delivery/status/${data.orderId}`, { status: data.status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/delivery/assigned'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity/staff'] });
      toast({
        title: "Success",
        description: "Delivery status updated successfully"
      });
      
      // Only clear selection if delivered (order removed from active list)
      if (variables.status === 'delivered') {
        setSelectedOrder(null);
      } else {
        // Update selected order status locally for immediate UI feedback
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, status: variables.status });
        }
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive"
      });
    }
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async (data: { latitude: number; longitude: number; status?: string }) => {
      return apiRequest('POST', '/api/delivery/location', data);
    },
    onSuccess: () => {
      toast({
        title: "Location Updated",
        description: "Your GPS location has been updated"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive"
      });
    }
  });

  // GPS tracking effect
  useEffect(() => {
    let watchId: number | null = null;

    if (gpsEnabled && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(location);
          
          // Update location every 2 minutes
          updateLocationMutation.mutate({
            ...location,
            status: assignedOrders.length > 0 ? 'on_delivery' : 'on_duty'
          });
        },
        (error) => {
          console.error("GPS Error:", error);
          toast({
            title: "GPS Error",
            description: "Unable to access location. Please enable location services.",
            variant: "destructive"
          });
          setGpsEnabled(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 120000 // 2 minutes
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [gpsEnabled, assignedOrders.length]);

  const handleStatusUpdate = (status: string) => {
    if (!selectedOrder) return;
    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      status
    });
  };

  const getDeliveryLogs = () => {
    return activityLogs.filter(log => log.actionType === 'delivery_completed');
  };

  const getTodayDeliveries = () => {
    const today = new Date().toISOString().split('T')[0];
    return getDeliveryLogs().filter(log => {
      const logDate = new Date(log.createdAt).toISOString().split('T')[0];
      return logDate === today;
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Truck className="h-8 w-8" />
              Delivery Panel
            </h1>
            <p className="text-muted-foreground">Manage deliveries and track locations</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2" data-testid="badge-role">
            Delivery
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-blue-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                Today's Deliveries ({getTodayDeliveries().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getTodayDeliveries().length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No deliveries completed today</p>
              ) : (
                <div className="space-y-2">
                  {getTodayDeliveries().map(log => {
                    const metadata = log.metadata as { orderId?: number; deliveredAt?: string };
                    return (
                      <div key={log.id} className="flex items-center justify-between p-2 bg-muted rounded-md" data-testid={`today-delivery-${log.id}`}>
                        <div>
                          <p className="font-medium">Order #{metadata.orderId}</p>
                          <p className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <Badge variant="default">Delivered</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={gpsEnabled ? "border-green-500/50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                GPS Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location Services</span>
                <Button
                  onClick={() => setGpsEnabled(!gpsEnabled)}
                  variant={gpsEnabled ? "default" : "outline"}
                  size="sm"
                  data-testid="button-gps-toggle"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {gpsEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              {gpsEnabled && currentLocation && (
                <div className="p-3 bg-muted rounded-md space-y-1" data-testid="gps-location">
                  <p className="text-sm font-medium">Current Location:</p>
                  <p className="text-xs text-muted-foreground">Lat: {currentLocation.latitude.toFixed(6)}</p>
                  <p className="text-xs text-muted-foreground">Lng: {currentLocation.longitude.toFixed(6)}</p>
                  <p className="text-xs text-green-600">Updates every 2 minutes</p>
                </div>
              )}
              
              {!gpsEnabled && (
                <p className="text-sm text-muted-foreground">Enable GPS to track your delivery location</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assigned Deliveries List */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Deliveries ({assignedOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <Package className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {assignedOrders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No deliveries assigned</p>
                  ) : (
                    assignedOrders.map(order => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedOrder?.id === order.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover-elevate active-elevate-2'
                        }`}
                        data-testid={`button-order-${order.id}`}
                      >
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm opacity-80">Amount: ${order.totalAmount}</p>
                        <Badge variant="outline" className="mt-1">{order.status}</Badge>
                      </button>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Actions & History */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedOrder ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a delivery to update status</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="update" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="update" data-testid="tab-update">Update Status</TabsTrigger>
                  <TabsTrigger value="history" data-testid="tab-history">Delivery History</TabsTrigger>
                </TabsList>

                <TabsContent value="update" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order #{selectedOrder.id}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                          <p className="text-lg font-mono" data-testid="text-customer-id">{selectedOrder.userId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Amount</label>
                          <p className="text-lg font-medium" data-testid="text-amount">${selectedOrder.totalAmount}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Badge variant="outline" className="text-base" data-testid="text-status">{selectedOrder.status}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
                          <p className="text-sm" data-testid="text-delivery-date">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <h3 className="font-medium">Update Delivery Status</h3>
                        
                        {selectedOrder.status === 'prepared' && (
                          <Button
                            onClick={() => handleStatusUpdate('in_transit')}
                            disabled={updateStatusMutation.isPending}
                            className="w-full"
                            data-testid="button-start-delivery"
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Start Delivery (In Transit)
                          </Button>
                        )}

                        {selectedOrder.status === 'in_transit' && (
                          <Button
                            onClick={() => handleStatusUpdate('delivered')}
                            disabled={updateStatusMutation.isPending}
                            className="w-full"
                            data-testid="button-mark-delivered"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </Button>
                        )}

                        {selectedOrder.status === 'delivered' && (
                          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                              ✓ This order has been delivered
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Deliveries ({getDeliveryLogs().length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getDeliveryLogs().length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No delivery history</p>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {getDeliveryLogs().map(log => {
                            const metadata = log.metadata as { orderId?: number; deliveredAt?: string };
                            return (
                              <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`history-${log.id}`}>
                                <div>
                                  <p className="font-medium">Order #{metadata.orderId}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(log.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <Badge variant="default">Delivered</Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
