// Shared types for Discipra app

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

export interface SessionSet {
  exerciseId: string;
  exerciseName: string;
  muscle: string;
  weightKg: number;
  reps: number;
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

export interface UserProfile {
  name?: string;
  bio?: string;
  link?: string;
  sex?: 'male' | 'female' | 'other' | null;
  birthday?: string | null;
}

export interface Preferences {
  units: 'kg' | 'lb';
  language: 'en' | 'pt';
  privateProfile: boolean;
  hideSuggested: boolean;
  defaultWorkoutVisibility: 'private' | 'friends' | 'public';
}

export interface ProgressPhoto {
  id: string;
  date: string;
  caption?: string;
  dataUrl: string;
}

export interface UserStats {
  totalWorkouts: number;
  longestWorkoutStreak: number;
}

export type Theme = 'light' | 'dark';
export type ChartMetric = 'duration' | 'volume' | 'reps';
export type TimeWindow = 'week' | 'month' | '3m' | '6m' | 'year';