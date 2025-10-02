import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MealCard } from '@/components/MealCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingDown, Flame, Activity } from 'lucide-react';
import breakfastImage from '@assets/generated_images/Healthy_breakfast_bowl_640a6a89.png';
import lunchImage from '@assets/generated_images/Healthy_Buddha_bowl_lunch_368a96fc.png';
import dinnerImage from '@assets/generated_images/Grilled_chicken_dinner_plate_b60850a5.png';

export default function Dashboard() {
  const todayMeals = [
    {
      name: 'Greek Yogurt Berry Bowl',
      image: breakfastImage,
      calories: 320,
      protein: 18,
      carbs: 42,
      fats: 8,
      mealType: 'breakfast' as const,
    },
    {
      name: 'Buddha Bowl',
      image: lunchImage,
      calories: 485,
      protein: 32,
      carbs: 52,
      fats: 15,
      mealType: 'lunch' as const,
    },
    {
      name: 'Grilled Chicken Plate',
      image: dinnerImage,
      calories: 425,
      protein: 38,
      carbs: 35,
      fats: 12,
      mealType: 'dinner' as const,
    },
  ];

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
                  Active Plan
                </Badge>
              </div>

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

              <Tabs defaultValue="today" className="space-y-6">
                <TabsList data-testid="tabs-meal-schedule">
                  <TabsTrigger value="today" data-testid="tab-today">Today</TabsTrigger>
                  <TabsTrigger value="week" data-testid="tab-week">This Week</TabsTrigger>
                  <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-today-meals">Today's Meals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {todayMeals.map((meal, index) => (
                          <MealCard
                            key={index}
                            {...meal}
                            onSwap={() => console.log(`Swap ${meal.name}`)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="week" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle data-testid="text-week-overview">Weekly Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground" data-testid="text-week-placeholder">
                        Your weekly meal schedule will appear here
                      </p>
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
