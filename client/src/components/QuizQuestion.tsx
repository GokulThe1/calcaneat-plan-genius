import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface QuizOption {
  value: string;
  label: string;
  icon?: string;
}

interface QuizQuestionProps {
  question: string;
  options: QuizOption[];
  currentStep: number;
  totalSteps: number;
  onNext: (answer: string) => void;
}

export function QuizQuestion({ question, options, currentStep, totalSteps, onNext }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (selectedAnswer) {
      console.log('Quiz answer:', selectedAnswer);
      onNext(selectedAnswer);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span data-testid="text-quiz-progress">Question {currentStep} of {totalSteps}</span>
          <span data-testid="text-quiz-percentage">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} data-testid="progress-quiz" />
      </div>

      <div className="space-y-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold" data-testid="text-quiz-question">
          {question}
        </h2>

        <div className="grid gap-3">
          {options.map((option) => (
            <Card
              key={option.value}
              className={`p-4 cursor-pointer hover-elevate transition-all ${
                selectedAnswer === option.value ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedAnswer(option.value)}
              data-testid={`card-option-${option.value}`}
            >
              <div className="flex items-center gap-3">
                {option.icon && <span className="text-2xl">{option.icon}</span>}
                <span className="font-medium">{option.label}</span>
              </div>
            </Card>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleNext}
          disabled={!selectedAnswer}
          data-testid="button-quiz-next"
        >
          Continue
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
