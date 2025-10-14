import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Stethoscope } from "lucide-react";

export default function Plans() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Wellness Plan</h1>
          <p className="text-lg text-muted-foreground">
            Select the plan that best fits your health goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Clinical Plan Card */}
          <Card className="relative border-primary" data-testid="card-clinical-plan">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Clinical-Level Guided Plan</CardTitle>
              <CardDescription className="text-base">
                Personalized medical supervision with comprehensive health assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Doctor consultation and health assessment</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Diagnostic test reports and analysis</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Nutritionist-approved personalized diet chart</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Meal delivery with health tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">6-stage progress monitoring</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold">₹25,000</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button className="w-full" size="lg" data-testid="button-select-clinical" asChild>
                  <Link href="/book-consultation">
                    Get Started
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI-Assisted Plan Card */}
          <Card data-testid="card-ai-plan">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">AI-Assisted Plan</CardTitle>
              <CardDescription className="text-base">
                Intelligent meal planning through interactive questionnaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-sm">AI-powered health assessment quiz</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-sm">Personalized meal recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-sm">Automated diet plan generation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-sm">Self-service meal selection</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <span className="text-sm">Flexible scheduling</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold">₹15,000</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button variant="outline" className="w-full" size="lg" data-testid="button-select-ai" asChild>
                  <Link href="/ai-plan">
                    Get Started
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include free delivery within city limits
          </p>
        </div>
      </div>
    </div>
  );
}
