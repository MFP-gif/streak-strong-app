import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { dateKey, startOfWeek, isSameWeek } from "@/utils/date";
import type { Session, Habit, HabitCompletions } from "@/types";

export const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletions>({});

  useEffect(() => {
    const loadData = () => {
      const sessionsData = JSON.parse(localStorage.getItem('sessions') || '[]');
      const habitsData = JSON.parse(localStorage.getItem('habits') || '[]');
      const habitCompletionsData = JSON.parse(localStorage.getItem('habitCompletions') || '{}');
      
      setSessions(sessionsData);
      setHabits(habitsData);
      setHabitCompletions(habitCompletionsData);
    };

    loadData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Get the first Monday of the week containing the first day
    const startWeek = startOfWeek(firstDay, 1);
    // Get the last Sunday of the week containing the last day
    const endWeek = new Date(lastDay);
    endWeek.setDate(endWeek.getDate() + (7 - ((endWeek.getDay() + 6) % 7)));
    
    const days = [];
    const current = new Date(startWeek);
    
    while (current <= endWeek) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getSessionsForDate = (date: Date) => {
    const key = dateKey(date);
    return sessions.filter(session => session.date === key);
  };

  const getHabitsCompletedForDate = (date: Date) => {
    const key = dateKey(date);
    const completions = habitCompletions[key] || {};
    const activeHabits = habits.filter(h => h.id); // assuming all habits in array are active
    const completedCount = activeHabits.filter(habit => completions[habit.id]).length;
    return { completed: completedCount, total: activeHabits.length };
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Your workout and habit history</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{monthName}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const sessionsForDay = getSessionsForDate(day);
              const habitsForDay = getHabitsCompletedForDate(day);
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDay = isToday(day);
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square p-1 border rounded-lg flex flex-col items-center justify-center text-sm
                    ${isCurrentMonthDay ? 'bg-background' : 'bg-muted/50 text-muted-foreground'}
                    ${isTodayDay ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  <div className="font-medium">{day.getDate()}</div>
                  
                  <div className="flex gap-1 mt-1">
                    {/* Workout indicator */}
                    {sessionsForDay.length > 0 && (
                      <div 
                        className="w-2 h-2 rounded-full bg-primary"
                        title={`${sessionsForDay.length} workout${sessionsForDay.length > 1 ? 's' : ''}`}
                      />
                    )}
                    
                    {/* Habits indicator */}
                    {habitsForDay.total > 0 && (
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          habitsForDay.completed === habitsForDay.total 
                            ? 'bg-green-500' 
                            : habitsForDay.completed > 0 
                              ? 'bg-yellow-500' 
                              : 'bg-muted-foreground'
                        }`}
                        title={`Habits: ${habitsForDay.completed}/${habitsForDay.total}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Legend:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Workouts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>All habits completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Some habits completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <span>No habits completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};