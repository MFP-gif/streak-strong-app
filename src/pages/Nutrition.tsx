import { Plus, Target, TrendingUp, Coffee, Apple, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Nutrition = () => {
  // Mock data - will be replaced with actual state management
  const dailyTargets = {
    calories: 2200,
    protein: 150,
    carbs: 275,
    fat: 73
  };

  const consumed = {
    calories: 1650,
    protein: 110,
    carbs: 180,
    fat: 58
  };

  const meals = [
    {
      id: 1,
      name: "Breakfast",
      time: "8:30 AM",
      calories: 420,
      items: ["Oatmeal with berries", "Greek yogurt", "Coffee"]
    },
    {
      id: 2,
      name: "Lunch", 
      time: "12:45 PM",
      calories: 680,
      items: ["Grilled chicken salad", "Brown rice", "Avocado"]
    },
    {
      id: 3,
      name: "Snack",
      time: "3:30 PM",
      calories: 220,
      items: ["Protein shake", "Banana"]
    },
    {
      id: 4,
      name: "Dinner",
      time: "7:00 PM",
      calories: 330,
      items: ["Salmon", "Steamed vegetables", "Quinoa"]
    }
  ];

  const calorieProgress = (consumed.calories / dailyTargets.calories) * 100;
  const proteinProgress = (consumed.protein / dailyTargets.protein) * 100;
  const carbProgress = (consumed.carbs / dailyTargets.carbs) * 100;
  const fatProgress = (consumed.fat / dailyTargets.fat) * 100;

  const getMealIcon = (mealName: string) => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return Coffee;
      case 'lunch': return Utensils;
      case 'dinner': return Utensils;
      default: return Apple;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
          <p className="text-muted-foreground">Track your daily intake</p>
        </div>
        <Button size="sm" className="btn-mobile gap-2">
          <Plus size={16} />
          Add Food
        </Button>
      </div>

      {/* Daily Overview */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target size={20} />
            Daily Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Calories</span>
              <span className="text-sm text-muted-foreground">
                {consumed.calories} / {dailyTargets.calories}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1">
              {dailyTargets.calories - consumed.calories} remaining
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Protein</div>
              <div className="font-semibold text-sm">{consumed.protein}g</div>
              <Progress value={proteinProgress} className="h-2 mt-1" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Carbs</div>
              <div className="font-semibold text-sm">{consumed.carbs}g</div>
              <Progress value={carbProgress} className="h-2 mt-1" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Fat</div>
              <div className="font-semibold text-sm">{consumed.fat}g</div>
              <Progress value={fatProgress} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
        <div className="space-y-3">
          {meals.map((meal) => {
            const IconComponent = getMealIcon(meal.name);
            return (
              <Card key={meal.id} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent size={18} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{meal.name}</h3>
                        <p className="text-xs text-muted-foreground">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">{meal.calories} cal</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {meal.items.map((item, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weekly Trend */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp size={20} />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">2,150</div>
              <div className="text-sm text-muted-foreground">Avg Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">92%</div>
              <div className="text-sm text-muted-foreground">Goal Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};