import { Calendar, Flame, Target, TrendingUp, Dumbbell, Apple } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Home = () => {
  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good morning ☀️";
    if (hour >= 12 && hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

  // Mock data - will be replaced with actual state management
  const streakData = {
    global: 12,
    workout: 5,
    nutrition: 8,
    habits: 12
  };

  // Load data from localStorage with defaults
  const caloriesData = JSON.parse(localStorage.getItem('calories') || '{"consumed": 0, "target": 0}');
  const habitsData = JSON.parse(localStorage.getItem('habits') || '{"completed": 0, "target": 0}');
  
  const todayData = {
    caloriesConsumed: caloriesData.consumed,
    caloriesTarget: caloriesData.target || 2200, // Default target if 0
    workoutCompleted: false,
    workoutName: "None yet", // Will be updated when workout is completed
    habitsCompleted: habitsData.completed,
    habitsTotal: habitsData.target || 5 // Default target if 0
  };

  const calorieProgress = todayData.caloriesTarget > 0 ? (todayData.caloriesConsumed / todayData.caloriesTarget) * 100 : 0;
  const habitProgress = todayData.habitsTotal > 0 ? (todayData.habitsCompleted / todayData.habitsTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getGreeting()}</h1>
          <p className="text-muted-foreground">Let's crush today's goals</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="text-streak-fire" size={20} />
          <span className="text-lg font-bold text-foreground">{streakData.global}</span>
        </div>
      </div>

      {/* Today's Overview */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar size={20} />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Calories</span>
              <span className="text-sm text-muted-foreground">
                {todayData.caloriesConsumed} / {todayData.caloriesTarget}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3" />
          </div>

          {/* Habits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Habits</span>
              <span className="text-sm text-muted-foreground">
                {todayData.habitsCompleted} / {todayData.habitsTotal}
              </span>
            </div>
            <Progress value={habitProgress} className="h-3" />
          </div>

          {/* Workout Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Today's Workout</span>
            {todayData.workoutCompleted ? (
              <span className="text-success text-sm font-medium">✅ {todayData.workoutName}</span>
            ) : (
              <span className="text-sm text-muted-foreground">{todayData.workoutName}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streak Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Dumbbell className="text-primary" size={18} />
              <Flame className="streak-fire" size={16} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{streakData.workout}</div>
            <div className="text-xs text-muted-foreground">Workout Streak</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Target className="text-primary" size={18} />
              <Flame className="streak-fire" size={16} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{streakData.habits}</div>
            <div className="text-xs text-muted-foreground">Habit Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="btn-mobile h-12 flex-col gap-1">
            <TrendingUp size={18} />
            <span className="text-xs">Log Weight</span>
          </Button>
          <Button variant="outline" className="btn-mobile h-12 flex-col gap-1">
            <Apple size={18} />
            <span className="text-xs">Add Meal</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};