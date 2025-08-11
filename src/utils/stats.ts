import { dateKey, daysBetweenKeys, getWeekDays, isSameWeek } from './date';

// Types for data structures
export interface Session {
  id: string;
  routineId: string | null;
  routineName: string;
  date: string;
  start: string;
  end: string;
  duration: number;
  exercises: any[];
  totalReps: number;
  totalVolumeKg: number;
  isQuickSession?: boolean;
}

export interface SessionSet {
  exerciseId: string;
  exerciseName: string;
  muscle: string;
  weightKg: number;
  reps: number;
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
  weightKg?: number;
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
export const workoutStreak = (sessions: Session[]): { current: number; longest: number } => {
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
export const habitStreak = (
  habitCompletions: HabitCompletions, 
  activeCount: number
): number => {
  if (activeCount === 0) return 0;

  let streak = 0;
  const today = new Date();
  
  // Check each day starting from today going backwards
  for (let i = 0; i < 365; i++) { // Max 365 days to avoid infinite loop
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const key = dateKey(currentDate);
    
    const dayCompletions = habitCompletions[key] || {};
    const completedCount = Object.values(dayCompletions).filter(Boolean).length;
    
    // Check if ALL active habits were completed that day
    if (completedCount >= activeCount) {
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
  targetCalories: number | null,
  endDate: Date = new Date(), 
  window: number = 7
): { avg: number; goalHitRate: number } => {
  const weekDays = getWeekDays(endDate, window);
  let totalCalories = 0;
  let daysWithData = 0;
  let daysMetGoal = 0;
  
  weekDays.forEach(day => {
    const dayData = caloriesByDate[day];
    if (dayData && dayData.total > 0) {
      totalCalories += dayData.total;
      daysWithData++;
      
      // Count as goal hit if within reasonable range of target
      if (targetCalories && dayData.total <= targetCalories * 1.1) { // 10% tolerance
        daysMetGoal++;
      }
    }
  });
  
  const avg = daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0;
  const goalHitRate = daysWithData > 0 && targetCalories ? Math.round((daysMetGoal / daysWithData) * 100) : 0;
  
  return { avg, goalHitRate };
};

// Aggregate sessions for charts
export const aggregateSessions = (
  sessions: Session[],
  sessionSets: { [sessionId: string]: SessionSet[] },
  options: {
    metric: 'duration' | 'volume' | 'reps';
    window: 'week' | 'month' | '3m' | '6m' | 'year';
  }
): { labels: string[]; values: number[] } => {
  const now = new Date();
  let startDate = new Date(now);
  
  // Calculate start date based on window
  switch (options.window) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  // Filter sessions within window
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= now;
  });
  
  // Group by week for aggregation
  const groupedData = new Map<string, number>();
  
  filteredSessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const weekKey = dateKey(sessionDate);
    
    let value = 0;
    switch (options.metric) {
      case 'duration':
        value = session.duration;
        break;
      case 'volume':
        value = session.totalVolumeKg;
        break;
      case 'reps':
        value = session.totalReps;
        break;
    }
    
    groupedData.set(weekKey, (groupedData.get(weekKey) || 0) + value);
  });
  
  // Convert to arrays for chart
  const sortedEntries = Array.from(groupedData.entries()).sort();
  return {
    labels: sortedEntries.map(([date]) => formatDate(date)),
    values: sortedEntries.map(([, value]) => value)
  };
};

// Calculate muscle distribution
export const muscleDistribution = (
  sessionSets: { [sessionId: string]: SessionSet[] },
  window: 'week' | 'month' | '3m' | '6m' | 'year'
): Array<{ muscle: string; sets: number }> => {
  const now = new Date();
  let startDate = new Date(now);
  
  // Calculate start date based on window
  switch (window) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  const muscleCount = new Map<string, number>();
  
  Object.values(sessionSets).forEach(sets => {
    sets.forEach(set => {
      const muscle = set.muscle || 'Other';
      muscleCount.set(muscle, (muscleCount.get(muscle) || 0) + 1);
    });
  });
  
  return Array.from(muscleCount.entries())
    .map(([muscle, sets]) => ({ muscle, sets }))
    .sort((a, b) => b.sets - a.sets);
};

// Get recent sessions for display
export const getRecentSessions = (sessions: Session[], limit: number = 7): Session[] => {
  return sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Get weekly sessions for current week
export const getWeeklySessions = (sessions: Session[]): Session[] => {
  const today = new Date();
  return sessions.filter(session => 
    isSameWeek(session.date.split('T')[0], dateKey(today))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Check if there's a session today
export const getTodaySession = (sessions: Session[]): Session | null => {
  const today = dateKey();
  return sessions.find(session => session.date.startsWith(today)) || null;
};

// Backward compatibility aliases
export const recalcWorkoutStreak = workoutStreak;
export const recalcHabitStreak = (habitCompletions: HabitCompletions, habits: Habit[]): number => {
  const activeHabits = habits.filter(h => h.type === 'do');
  return habitStreak(habitCompletions, activeHabits.length);
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}