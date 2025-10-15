import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChefHat, Clock, CheckCircle, Calendar } from "lucide-react";

type Customer = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type Plan = {
  id: number;
  userId: string;
  planType: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
};

type DietPlan = {
  id: number;
  userId: string;
  macros: string | null;
  weeklyPlan: string | null;
};

type Address = {
  id: number;
  userId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
};

type ActivePlan = {
  customer: Customer;
  plan: Plan | null;
  addresses: Address[];
  dietPlan: DietPlan | null;
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

export default function ChefPanel() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<ActivePlan | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  // Fetch active plans
  const { data: activePlans = [], isLoading: loadingPlans } = useQuery<ActivePlan[]>({
    queryKey: ['/api/chef/active-plans']
  });

  // Fetch my preparation activity
  const { data: myActivity = [] } = useQuery<StaffActivity[]>({
    queryKey: ['/api/activity/staff']
  });

  // Mark meal as prepared mutation
  const markPreparedMutation = useMutation({
    mutationFn: async (data: { userId: string; mealType: string; date: string }) => {
      return apiRequest('POST', '/api/chef/mark-prepared', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activity/staff'] });
      toast({
        title: "Success",
        description: `${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} marked as prepared`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark meal as prepared",
        variant: "destructive"
      });
    }
  });

  const handleMarkPrepared = () => {
    if (!selectedPlan?.customer) return;
    
    markPreparedMutation.mutate({
      userId: selectedPlan.customer.id,
      mealType: selectedMealType,
      date: selectedDate
    });
  };

  const getMealPreparations = () => {
    return myActivity.filter(a => a.actionType === 'meal_prepared');
  };

  const getTodayPreparations = () => {
    const today = new Date().toISOString().split('T')[0];
    return getMealPreparations().filter(a => {
      const metadata = a.metadata as { date?: string };
      return metadata.date === today;
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ChefHat className="h-8 w-8" />
              Chef Panel
            </h1>
            <p className="text-muted-foreground">Prepare meals for active diet plans</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2" data-testid="badge-role">
            Chef
          </Badge>
        </div>

        <Card className="border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Today's Preparations ({getTodayPreparations().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getTodayPreparations().length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No meals prepared today yet</p>
            ) : (
              <div className="space-y-2">
                {getTodayPreparations().map(prep => {
                  const metadata = prep.metadata as { mealType?: string; date?: string };
                  return (
                    <div key={prep.id} className="flex items-center justify-between p-2 bg-muted rounded-md" data-testid={`prep-${prep.id}`}>
                      <div>
                        <p className="font-medium capitalize">{metadata.mealType}</p>
                        <p className="text-sm text-muted-foreground">Customer: {prep.customerId}</p>
                      </div>
                      <Badge variant="default">Prepared</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Plans List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Plans ({activePlans.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPlans ? (
                <div className="flex items-center justify-center py-8">
                  <Clock className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {activePlans.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No active plans</p>
                  ) : (
                    activePlans.map((plan) => (
                      <button
                        key={plan.customer.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedPlan?.customer.id === plan.customer.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover-elevate active-elevate-2'
                        }`}
                        data-testid={`button-plan-${plan.customer.id}`}
                      >
                        <p className="font-medium">{plan.customer.name || 'Unnamed'}</p>
                        <p className="text-sm opacity-80">{plan.plan?.planType || 'No plan type'}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Details & Preparation */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedPlan ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select an active plan to prepare meals</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="diet" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="diet" data-testid="tab-diet">Diet Plan</TabsTrigger>
                  <TabsTrigger value="prepare" data-testid="tab-prepare">Prepare Meal</TabsTrigger>
                  <TabsTrigger value="history" data-testid="tab-history">Preparation History</TabsTrigger>
                </TabsList>

                <TabsContent value="diet" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg font-medium" data-testid="text-customer-name">{selectedPlan.customer.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg" data-testid="text-customer-email">{selectedPlan.customer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Plan Type</label>
                        <Badge variant="outline" className="text-base" data-testid="text-plan-type">{selectedPlan.plan?.planType || 'Unknown'}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedPlan.dietPlan && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Diet Plan Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedPlan.dietPlan.macros && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Macros</label>
                            <p className="mt-1 whitespace-pre-wrap" data-testid="text-macros">{selectedPlan.dietPlan.macros}</p>
                          </div>
                        )}
                        {selectedPlan.dietPlan.weeklyPlan && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Weekly Plan</label>
                            <p className="mt-1 whitespace-pre-wrap" data-testid="text-weekly-plan">{selectedPlan.dietPlan.weeklyPlan}</p>
                          </div>
                        )}
                        {!selectedPlan.dietPlan.macros && !selectedPlan.dietPlan.weeklyPlan && (
                          <p className="text-center text-muted-foreground">No diet plan details available</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {selectedPlan.addresses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Delivery Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPlan.addresses.map(addr => (
                            <div key={addr.id} className="p-3 bg-muted rounded-md" data-testid={`address-${addr.id}`}>
                              <p className="font-medium">{addr.addressLine1}</p>
                              {addr.addressLine2 && <p className="text-sm">{addr.addressLine2}</p>}
                              <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="prepare" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mark Meal as Prepared</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            data-testid="input-date"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Meal Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => (
                            <button
                              key={mealType}
                              onClick={() => setSelectedMealType(mealType)}
                              className={`p-3 rounded-md capitalize transition-colors ${
                                selectedMealType === mealType
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover-elevate active-elevate-2'
                              }`}
                              data-testid={`button-meal-${mealType}`}
                            >
                              {mealType}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={handleMarkPrepared}
                        disabled={markPreparedMutation.isPending}
                        className="w-full"
                        size="lg"
                        data-testid="button-mark-prepared"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Prepared
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Preparations ({getMealPreparations().length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getMealPreparations().length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No preparation history</p>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {getMealPreparations().map(prep => {
                            const metadata = prep.metadata as { mealType?: string; date?: string };
                            return (
                              <div key={prep.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`history-${prep.id}`}>
                                <div>
                                  <p className="font-medium capitalize">{metadata.mealType}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {metadata.date} - {new Date(prep.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <Badge variant="default">Prepared</Badge>
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
