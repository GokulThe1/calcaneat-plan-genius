import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Stethoscope } from 'lucide-react';
import { Link } from 'wouter';

const plans = [
  {
    id: 'clinical',
    name: 'Premium Clinical Plan',
    icon: Stethoscope,
    description: 'Comprehensive health assessment with expert guidance',
    price: 'Custom pricing',
    isPremium: true,
    features: [
      'Online/offline physician consultation',
      'At-home test collection (blood, body composition)',
      'Detailed health report generation',
      'Feasibility discussion with consultant',
      'Personalized diet chart by nutritionist',
      'Chef-prepared meals delivered daily',
      'Ongoing health monitoring',
    ],
    cta: 'Learn More',
    href: '/clinical-plan',
  },
  {
    id: 'ai',
    name: 'AI-Assisted Plan',
    icon: Sparkles,
    description: 'Smart meal planning powered by advanced AI',
    price: 'Starting at ₹999/week',
    isPremium: false,
    features: [
      'Interactive AI-powered questionnaire',
      'Instant personalized meal plan',
      'Custom dietary preferences (veg, vegan, keto)',
      'Allergy and restriction management',
      'Goal-based nutrition (weight loss, muscle gain)',
      'Chef-prepared meals delivered',
      'Flexible plan modifications',
    ],
    cta: 'Start AI Plan',
    href: '/ai-plan',
  },
];

export function PlanCards() {
  return (
    <section id="plans" className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold" data-testid="text-plans-title">
            Choose Your Path to Better Health
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-plans-subtitle">
            Select the plan that fits your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative hover-elevate transition-all ${
                plan.isPremium ? 'border-chart-4/50' : ''
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.isPremium && (
                <Badge className="absolute -top-3 right-6 bg-chart-4 text-white border-0" data-testid="badge-premium">
                  Premium
                </Badge>
              )}
              
              <CardHeader className="gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-md ${
                    plan.isPremium ? 'bg-chart-4/10 text-chart-4' : 'bg-primary/10 text-primary'
                  }`}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl" data-testid={`text-plan-name-${plan.id}`}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription data-testid={`text-plan-description-${plan.id}`}>
                      {plan.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-2xl font-semibold font-mono" data-testid={`text-plan-price-${plan.id}`}>
                  {plan.price}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`text-feature-${plan.id}-${index}`}>
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button
                    className="w-full"
                    variant={plan.isPremium ? 'default' : 'outline'}
                    data-testid={`button-${plan.id}-cta`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
