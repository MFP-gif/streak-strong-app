import { useState, useEffect } from "react";
import { Plus, Play, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewRoutineDialog } from "@/components/NewRoutineDialog";
import { getRoutines, saveRoutine, WorkoutRoutine } from "@/features/workout/storage";
import { useToast } from "@/hooks/use-toast";

export const Workout = () => {
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const { toast } = useToast();

  // Load routines from localStorage on mount
  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  // Legacy mock data for display purposes
  const mockWorkoutRoutines = [
    {
      id: "mock-1",
      name: "Push Day",
      exercises: ["Bench Press", "Overhead Press", "Dips"],
      duration: "45 min",
      lastPerformed: "2 days ago"
    },
    {
      id: "mock-2",
      name: "Pull Day", 
      exercises: ["Pull-ups", "Rows", "Bicep Curls"],
      duration: "40 min",
      lastPerformed: "3 days ago"
    },
    {
      id: "mock-3",
      name: "Leg Day",
      exercises: ["Squats", "Deadlifts", "Lunges"],
      duration: "50 min", 
      lastPerformed: "1 week ago"
    }
  ];

  // Combine real routines with mock data for now
  const displayRoutines = [
    ...routines.map(routine => ({
      id: routine.id,
      name: routine.name,
      exercises: routine.exercises.map(ex => ex.name),
      duration: `${routine.exercises.length * 5} min`, // Estimate based on exercise count
      lastPerformed: "Never"
    })),
    ...mockWorkoutRoutines
  ];

  const recentWorkouts = [
    { date: "Today", routine: "Push Day", duration: "42 min" },
    { date: "2 days ago", routine: "Full Body", duration: "38 min" },
    { date: "4 days ago", routine: "Pull Day", duration: "45 min" }
  ];

  const handleSaveRoutine = (routineData: { name: string; exercises: any[] }) => {
    try {
      // Validation
      if (!routineData.name.trim()) {
        toast({
          title: "Error",
          description: "Routine name cannot be blank",
          variant: "destructive"
        });
        return;
      }

      if (routineData.exercises.length === 0) {
        toast({
          title: "Error", 
          description: "At least one exercise is required",
          variant: "destructive"
        });
        return;
      }

      // Save to localStorage
      const savedRoutine = saveRoutine(routineData.name, routineData.exercises);
      
      // Refresh the list
      setRoutines(getRoutines());
      
      // Show success toast
      toast({
        title: "Routine saved ✅",
        description: `"${savedRoutine.name}" has been added to your routines`,
        variant: "default"
      });

      setShowNewRoutine(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save routine. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
          <p className="text-muted-foreground">Choose your routine</p>
        </div>
        <Button 
          size="sm" 
          className="btn-mobile gap-2"
          onClick={() => setShowNewRoutine(true)}
        >
          <Plus size={16} />
          New Routine
        </Button>
      </div>

      {/* Quick Start */}
      <Card className="mobile-card mb-6 gradient-primary text-primary-foreground">
        <CardContent className="p-4 text-center">
          <h3 className="font-bold text-lg mb-2">Ready to train?</h3>
          <p className="text-sm opacity-90 mb-4">Start a quick workout or choose a routine</p>
          <Button variant="secondary" className="btn-mobile gap-2">
            <Play size={16} />
            Quick Start
          </Button>
        </CardContent>
      </Card>

      {/* Workout Routines */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Routines</h2>
        <div className="space-y-3">
          {displayRoutines.map((routine) => (
            <Card key={routine.id} className="mobile-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{routine.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock size={14} />
                    {routine.duration}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {routine.exercises.map((exercise, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {exercise}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last: {routine.lastPerformed}
                  </span>
                  <Button size="sm" className="btn-mobile gap-2">
                    <Play size={14} />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-sm">{workout.routine}</div>
                <div className="text-xs text-muted-foreground">{workout.date}</div>
              </div>
              <div className="text-sm text-muted-foreground">{workout.duration}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <NewRoutineDialog
        open={showNewRoutine}
        onClose={() => setShowNewRoutine(false)}
        onSave={handleSaveRoutine}
      />
    </div>
  );
};