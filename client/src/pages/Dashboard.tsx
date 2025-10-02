import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MealCard } from '@/components/MealCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingDown, Flame, Activity, CheckCircle2, Clock, Lock } from 'lucide-react';
import breakfastImage from '@assets/generated_images/Healthy_breakfast_bowl_640a6a89.png';
import lunchImage from '@assets/generated_images/Healthy_Buddha_bowl_lunch_368a96fc.png';
import dinnerImage from '@assets/generated_images/Grilled_chicken_dinner_plate_b60850a5.png';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const weeklyMeals = [
  {
    day: 'Monday',
    meals: [
      { name: 'Greek Yogurt Berry Bowl', image: breakfastImage, calories: 320, protein: 18, carbs: 42, fats: 8, mealType: 'breakfast' as const },
      { name: 'Buddha Bowl', image: lunchImage, calories: 485, protein: 32, carbs: 52, fats: 15, mealType: 'lunch' as const },
      { name: 'Grilled Chicken Plate', image: dinnerImage, calories: 425, protein: 38, carbs: 35, fats: 12, mealType: 'dinner' as const },
    ],
  },
  {
    day: 'Tuesday',
    meals: [
      { name: 'Oatmeal with Fruits', image: breakfastImage, calories: 310, protein: 12, carbs: 48, fats: 7, mealType: 'breakfast' as const },
      { name: 'Quinoa Salad Bowl', image: lunchImage, calories: 460, protein: 28, carbs: 55, fats: 14, mealType: 'lunch' as const },
      { name: 'Baked Salmon', image: dinnerImage, calories: 440, protein: 42, carbs: 30, fats: 15, mealType: 'dinner' as const },
    ],
  },
  {
    day: 'Wednesday',
    meals: [
      { name: 'Smoothie Bowl', image: breakfastImage, calories: 290, protein: 15, carbs: 40, fats: 9, mealType: 'breakfast' as const },
      { name: 'Chicken Wrap', image: lunchImage, calories: 510, protein: 35, carbs: 48, fats: 18, mealType: 'lunch' as const },
      { name: 'Stir Fry Vegetables', image: dinnerImage, calories: 380, protein: 22, carbs: 45, fats: 11, mealType: 'dinner' as const },
    ],
  },
];

const milestones = [
  { id: 1, name: 'Consultation', status: 'completed', icon: CheckCircle2, color: 'text-primary' },
  { id: 2, name: 'Test Collection', status: 'completed', icon: CheckCircle2, color: 'text-primary' },
  { id: 3, name: 'Diagnosis', status: 'in-progress', icon: Clock, color: 'text-chart-2' },
  { id: 4, name: 'Dietician Review', status: 'locked', icon: Lock, color: 'text-muted-foreground' },
  { id: 5, name: 'Diet Chart', status: 'locked', icon: Lock, color: 'text-muted-foreground' },
  { id: 6, name: 'Plan Activation', status: 'locked', icon: Lock, color: 'text-muted-foreground' },
];

export default function Dashboard() {
  const stats = [
    { label: 'Daily Calories', value: '1,230', target: '1,800', icon: Flame, color: 'text-chart-2' },
    { label: 'Protein', value: '88g', target: '120g', icon: TrendingDown, color: 'text-chart-1' },
    { label: 'Active Days', value: '15', target: '30', icon: Activity, color: 'text-chart-3' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold" data-testid="text-dashboard-title">
                    Your Meal Plan
                  </h1>
                  <p className="text-muted-foreground mt-1" data-testid="text-dashboard-subtitle">
                    Track your progress and manage your meals
                  </p>
                </div>
                <Badge className="w-fit" data-testid="badge-plan-active">
                  <Calendar className="mr-2 h-4 w-4" />
                  Premium Clinical Plan
                </Badge>
              </div>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Your Journey Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex flex-col items-center gap-2 p-4 rounded-md bg-background"
                        data-testid={`milestone-${milestone.id}`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          milestone.status === 'completed' ? 'bg-primary/10' :
                          milestone.status === 'in-progress' ? 'bg-chart-2/10' :
                          'bg-muted'
                        }`}>
                          <milestone.icon className={`h-6 w-6 ${milestone.color}`} />
                        </div>
                        <p className="text-xs text-center font-medium" data-testid={`text-milestone-${milestone.id}`}>
                          {milestone.name}
                        </p>
                        {milestone.status === 'in-progress' && (
                          <Badge variant="outline" className="text-xs">In Progress</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Progress value={33} data-testid="progress-milestones" />
                    <p className="text-sm text-muted-foreground mt-2">2 of 6 milestones completed</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} data-testid={`card-stat-${index}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium" data-testid={`text-stat-label-${index}`}>
                        {stat.label}
                      </CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-mono font-semibold" data-testid={`text-stat-value-${index}`}>
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Target: {stat.target}
                      </p>
                      <Progress 
                        value={(parseInt(stat.value) / parseInt(stat.target)) * 100} 
                        className="mt-3"
                        data-testid={`progress-stat-${index}`}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs defaultValue="week" className="space-y-6">
                <TabsList data-testid="tabs-meal-schedule">
                  <TabsTrigger value="week" data-testid="tab-week">This Week</TabsTrigger>
                  <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
                  <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="week" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-week-meals">This Week's Meal Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {weeklyMeals.map((dayPlan, dayIndex) => (
                        <div key={dayPlan.day} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-day-${dayIndex}`}>
                              {dayPlan.day}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {dayPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-3 gap-6">
                            {dayPlan.meals.map((meal, mealIndex) => (
                              <MealCard
                                key={`${dayIndex}-${mealIndex}`}
                                {...meal}
                                onSwap={() => console.log(`Swap ${meal.name} on ${dayPlan.day}`)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Showing meals for the first 3 days. Full week available after plan activation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-reports">Your Health Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          data-testid="button-view-test-report"
                        >
                          <span>Blood Test Report</span>
                          <Badge>Available</Badge>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled
                          data-testid="button-view-diagnosis"
                        >
                          <span>Diagnosis Summary</span>
                          <Badge variant="secondary">Pending</Badge>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled
                          data-testid="button-view-diet-chart"
                        >
                          <span>Personalized Diet Chart</span>
                          <Badge variant="secondary">Locked</Badge>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-profile">Consultation Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium" data-testid="text-age">32 years</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium" data-testid="text-gender">Female</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p className="font-medium" data-testid="text-weight">68 kg</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Height</p>
                          <p className="font-medium" data-testid="text-height">165 cm</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Goal</p>
                          <p className="font-medium" data-testid="text-goal">Weight Loss</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Activity Level</p>
                          <p className="font-medium" data-testid="text-activity">Moderate</p>
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-2">Health Concerns</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">None reported</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-preferences">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" data-testid="button-update-preferences">
                        Update Dietary Preferences
                      </Button>
                      <Button variant="outline" className="w-full justify-start" data-testid="button-delivery-schedule">
                        Manage Delivery Schedule
                      </Button>
                      <Button variant="outline" className="w-full justify-start" data-testid="button-subscription">
                        Subscription Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
