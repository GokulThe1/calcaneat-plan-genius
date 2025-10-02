import { QuizQuestion } from '../QuizQuestion'

export default function QuizQuestionExample() {
  const handleNext = (answer: string) => {
    console.log('Selected answer:', answer)
  }

  return (
    <div className="p-8">
      <QuizQuestion
        question="What is your primary fitness goal?"
        options={[
          { value: 'weight-loss', label: 'Weight Loss', icon: '🎯' },
          { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
          { value: 'maintenance', label: 'Weight Maintenance', icon: '⚖️' },
          { value: 'health', label: 'Overall Health', icon: '❤️' },
        ]}
        currentStep={3}
        totalSteps={8}
        onNext={handleNext}
      />
    </div>
  )
}
