import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

interface MealCardProps {
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onSwap?: () => void;
}

const mealTypeColors = {
  breakfast: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  lunch: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  dinner: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  snack: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
};

export function MealCard({ name, image, calories, protein, carbs, fats, mealType, onSwap }: MealCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all group" data-testid={`card-meal-${name.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          data-testid="img-meal"
        />
        <Badge className={`absolute top-3 left-3 ${mealTypeColors[mealType]}`} data-testid="badge-meal-type">
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg" data-testid="text-meal-name">{name}</h3>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-mono font-semibold" data-testid="text-calories">{calories}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-mono font-semibold" data-testid="text-protein">{protein}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-mono font-semibold" data-testid="text-carbs">{carbs}g</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Fats</p>
            <p className="font-mono font-semibold" data-testid="text-fats">{fats}g</p>
          </div>
        </div>

        {onSwap && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onSwap}
            data-testid="button-swap-meal"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Swap Meal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
