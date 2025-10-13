import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Utensils, User, Download, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reports');

  const { data: reports } = useQuery({
    queryKey: ['/api/reports'],
    enabled: !!user,
  });

  const mockReports = [
    {
      id: '1',
      title: 'Lipid Profile',
      date: '2025-10-15',
      status: 'Normal Range ✅',
      fileUrl: '#',
    },
    {
      id: '2',
      title: 'Complete Blood Count',
      date: '2025-10-15',
      status: 'Normal Range ✅',
      fileUrl: '#',
    },
    {
      id: '3',
      title: 'Physician Notes',
      date: '2025-10-16',
      status: 'Diet Plan Feasible – Proceed to Nutrition Stage',
      fileUrl: '#',
    },
  ];

  const mockDietPlan = {
    title: 'Personalized 7-Day Meal Plan',
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 67,
    meals: [
      {
        day: 'Monday',
        breakfast: 'Greek Yogurt with Berries & Almonds',
        lunch: 'Grilled Chicken Salad with Quinoa',
        dinner: 'Baked Salmon with Steamed Vegetables',
      },
      {
        day: 'Tuesday',
        breakfast: 'Oatmeal with Banana & Chia Seeds',
        lunch: 'Lentil Soup with Whole Grain Bread',
        dinner: 'Turkey Meatballs with Zucchini Noodles',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gradient-to-b from-blue-50/30 via-white to-emerald-50/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.profileImageUrl || user?.characterImageUrl || undefined} />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-profile-name">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reports" className="flex items-center gap-2" data-testid="tab-reports">
                  <FileText className="h-4 w-4" />
                  My Reports
                </TabsTrigger>
                <TabsTrigger value="plan" className="flex items-center gap-2" data-testid="tab-plan">
                  <Utensils className="h-4 w-4" />
                  My Plan
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2" data-testid="tab-account">
                  <User className="h-4 w-4" />
                  Account Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lab Reports & Medical Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                        data-testid={`report-${report.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{report.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </span>
                              <span>{report.status}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-download-${report.id}`}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}

                    {mockReports.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No reports available yet</p>
                        <p className="text-sm">Your lab reports will appear here once processed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plan" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Diet Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-2xl font-bold">{mockDietPlan.calories}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">{mockDietPlan.protein}g</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">{mockDietPlan.carbs}g</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Fats</p>
                        <p className="text-2xl font-bold">{mockDietPlan.fats}g</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Weekly Meal Plan</h3>
                      {mockDietPlan.meals.map((day, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <h4 className="font-semibold">{day.day}</h4>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Breakfast</p>
                              <p>{day.breakfast}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Lunch</p>
                              <p>{day.lunch}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Dinner</p>
                              <p>{day.dinner}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full" data-testid="button-download-plan">
                      <Download className="mr-2 h-4 w-4" />
                      Download Complete Plan (PDF)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={user?.firstName || ''}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={user?.lastName || ''}
                          data-testid="input-last-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user?.email || ''}
                          disabled
                          data-testid="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          defaultValue={user?.phone || ''}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Character Avatar</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user?.characterImageUrl || user?.profileImageUrl || undefined} />
                          <AvatarFallback className="text-xl">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" data-testid="button-change-avatar">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1" data-testid="button-save-changes">
                        Save Changes
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-cancel">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
