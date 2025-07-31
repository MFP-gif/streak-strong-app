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

export const getPreviousSet = (exerciseId: number): string => {
  try {
    const sessions: SessionData[] = JSON.parse(localStorage.getItem("sessions") || "[]");
    
    // Find the most recent session that has this exercise with completed sets
    const relevantSessions = sessions
      .filter(session => 
        session.exercises.some(ex => 
          ex.name && ex.sets.some(set => set.completed)
        )
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const session of relevantSessions) {
      const exercise = session.exercises.find(ex => ex.name);
      if (exercise) {
        const completedSets = exercise.sets.filter(set => set.completed);
        if (completedSets.length > 0) {
          const lastSet = completedSets[completedSets.length - 1];
          return `${lastSet.weight}×${lastSet.reps}`;
        }
      }
    }
    
    return "–";
  } catch (error) {
    return "–";
  }
};