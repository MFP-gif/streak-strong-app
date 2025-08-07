// Shared types for Discipra app

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

export interface MealEntry {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink' | 'other';
  name: string;
  calories: number;
  time: string;
}

export interface CaloriesByDate {
  [dateKey: string]: {
    total: number;
    byMeal: MealEntry[];
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

export type Theme = 'light' | 'dark';