interface Set {
  weight: number;
  reps: number;
}

interface SessionData {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  volume: number;
  duration: number;
  setsCompleted: number;
  totalSets: number;
  exercises: {
    name: string;
    notes: string;
    sets: {
      weight: number;
      reps: number;
      completed: boolean;
    }[];
  }[];
}

export const calculateVolume = (sets: Set[]): number => {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getPreviousSet = (exerciseId: number, exerciseName: string): string => {
  try {
    const sessions: SessionData[] = JSON.parse(localStorage.getItem("sessions") || "[]");
    
    // Sort sessions by date (most recent first)
    const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Find the most recent session that has this specific exercise with completed sets
    for (const session of sortedSessions) {
      const exercise = session.exercises.find(ex => ex.name === exerciseName);
      if (exercise) {
        const completedSets = exercise.sets.filter(set => set.completed);
        if (completedSets.length > 0) {
          const lastSet = completedSets[completedSets.length - 1];
          return `${lastSet.weight} kg × ${lastSet.reps}`;
        }
      }
    }
    
    return "–";
  } catch (error) {
    return "–";
  }
};