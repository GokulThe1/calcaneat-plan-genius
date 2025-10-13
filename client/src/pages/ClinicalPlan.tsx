import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProcessSteps } from '@/components/ProcessSteps';
import { BookingCalendar } from '@/components/BookingCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

export default function ClinicalPlan() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-chart-4/5 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-chart-4 text-white border-0" data-testid="badge-premium-header">
                Premium Service
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold" data-testid="text-clinical-title">
                Premium Clinical Meal Plan
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-clinical-subtitle">
                A comprehensive, medically-supervised approach to personalized nutrition with expert guidance at every step
              </p>
            </div>
          </div>
        </section>

        <ProcessSteps />

        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-chart-4/50">
                <CardContent className="p-8 md:p-12 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-chart-4/10 text-chart-4">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-semibold" data-testid="text-pricing-title">
                      Premium Subscription Pricing
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <p className="text-muted-foreground" data-testid="text-pricing-description">
                      Our premium clinical plan includes comprehensive health assessments, personalized consultations, and chef-prepared meals tailored to your unique health profile.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Initial Consultation</p>
                        <p className="font-mono text-xl font-semibold" data-testid="text-consultation-fee">₹5,000</p>
                        <p className="text-xs text-muted-foreground">One-time fee</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Weekly Meal Plan</p>
                        <p className="font-mono text-xl font-semibold" data-testid="text-weekly-price">₹3,999</p>
                        <p className="text-xs text-muted-foreground">Per week</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Monthly Plan</p>
                        <p className="font-mono text-xl font-semibold" data-testid="text-monthly-price">₹14,999</p>
                        <p className="text-xs text-muted-foreground">Save 15%</p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">What's Included</h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {[
                          'Licensed physician consultation',
                          'Comprehensive blood work analysis',
                          'Body composition assessment',
                          'Personalized nutrition plan',
                          'Daily chef-prepared meals',
                          'Weekly progress tracking',
                          'Nutritionist support',
                          'Flexible delivery schedule',
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2" data-testid={`text-included-${index}`}>
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Link href="/book-consultation" className="flex-1">
                        <Button size="lg" className="w-full" data-testid="button-book-consultation">
                          <Calendar className="mr-2 h-5 w-5" />
                          Book Your First Consultation
                        </Button>
                      </Link>
                      <Link href="/" className="flex-1">
                        <Button size="lg" variant="outline" className="w-full" data-testid="button-learn-more">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <BookingCalendar />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
