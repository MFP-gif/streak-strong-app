export interface WorkoutSession {
  id: string;
  routineId: string | null;
  routineName: string;
  date: string;
  duration: number;
  exercises: any[];
  isQuickSession?: boolean;
}

export interface HabitData {
  completed: number;
  target: number;
  date?: string;
}

// Get consecutive days with at least 1 finished session
export const calculateWorkoutStreak = (): number => {
  try {
    const sessions: WorkoutSession[] = JSON.parse(localStorage.getItem('sessions') || '[]');
    if (sessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, WorkoutSession[]>();
    sessions.forEach(session => {
      const date = session.date.split('T')[0]; // Get YYYY-MM-DD
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Get unique dates in descending order
    const uniqueDates = Array.from(sessionsByDate.keys()).sort().reverse();
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Start from today and count backwards
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (sessionsByDate.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating workout streak:', error);
    return 0;
  }
};

// Get consecutive days where user completed all active habits
export const calculateHabitStreak = (): number => {
  try {
    const habitsHistory = JSON.parse(localStorage.getItem('habitsHistory') || '{}');
    if (Object.keys(habitsHistory).length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    // Check each day starting from today going backwards
    for (let i = 0; i < 365; i++) { // Max 365 days to avoid infinite loop
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayData: HabitData = habitsHistory[dateStr];
      
      if (dayData && dayData.target > 0 && dayData.completed >= dayData.target) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating habit streak:', error);
    return 0;
  }
};

// Get last 7 sessions for history display
export const getRecentSessions = (limit: number = 7): WorkoutSession[] => {
  try {
    const sessions: WorkoutSession[] = JSON.parse(localStorage.getItem('sessions') || '[]');
    return sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent sessions:', error);
    return [];
  }
};

// Format date for history display
export const formatSessionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};