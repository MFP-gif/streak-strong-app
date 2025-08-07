import { dateKey, daysBetweenKeys, getWeekDays } from './date';

// Types for data structures
export interface Session {
  id: string;
  routineId: string | null;
  routineName: string;
  date: string;
  duration: number;
  exercises: any[];
  isQuickSession?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  type: 'do' | 'avoid';
  category: string;
  streak: number;
  completed: boolean;
}

export interface HabitCompletions {
  [dateKey: string]: { [habitId: string]: boolean };
}

export interface CaloriesByDate {
  [dateKey: string]: {
    total: number;
    byMeal: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink' | 'other';
      name: string;
      calories: number;
      time: string;
    }[];
  };
}

export interface Measurement {
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  bodyFat?: number;
}

export interface UserStats {
  totalWorkouts: number;
  longestWorkoutStreak: number;
}

// Calculate workout streak: consecutive days with ≥1 finished session
export const recalcWorkoutStreak = (sessions: Session[]): { current: number; longest: number } => {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  // Group sessions by date
  const sessionsByDate = new Map<string, Session[]>();
  sessions.forEach(session => {
    const key = session.date.split('T')[0]; // Extract date part
    if (!sessionsByDate.has(key)) {
      sessionsByDate.set(key, []);
    }
    sessionsByDate.get(key)!.push(session);
  });

  // Get unique dates sorted ascending
  const uniqueDates = Array.from(sessionsByDate.keys()).sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Check from today backwards for current streak
  const today = dateKey();
  let checkDate = new Date();
  
  while (true) {
    const checkKey = dateKey(checkDate);
    if (sessionsByDate.has(checkKey)) {
      currentStreak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
    
    // Prevent infinite loop
    if (currentStreak > 365) break;
  }

  // Calculate longest streak by checking all consecutive sequences
  for (let i = 0; i < uniqueDates.length; i++) {
    tempStreak = 1;
    
    for (let j = i + 1; j < uniqueDates.length; j++) {
      const daysBetween = daysBetweenKeys(uniqueDates[j - 1], uniqueDates[j]);
      if (daysBetween === 1) {
        tempStreak++;
      } else {
        break;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { current: currentStreak, longest: longestStreak };
};

// Calculate habit streak: consecutive days where ALL active habits were completed
export const recalcHabitStreak = (
  habitCompletions: HabitCompletions, 
  habits: Habit[]
): number => {
  const activeHabits = habits.filter(h => h.type === 'do'); // Only count 'do' habits for streak
  
  if (activeHabits.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  
  // Check each day starting from today going backwards
  for (let i = 0; i < 365; i++) { // Max 365 days to avoid infinite loop
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const key = dateKey(currentDate);
    
    const dayCompletions = habitCompletions[key] || {};
    
    // Check if ALL active habits were completed that day
    const allCompleted = activeHabits.every(habit => dayCompletions[habit.id] === true);
    
    if (allCompleted) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate weekly calories summary
export const weeklyCalories = (
  caloriesByDate: CaloriesByDate, 
  endDate: Date = new Date(), 
  window: number = 7
): { avg: number; goalHitRate: number } => {
  const weekDays = getWeekDays(endDate, window);
  let totalCalories = 0;
  let daysWithData = 0;
  let daysMetGoal = 0;
  const defaultTarget = 2200; // Default calorie target
  
  weekDays.forEach(day => {
    const dayData = caloriesByDate[day];
    if (dayData && dayData.total > 0) {
      totalCalories += dayData.total;
      daysWithData++;
      
      // Count as goal hit if within reasonable range of target
      if (dayData.total <= defaultTarget * 1.1) { // 10% tolerance
        daysMetGoal++;
      }
    }
  });
  
  const avg = daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0;
  const goalHitRate = daysWithData > 0 ? Math.round((daysMetGoal / daysWithData) * 100) : 0;
  
  return { avg, goalHitRate };
};

// Get recent sessions for display
export const getRecentSessions = (sessions: Session[], limit: number = 7): Session[] => {
  return sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Check if there's a session today
export const getTodaySession = (sessions: Session[]): Session | null => {
  const today = dateKey();
  return sessions.find(session => session.date.startsWith(today)) || null;
};