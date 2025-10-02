import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuizQuestion } from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { CheckCircle2, Sparkles, PartyPopper } from 'lucide-react';
import { Link } from 'wouter';

const quizSections = [
  {
    section: 'Basic Profile',
    cheerMessage: "Great start! Every answer helps us build the perfect plan just for you 💪",
    questions: [
      {
        question: "What's your age group?",
        type: 'choice',
        options: [
          { value: 'under-18', label: 'Under 18', icon: '👶' },
          { value: '18-25', label: '18–25', icon: '🧑' },
          { value: '26-35', label: '26–35', icon: '👨' },
          { value: '36-45', label: '36–45', icon: '👴' },
          { value: '46+', label: '46+', icon: '👵' },
        ],
      },
      {
        question: "What's your gender?",
        type: 'choice',
        options: [
          { value: 'male', label: 'Male', icon: '👨' },
          { value: 'female', label: 'Female', icon: '👩' },
          { value: 'other', label: 'Other / Prefer not to say', icon: '🙂' },
        ],
      },
      {
        question: "What's your current weight (kg)?",
        type: 'input',
        inputType: 'number',
        placeholder: 'Enter your weight in kg',
      },
      {
        question: "What's your height (cm)?",
        type: 'input',
        inputType: 'number',
        placeholder: 'Enter your height in cm',
      },
    ],
  },
  {
    section: 'Health & Lifestyle',
    cheerMessage: "Awesome! You're one step closer to achieving your health goals 🚀",
    questions: [
      {
        question: "What's your primary goal?",
        type: 'choice',
        options: [
          { value: 'lose-weight', label: 'Lose weight', icon: '🎯' },
          { value: 'gain-muscle', label: 'Gain muscle', icon: '💪' },
          { value: 'maintain-weight', label: 'Maintain weight', icon: '⚖️' },
          { value: 'improve-health', label: 'Improve overall health', icon: '❤️' },
        ],
      },
      {
        question: 'How active are you on a daily basis?',
        type: 'choice',
        options: [
          { value: 'sedentary', label: 'Sedentary (little to no exercise)', icon: '🪑' },
          { value: 'light', label: 'Light activity (1–2 workouts/week)', icon: '🚶' },
          { value: 'moderate', label: 'Moderate activity (3–5 workouts/week)', icon: '🏃' },
          { value: 'very-active', label: 'Very active (6–7 workouts/week)', icon: '🔥' },
        ],
      },
      {
        question: 'Do you have any of these health concerns?',
        type: 'choice',
        options: [
          { value: 'diabetes', label: 'Diabetes', icon: '🩺' },
          { value: 'high-bp', label: 'High blood pressure', icon: '💉' },
          { value: 'high-cholesterol', label: 'High cholesterol', icon: '🫀' },
          { value: 'pcos', label: 'PCOS / Hormonal issues', icon: '🔬' },
          { value: 'none', label: 'None', icon: '✅' },
        ],
      },
      {
        question: 'Do you take any regular medications?',
        type: 'choice',
        options: [
          { value: 'yes', label: 'Yes', icon: '💊' },
          { value: 'no', label: 'No', icon: '✅' },
        ],
      },
    ],
  },
  {
    section: 'Food Preferences',
    cheerMessage: "Noted! We'll make sure your meals are safe and tasty 🌱🍲",
    questions: [
      {
        question: "What's your dietary preference?",
        type: 'choice',
        options: [
          { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
          { value: 'vegan', label: 'Vegan', icon: '🌱' },
          { value: 'eggetarian', label: 'Eggetarian', icon: '🥚' },
          { value: 'non-veg', label: 'Non-vegetarian', icon: '🍗' },
          { value: 'keto', label: 'Keto / Low-carb', icon: '🥑' },
        ],
      },
      {
        question: 'Any allergies or foods to avoid?',
        type: 'choice',
        options: [
          { value: 'dairy', label: 'Dairy', icon: '🥛' },
          { value: 'gluten', label: 'Gluten', icon: '🌾' },
          { value: 'nuts', label: 'Nuts', icon: '🥜' },
          { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
          { value: 'soy', label: 'Soy', icon: '🫘' },
          { value: 'none', label: 'None', icon: '✅' },
        ],
      },
      {
        question: 'How many meals do you prefer per day?',
        type: 'choice',
        options: [
          { value: '3-meals', label: '3 (Breakfast, Lunch, Dinner)', icon: '🍽️' },
          { value: '4-5-meals', label: '4–5 small meals/snacks', icon: '🥗' },
          { value: 'flexible', label: "Flexible, I don't mind", icon: '😊' },
        ],
      },
      {
        question: 'Do you prefer spicy, mild, or balanced flavors?',
        type: 'choice',
        options: [
          { value: 'spicy', label: 'Spicy 🌶️', icon: '🌶️' },
          { value: 'mild', label: 'Mild 🌸', icon: '🌸' },
          { value: 'balanced', label: 'Balanced 🍴', icon: '🍴' },
        ],
      },
    ],
  },
  {
    section: 'Habits & Routine',
    cheerMessage: "We're building your lifestyle-friendly plan – you're doing amazing 👏",
    questions: [
      {
        question: 'When do you usually wake up?',
        type: 'input',
        inputType: 'time',
        placeholder: 'Select wake up time',
      },
      {
        question: 'When do you usually sleep?',
        type: 'input',
        inputType: 'time',
        placeholder: 'Select sleep time',
      },
      {
        question: 'Do you usually eat late at night?',
        type: 'choice',
        options: [
          { value: 'yes', label: 'Yes', icon: '🌙' },
          { value: 'no', label: 'No', icon: '🌞' },
        ],
      },
      {
        question: 'Do you consume alcohol?',
        type: 'choice',
        options: [
          { value: 'never', label: 'Never', icon: '🚫' },
          { value: 'occasionally', label: 'Occasionally', icon: '🍷' },
          { value: 'regularly', label: 'Regularly', icon: '🍺' },
        ],
      },
      {
        question: 'How much water do you drink daily?',
        type: 'choice',
        options: [
          { value: 'less-1l', label: 'Less than 1L', icon: '💧' },
          { value: '1-2l', label: '1–2L', icon: '💧💧' },
          { value: '2-3l', label: '2–3L', icon: '💧💧💧' },
          { value: '3l+', label: '3L+', icon: '💧💧💧💧' },
        ],
      },
    ],
  },
  {
    section: 'Personalization',
    cheerMessage: "Fantastic! 🎉 Your personalized plan is ready. Get ready to enjoy meals designed exactly for your body and goals.",
    questions: [
      {
        question: 'Do you want to include snacks & desserts in your plan?',
        type: 'choice',
        options: [
          { value: 'yes', label: 'Yes', icon: '🍪' },
          { value: 'no', label: 'No', icon: '🚫' },
        ],
      },
      {
        question: "What's your food budget per day (₹)?",
        type: 'slider',
        min: 100,
        max: 1000,
        step: 50,
        defaultValue: 300,
      },
      {
        question: 'How soon do you want to see results?',
        type: 'choice',
        options: [
          { value: '2-4-weeks', label: '2–4 weeks', icon: '⚡' },
          { value: '1-3-months', label: '1–3 months', icon: '📅' },
          { value: '3-6-months', label: '3–6 months', icon: '📆' },
          { value: 'long-term', label: 'Long-term lifestyle', icon: '🌟' },
        ],
      },
    ],
  },
];

export default function AIPlan() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showCheer, setShowCheer] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sliderValue, setSliderValue] = useState<number[]>([300]);

  const currentSection = quizSections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const totalQuestions = quizSections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;

  const handleNext = (answer: string) => {
    const questionId = `${currentSectionIndex}-${currentQuestionIndex}`;
    setAnswers({ ...answers, [questionId]: answer });
    setInputValue('');
    
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowCheer(true);
      console.log('Section completed:', currentSection.section);
    }
  };

  const handleContinueAfterCheer = () => {
    setShowCheer(false);
    
    if (currentSectionIndex < quizSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      setShowResults(true);
      console.log('Quiz completed. All answers:', answers);
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

                {!showCheer ? (
                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span data-testid="text-quiz-progress">
                          Question {answeredQuestions + 1} of {totalQuestions}
                        </span>
                        <span data-testid="text-section-name">{currentSection.section}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                          data-testid="progress-quiz"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="font-display text-2xl md:text-3xl font-semibold" data-testid="text-quiz-question">
                        {currentQuestion.question}
                      </h2>

                      {currentQuestion.type === 'choice' && (
                        <div className="grid gap-3">
                          {currentQuestion.options?.map((option) => (
                            <Card
                              key={option.value}
                              className="p-4 cursor-pointer hover-elevate transition-all"
                              onClick={() => handleNext(option.value)}
                              data-testid={`card-option-${option.value}`}
                            >
                              <div className="flex items-center gap-3">
                                {option.icon && <span className="text-2xl">{option.icon}</span>}
                                <span className="font-medium">{option.label}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'input' && 'inputType' in currentQuestion && (
                        <div className="space-y-4">
                          <Input
                            type={currentQuestion.inputType}
                            placeholder={currentQuestion.placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="text-lg"
                            data-testid="input-quiz-answer"
                          />
                          <Button
                            size="lg"
                            className="w-full"
                            onClick={() => handleNext(inputValue)}
                            disabled={!inputValue}
                            data-testid="button-quiz-next"
                          >
                            Continue
                          </Button>
                        </div>
                      )}

                      {currentQuestion.type === 'slider' && 'min' in currentQuestion && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-lg">₹{sliderValue[0]} per day</Label>
                            <Slider
                              min={currentQuestion.min}
                              max={currentQuestion.max}
                              step={currentQuestion.step}
                              value={sliderValue}
                              onValueChange={setSliderValue}
                              data-testid="slider-budget"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>₹{currentQuestion.min}</span>
                              <span>₹{currentQuestion.max}</span>
                            </div>
                          </div>
                          <Button
                            size="lg"
                            className="w-full"
                            onClick={() => handleNext(sliderValue[0].toString())}
                            data-testid="button-quiz-next"
                          >
                            Continue
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <Card className="border-primary/50 bg-primary/5">
                      <CardContent className="p-8 md:p-12 text-center space-y-6">
                        <div className="flex justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <PartyPopper className="h-8 w-8" />
                          </div>
                        </div>
                        <p className="text-xl font-semibold" data-testid="text-cheer-message">
                          {currentSection.cheerMessage}
                        </p>
                        <Button
                          size="lg"
                          onClick={handleContinueAfterCheer}
                          data-testid="button-continue-section"
                        >
                          Continue to Next Section
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
                      <Link href="/auth/login?redirect=/checkout" className="flex-1">
                        <Button size="lg" className="w-full" data-testid="button-proceed-checkout">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Button size="lg" variant="outline" className="flex-1" onClick={() => {
                        setCurrentSectionIndex(0);
                        setCurrentQuestionIndex(0);
                        setAnswers({});
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
