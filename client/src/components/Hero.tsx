import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import heroImage from '@assets/generated_images/Hero_healthy_salmon_meal_9774e6ea.png';
import { CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight" data-testid="text-hero-title">
                Your body, your meals — crafted for you
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="text-hero-subtitle">
                Personalized nutrition delivered to your door. Choose between our premium clinical plan with expert consultations or AI-powered meal planning.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/clinical-plan">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-premium-clinical">
                  Premium Clinical Plan
                </Button>
              </Link>
              <Link href="/ai-plan">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-ai-assisted">
                  AI-Assisted Plan
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4" data-testid="text-trust-indicator">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Trusted by 10,000+ health-conscious individuals</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Healthy meal with salmon and vegetables"
                className="w-full h-auto object-cover"
                data-testid="img-hero"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-chart-2/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
