import { useState, useEffect } from "react";
import { Calendar, Flame, Target, TrendingUp, Dumbbell, Apple, Camera, Plus, Play, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dateKey, getWeekDays, isSameWeek } from "@/utils/date";
import { workoutStreak, habitStreak, getTodaySession, getWeeklySessions } from "@/utils/stats";
import type { Session, Habit, CaloriesByDate, HabitCompletions, MealEntry, Measurement } from "@/types";

export const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletions>({});
  const [caloriesByDate, setCaloriesByDate] = useState<CaloriesByDate>({});
  const [nutrition, setNutrition] = useState<{ targetCalories: number | null }>({ targetCalories: null });
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  
  const [workoutStreakData, setWorkoutStreakData] = useState({ current: 0, longest: 0 });
  const [habitStreakData, setHabitStreakData] = useState(0);
  const [todayData, setTodayData] = useState({
    caloriesConsumed: 0,
    caloriesTarget: 0,
    workoutCompleted: false,
    workoutName: "None yet",
    habitsCompleted: 0,
    habitsTotal: 0
  });
  
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  
  const [mealForm, setMealForm] = useState({
    type: 'breakfast' as MealEntry['type'],
    name: '',
    calories: '',
    time: new Date().toTimeString().slice(0, 5)
  });
  
  const [weightForm, setWeightForm] = useState({
    date: dateKey(),
    weight: ''
  });
  
  const [habitForm, setHabitForm] = useState({
    name: '',
    type: 'do' as 'do' | 'avoid',
    category: 'health'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const today = dateKey();
    
    // Load all data
    const sessionsData: Session[] = JSON.parse(localStorage.getItem('sessions') || '[]');
    const habitsData: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
    const habitCompletionsData: HabitCompletions = JSON.parse(localStorage.getItem('habitCompletions') || '{}');
    const caloriesData: CaloriesByDate = JSON.parse(localStorage.getItem('caloriesByDate') || '{}');
    const nutritionData = JSON.parse(localStorage.getItem('nutrition') || '{"targetCalories":null}');
    const measurementsData = JSON.parse(localStorage.getItem('measurements') || '[]');
    
    setSessions(sessionsData);
    setHabits(habitsData);
    setHabitCompletions(habitCompletionsData);
    setCaloriesByDate(caloriesData);
    setNutrition(nutritionData);
    setMeasurements(measurementsData);
    
    // Calculate streaks
    const workoutStreaks = workoutStreak(sessionsData);
    const habitStreaks = habitStreak(habitCompletionsData, habitsData.filter(h => h.type === 'do').length);
    
    setWorkoutStreakData(workoutStreaks);
    setHabitStreakData(habitStreaks);
    
    // Today's data
    const todayCalories = caloriesData[today] || { total: 0, byMeal: [] };
    const todayCompletions = habitCompletionsData[today] || {};
    const completedToday = Object.values(todayCompletions).filter(Boolean).length;
    const todaySession = getTodaySession(sessionsData);
    
    setTodayData({
      caloriesConsumed: todayCalories.total,
      caloriesTarget: nutritionData.targetCalories || 0,
      workoutCompleted: !!todaySession,
      workoutName: todaySession ? (todaySession.isQuickSession ? "Quick Session" : todaySession.routineName) : "None yet",
      habitsCompleted: completedToday,
      habitsTotal: habitsData.length
    });
  };

  const handleAddMeal = () => {
    if (!mealForm.name || !mealForm.calories) return;
    
    const today = dateKey();
    const newMeal: MealEntry = {
      type: mealForm.type,
      name: mealForm.name,
      calories: parseInt(mealForm.calories),
      time: mealForm.time
    };
    
    const updatedCalories = { ...caloriesByDate };
    if (!updatedCalories[today]) {
      updatedCalories[today] = { total: 0, byMeal: [] };
    }
    
    updatedCalories[today].byMeal.push(newMeal);
    updatedCalories[today].total += newMeal.calories;
    
    setCaloriesByDate(updatedCalories);
    localStorage.setItem('caloriesByDate', JSON.stringify(updatedCalories));
    
    toast({ title: "Meal added", description: `${newMeal.name} (${newMeal.calories} cal) logged` });
    setMealForm({ type: 'breakfast', name: '', calories: '', time: new Date().toTimeString().slice(0, 5) });
    setIsLogMealOpen(false);
    loadData(); // Refresh to update progress
  };

  const handleLogWeight = () => {
    if (!weightForm.date || !weightForm.weight) return;
    
    const newMeasurement = { 
      id: `measurement_${Date.now()}`,
      date: weightForm.date, 
      weightKg: parseFloat(weightForm.weight) 
    };
    
    const updatedMeasurements = [newMeasurement, ...measurements];
    setMeasurements(updatedMeasurements);
    localStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
    
    toast({ title: "Weight logged", description: `${newMeasurement.weightKg} kg recorded` });
    setWeightForm({ date: dateKey(), weight: '' });
    setIsLogWeightOpen(false);
  };

  const handleAddHabit = () => {
    if (!habitForm.name.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      ...habitForm,
      name: habitForm.name.trim(),
      streak: 0,
      completed: false
    };
    
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    
    toast({ title: "Habit added", description: `${newHabit.name} has been added` });
    setHabitForm({ name: '', type: 'do', category: 'health' });
    setIsAddHabitOpen(false);
    loadData(); // Refresh to update progress
  };

  const weeklyWorkouts = getWeeklySessions(sessions);
  const weekDays = getWeekDays();
  
  const calorieProgress = todayData.caloriesTarget > 0 ? (todayData.caloriesConsumed / todayData.caloriesTarget) * 100 : 0;
  const habitProgress = todayData.habitsTotal > 0 ? (todayData.habitsCompleted / todayData.habitsTotal) * 100 : 0;

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good morning ☀️";
    if (hour >= 12 && hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

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
          <span className="text-lg font-bold text-foreground">{Math.max(workoutStreakData.current, habitStreakData)}</span>
        </div>
      </div>

      {/* Today's Progress */}
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
                {todayData.caloriesConsumed} / {todayData.caloriesTarget || "—"}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3" />
            {todayData.caloriesTarget === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/nutrition')}>
                  Set target
                </Button> to start tracking
              </p>
            )}
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
            {todayData.habitsTotal === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsAddHabitOpen(true)}>
                  Add a habit
                </Button> to start tracking
              </p>
            )}
          </div>

          {/* Workout Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Today's Workout</span>
            <div className="flex items-center gap-2">
              {todayData.workoutCompleted ? (
                <>
                  <span className="text-success text-sm font-medium">✅ {todayData.workoutName}</span>
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                    View
                  </Button>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">{todayData.workoutName}</span>
              )}
            </div>
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
            <div className="text-2xl font-bold text-foreground mb-1">{workoutStreakData.current}</div>
            <div className="text-xs text-muted-foreground">Workout Streak</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Target className="text-primary" size={18} />
              <Flame className="streak-fire" size={16} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{habitStreakData}</div>
            <div className="text-xs text-muted-foreground">Habit Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Workout History */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock size={20} />
            This Week's Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((dayKey, index) => {
              const dayName = new Date(dayKey).toLocaleDateString('en-US', { weekday: 'short' });
              const dayWorkouts = weeklyWorkouts.filter(session => 
                session.date.startsWith(dayKey)
              );
              const hasWorkout = dayWorkouts.length > 0;
              
              return (
                <div key={dayKey} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{dayName}</div>
                  <div className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                    hasWorkout 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hasWorkout ? dayWorkouts.length : '—'}
                  </div>
                  {hasWorkout && (
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {dayWorkouts[0].isQuickSession ? 'Quick' : dayWorkouts[0].routineName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Dialog open={isLogWeightOpen} onOpenChange={setIsLogWeightOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-mobile h-16 flex-col gap-1">
                <TrendingUp size={18} />
                <span className="text-xs">Log Weight</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Weight</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={weightForm.date} 
                    onChange={(e) => setWeightForm(prev => ({ ...prev, date: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={weightForm.weight} 
                    onChange={(e) => setWeightForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g., 70.5" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLogWeightOpen(false)}>Cancel</Button>
                <Button onClick={handleLogWeight} disabled={!weightForm.date || !weightForm.weight}>
                  Log Weight
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isLogMealOpen} onOpenChange={setIsLogMealOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-mobile h-16 flex-col gap-1">
                <Apple size={18} />
                <span className="text-xs">Add Meal</span>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Food Name</Label>
                  <Input 
                    value={mealForm.name} 
                    onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Chicken breast" 
                  />
                </div>
                <div>
                  <Label>Calories</Label>
                  <Input 
                    type="number" 
                    value={mealForm.calories} 
                    onChange={(e) => setMealForm(prev => ({ ...prev, calories: e.target.value }))}
                    placeholder="e.g., 200" 
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time" 
                    value={mealForm.time} 
                    onChange={(e) => setMealForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLogMealOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMeal} disabled={!mealForm.name || !mealForm.calories}>
                  Add Meal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="btn-mobile h-16 flex-col gap-1"
            onClick={() => navigate('/workout/quick')}
          >
            <Play size={18} />
            <span className="text-xs">Quick Workout</span>
          </Button>

          <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-mobile h-16 flex-col gap-1">
                <Plus size={18} />
                <span className="text-xs">Add Habit</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Habit Name</Label>
                  <Input 
                    value={habitForm.name} 
                    onChange={(e) => setHabitForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Drink 8 glasses of water" 
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={habitForm.type} onValueChange={(value: 'do' | 'avoid') => setHabitForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="do">✅ Do</SelectItem>
                      <SelectItem value="avoid">❌ Avoid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddHabitOpen(false)}>Cancel</Button>
                <Button onClick={handleAddHabit} disabled={!habitForm.name.trim()}>
                  Add Habit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};