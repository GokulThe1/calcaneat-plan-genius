import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FlaskConical, FileText, MessageSquare, ChefHat, Truck } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Physician Consultation',
    description: 'Schedule an online or in-person consultation with our licensed physicians',
  },
  {
    icon: FlaskConical,
    title: 'At-Home Test Collection',
    description: 'Convenient blood sample and body composition analysis from your home',
  },
  {
    icon: FileText,
    title: 'Detailed Report',
    description: 'Comprehensive health report with insights and recommendations',
  },
  {
    icon: MessageSquare,
    title: 'Feasibility Discussion',
    description: 'Review your results and discuss personalized nutrition goals',
  },
  {
    icon: ChefHat,
    title: 'Custom Diet Chart',
    description: 'Professional nutritionist creates your personalized meal plan',
  },
  {
    icon: Truck,
    title: 'Meal Delivery',
    description: 'Chef-prepared meals delivered fresh to your door daily',
  },
];

export function ProcessSteps() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold" data-testid="text-process-title">
            How Premium Clinical Plan Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-process-subtitle">
            A comprehensive approach to personalized nutrition
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="hover-elevate transition-all" data-testid={`card-step-${index}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg" data-testid={`text-step-title-${index}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-step-description-${index}`}>
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
