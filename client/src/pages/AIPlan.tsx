import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuizQuestion } from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

const quizQuestions = [
  {
    question: 'What is your age range?',
    options: [
      { value: '18-25', label: '18-25 years', icon: '👶' },
      { value: '26-35', label: '26-35 years', icon: '🧑' },
      { value: '36-50', label: '36-50 years', icon: '👨' },
      { value: '50+', label: '50+ years', icon: '👴' },
    ],
  },
  {
    question: 'What is your activity level?',
    options: [
      { value: 'sedentary', label: 'Sedentary (little to no exercise)', icon: '🪑' },
      { value: 'light', label: 'Lightly active (1-3 days/week)', icon: '🚶' },
      { value: 'moderate', label: 'Moderately active (3-5 days/week)', icon: '🏃' },
      { value: 'very', label: 'Very active (6-7 days/week)', icon: '💪' },
    ],
  },
  {
    question: 'What is your primary fitness goal?',
    options: [
      { value: 'weight-loss', label: 'Weight Loss', icon: '🎯' },
      { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
      { value: 'maintenance', label: 'Weight Maintenance', icon: '⚖️' },
      { value: 'health', label: 'Overall Health', icon: '❤️' },
    ],
  },
  {
    question: 'Do you have any dietary preferences?',
    options: [
      { value: 'none', label: 'No restrictions', icon: '🍽️' },
      { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
      { value: 'vegan', label: 'Vegan', icon: '🌱' },
      { value: 'keto', label: 'Keto', icon: '🥑' },
    ],
  },
];

export default function AIPlan() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleNext = (answer: string) => {
    setAnswers([...answers, answer]);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      console.log('Quiz completed. Answers:', [...answers, answer]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            {!showResults ? (
              <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-semibold">AI-Powered Meal Planning</span>
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold" data-testid="text-ai-plan-title">
                    Let's Create Your Perfect Meal Plan
                  </h1>
                  <p className="text-lg text-muted-foreground" data-testid="text-ai-plan-subtitle">
                    Answer a few questions and our AI will design a personalized nutrition plan just for you
                  </p>
                </div>

                <QuizQuestion
                  question={quizQuestions[currentQuestion].question}
                  options={quizQuestions[currentQuestion].options}
                  currentStep={currentQuestion + 1}
                  totalSteps={quizQuestions.length}
                  onNext={handleNext}
                />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h2 className="font-display text-2xl font-semibold" data-testid="text-plan-ready">
                        Your AI Meal Plan is Ready!
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-muted-foreground" data-testid="text-plan-description">
                        Based on your responses, we've created a personalized meal plan tailored to your goals, preferences, and lifestyle.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Weekly Plan Price</p>
                          <p className="font-mono text-2xl font-semibold" data-testid="text-pricing">₹1,299/week</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Daily Calories</p>
                          <p className="font-mono text-2xl font-semibold" data-testid="text-calories-target">1,800 kcal</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="text-sm">3 meals + 1 snack daily</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="text-sm">Customized to your dietary preferences</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="text-sm">Fresh meals delivered daily</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Link href="/dashboard" className="flex-1">
                        <Button size="lg" className="w-full" data-testid="button-view-plan">
                          View Full Plan
                        </Button>
                      </Link>
                      <Button size="lg" variant="outline" className="flex-1" onClick={() => {
                        setCurrentQuestion(0);
                        setAnswers([]);
                        setShowResults(false);
                      }} data-testid="button-retake-quiz">
                        Retake Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
