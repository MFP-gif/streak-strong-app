import { useState, useEffect } from "react";
import { Calendar, Flame, Target, TrendingUp, Dumbbell, Apple, Camera, Plus, Play, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dateKey, formatDate } from "@/utils/date";
import { recalcWorkoutStreak, recalcHabitStreak, getRecentSessions, getTodaySession } from "@/utils/stats";
import type { Session, Habit, CaloriesByDate, HabitCompletions } from "@/types";

export const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [habitStreak, setHabitStreak] = useState(0);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [todayData, setTodayData] = useState({
    caloriesConsumed: 0,
    caloriesTarget: 0,
    workoutCompleted: false,
    workoutName: "None yet",
    habitsCompleted: 0,
    habitsTotal: 0
  });

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good morning ☀️";
    if (hour >= 12 && hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

  // Load and calculate all data
  const loadData = () => {
    const today = dateKey();
    
    // Load sessions
    const sessions: Session[] = JSON.parse(localStorage.getItem('sessions') || '[]');
    
    // Load calories for today
    const caloriesByDate: CaloriesByDate = JSON.parse(localStorage.getItem('caloriesByDate') || '{}');
    const todayCalories = caloriesByDate[today] || { total: 0, byMeal: [] };
    
    // Load habits and completions
    const habits: Habit[] = JSON.parse(localStorage.getItem('habits') || '[]');
    const habitCompletions: HabitCompletions = JSON.parse(localStorage.getItem('habitCompletions') || '{}');
    const todayCompletions = habitCompletions[today] || {};
    const completedToday = Object.values(todayCompletions).filter(Boolean).length;
    
    // Get today's workout
    const todaySession = getTodaySession(sessions);
    
    // Calculate streaks
    const workoutStreakData = recalcWorkoutStreak(sessions);
    const currentHabitStreak = recalcHabitStreak(habitCompletions, habits);
    
    setWorkoutStreak(workoutStreakData.current);
    setHabitStreak(currentHabitStreak);
    setRecentSessions(getRecentSessions(sessions, 7));
    
    setTodayData({
      caloriesConsumed: todayCalories.total,
      caloriesTarget: 0, // Default to 0 to show empty state
      workoutCompleted: !!todaySession,
      workoutName: todaySession ? (todaySession.isQuickSession ? "Quick Session" : todaySession.routineName) : "None yet",
      habitsCompleted: completedToday,
      habitsTotal: habits.length
    });
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <span className="text-lg font-bold text-foreground">{Math.max(workoutStreak, habitStreak)}</span>
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
                {todayData.caloriesConsumed} / {todayData.caloriesTarget || "—"}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3" />
            {todayData.caloriesTarget === 0 && (
              <p className="text-xs text-muted-foreground mt-1">Add a meal to start tracking</p>
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
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/habits')}>
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
            <div className="text-2xl font-bold text-foreground mb-1">{workoutStreak}</div>
            <div className="text-xs text-muted-foreground">Workout Streak</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Target className="text-primary" size={18} />
              <Flame className="streak-fire" size={16} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{habitStreak}</div>
            <div className="text-xs text-muted-foreground">Habit Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Workout History */}
      {recentSessions.length > 0 && (
        <Card className="mobile-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock size={20} />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recentSessions.map((session) => {
                const dayName = new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' });
                const routineName = session.isQuickSession ? "Quick" : session.routineName;
                return (
                  <Button
                    key={session.id}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 h-auto py-2 px-3 flex-col gap-1"
                    onClick={() => navigate(`/history/${session.id}`)}
                  >
                    <span className="text-xs font-medium">{dayName}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-20">
                      {routineName}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="btn-mobile h-16 flex-col gap-1"
            onClick={() => navigate('/profile')}
          >
            <TrendingUp size={18} />
            <span className="text-xs">Log Weight</span>
          </Button>
          <Button 
            variant="outline" 
            className="btn-mobile h-16 flex-col gap-1"
            onClick={() => navigate('/nutrition')}
          >
            <Apple size={18} />
            <span className="text-xs">Add Meal</span>
          </Button>
          <Button 
            variant="outline" 
            className="btn-mobile h-16 flex-col gap-1"
            onClick={() => navigate('/workout/quick')}
          >
            <Play size={18} />
            <span className="text-xs">Quick Workout</span>
          </Button>
          <Button 
            variant="outline" 
            className="btn-mobile h-16 flex-col gap-1"
            onClick={() => navigate('/habits')}
          >
            <Plus size={18} />
            <span className="text-xs">Add Habit</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};