import { useState, useEffect } from "react";
import { Plus, Play, Clock, TrendingUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NewRoutineDialog } from "@/components/NewRoutineDialog";
import { getRoutines, saveRoutine, deleteRoutine, WorkoutRoutine } from "@/features/workout/storage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Workout = () => {
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load routines from localStorage on mount
  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  // Clear any legacy demo routines on first load
  useEffect(() => {
    const routines = getRoutines();
    const legacyRoutineNames = ["Push Day", "Pull Day", "Leg Day"];
    const hasLegacyRoutines = routines.some(routine => 
      legacyRoutineNames.includes(routine.name)
    );
    
    if (hasLegacyRoutines) {
      // Clear all routines to remove legacy ones
      localStorage.removeItem("routines");
      setRoutines([]);
    }
  }, []);

  // Display only real user routines
  const displayRoutines = routines.map(routine => ({
    id: routine.id,
    name: routine.name,
    exercises: routine.exercises.map(ex => ex.name),
    duration: `${routine.exercises.length * 5} min`, // Estimate based on exercise count
    lastPerformed: "Never"
  }));

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

  const handleDeleteRoutine = (routineId: string, routineName: string) => {
    try {
      deleteRoutine(routineId);
      setRoutines(getRoutines());
      toast({
        title: "Routine deleted",
        description: `"${routineName}" has been removed`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete routine. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStartWorkout = (routineId: string) => {
    navigate(`/workout/${routineId}/session`);
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
          <Button 
            variant="secondary" 
            className="btn-mobile gap-2"
            onClick={() => navigate("/workout/quick")}
          >
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
                  <div className="flex items-center gap-2">
                    {/* Show delete for all routines */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete routine</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete routine "{routine.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteRoutine(routine.id, routine.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button 
                      size="sm" 
                      className="btn-mobile gap-2"
                      onClick={() => handleStartWorkout(routine.id)}
                    >
                      <Play size={14} />
                      Start
                    </Button>
                  </div>
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