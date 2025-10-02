import { MealCard } from '../MealCard'
import breakfastImage from '@assets/generated_images/Healthy_breakfast_bowl_640a6a89.png'

export default function MealCardExample() {
  const handleSwap = () => {
    console.log('Swap meal clicked')
  }

  return (
    <div className="p-8 max-w-sm">
      <MealCard
        name="Greek Yogurt Berry Bowl"
        image={breakfastImage}
        calories={320}
        protein={18}
        carbs={42}
        fats={8}
        mealType="breakfast"
        onSwap={handleSwap}
      />
    </div>
  )
}
