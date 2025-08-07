import { useState, useEffect } from "react";
import { Apple, Plus, TrendingUp, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { dateKey, formatTime } from "@/utils/date";
import { weeklyCalories } from "@/utils/stats";
import type { CaloriesByDate, MealEntry } from "@/types";

export const Nutrition = () => {
  const { toast } = useToast();
  const [caloriesByDate, setCaloriesByDate] = useState<CaloriesByDate>({});
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [mealForm, setMealForm] = useState({
    type: 'breakfast' as MealEntry['type'],
    name: '',
    calories: '',
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });

  const today = dateKey();
  const todayMeals = caloriesByDate[today]?.byMeal || [];
  const todayCalories = caloriesByDate[today]?.total || 0;
  const calorieTarget = 2200;

  const loadData = () => {
    const data: CaloriesByDate = JSON.parse(localStorage.getItem('caloriesByDate') || '{}');
    setCaloriesByDate(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMeal = () => {
    if (!mealForm.name.trim() || !mealForm.calories) return;

    const newMeal: MealEntry = {
      type: mealForm.type,
      name: mealForm.name.trim(),
      calories: parseInt(mealForm.calories),
      time: new Date().toISOString()
    };

    const updatedData = { ...caloriesByDate };
    if (!updatedData[today]) {
      updatedData[today] = { total: 0, byMeal: [] };
    }
    
    updatedData[today].byMeal.push(newMeal);
    updatedData[today].total += newMeal.calories;

    setCaloriesByDate(updatedData);
    localStorage.setItem('caloriesByDate', JSON.stringify(updatedData));

    toast({
      title: "Meal added",
      description: `${newMeal.name} logged with ${newMeal.calories} calories`,
    });

    setMealForm({
      type: 'breakfast',
      name: '',
      calories: '',
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    });
    setIsAddMealOpen(false);
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🍎';
      case 'drink': return '🥤';
      default: return '🍴';
    }
  };

  const calorieProgress = calorieTarget > 0 ? (todayCalories / calorieTarget) * 100 : 0;
  const weeklyStats = weeklyCalories(caloriesByDate);

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
          <p className="text-muted-foreground">Track your daily intake</p>
        </div>
        <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Meal Type</Label>
                <Select value={mealForm.type} onValueChange={(value: MealEntry['type']) => setMealForm(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
                    <SelectItem value="lunch">🥗 Lunch</SelectItem>
                    <SelectItem value="dinner">🍽️ Dinner</SelectItem>
                    <SelectItem value="snack">🍎 Snack</SelectItem>
                    <SelectItem value="drink">🥤 Drink</SelectItem>
                    <SelectItem value="other">🍴 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Food Name</Label>
                <Input
                  value={mealForm.name}
                  onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Grilled chicken salad"
                />
              </div>
              <div>
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="e.g., 350"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMealOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMeal} disabled={!mealForm.name.trim() || !mealForm.calories}>Add Meal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mobile-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Apple size={20} />Today's Goals</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Calories</span>
            <span className="text-sm text-muted-foreground">{todayCalories} / {calorieTarget}</span>
          </div>
          <Progress value={calorieProgress} className="h-3" />
          {todayCalories === 0 && <p className="text-xs text-muted-foreground mt-1">No meals logged yet today</p>}
        </CardContent>
      </Card>

      <Card className="mobile-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={20} />Today's Meals</CardTitle></CardHeader>
        <CardContent>
          {todayMeals.length === 0 ? (
            <div className="text-center py-8">
              <Apple className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground mb-4">No meals logged yet</p>
              <Button onClick={() => setIsAddMealOpen(true)}><Plus size={16} className="mr-2" />Add Your First Meal</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getMealIcon(meal.type)}</span>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{meal.type} • {formatTime(meal.time)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{meal.calories} cal</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mobile-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp size={20} />Weekly Trend</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{weeklyStats.avg}</p>
              <p className="text-sm text-muted-foreground">Avg Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{weeklyStats.goalHitRate}%</p>
              <p className="text-sm text-muted-foreground">Goal Hit Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};