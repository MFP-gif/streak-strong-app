import { nanoid } from 'nanoid';

export interface RoutineExercise {
  id: number;
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}

const STORAGE_KEY = 'routines';

export const getRoutines = (): WorkoutRoutine[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading routines from localStorage:', error);
    return [];
  }
};

export const saveRoutine = (name: string, exercises: RoutineExercise[]): WorkoutRoutine => {
  const routine: WorkoutRoutine = {
    id: nanoid(),
    name,
    exercises,
    createdAt: new Date().toISOString()
  };

  try {
    const existingRoutines = getRoutines();
    const updatedRoutines = [...existingRoutines, routine];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutines));
    return routine;
  } catch (error) {
    console.error('Error saving routine to localStorage:', error);
    throw new Error('Failed to save routine');
  }
};

export const deleteRoutine = (id: string): void => {
  try {
    const existingRoutines = getRoutines();
    const updatedRoutines = existingRoutines.filter(routine => routine.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutines));
  } catch (error) {
    console.error('Error deleting routine from localStorage:', error);
    throw new Error('Failed to delete routine');
  }
};