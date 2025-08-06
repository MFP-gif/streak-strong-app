import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Clock, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExercisePicker } from "@/components/ExercisePicker";
import { formatDuration, calculateVolume, getPreviousSet } from "@/utils/workout";
import { RoutineExercise } from "@/features/workout/storage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

interface SessionSet {
  weight: number | null;
  reps: number;
  completed: boolean;
}

interface SessionExercise {
  id: number;
  name: string;
  muscle: string;
  sets: SessionSet[];
  notes: string;
  isRestTimerRunning: boolean;
  isOpen: boolean;
}

export const QuickWorkoutSession = () => {
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update current time every second for duration calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate workout stats
  const completedSets = exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed).length, 0
  );
  
  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  
  const totalVolume = exercises.reduce((total, exercise) => 
    total + calculateVolume(exercise.sets.filter(set => set.completed && set.weight !== null)), 0
  );

  const duration = currentTime - startTime;

  const updateSetValue = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex !== exerciseIndex) return exercise;
      
      return {
        ...exercise,
        sets: exercise.sets.map((set, sIndex) => {
          if (sIndex !== setIndex) return set;
          
          if (field === 'weight') {
            return { ...set, weight: value === '' ? null : Number(value) };
          } else {
            return { ...set, reps: Number(value) || 0 };
          }
        })
      };
    }));
  };

  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex !== exerciseIndex) return exercise;
      
      return {
        ...exercise,
        sets: exercise.sets.map((set, sIndex) => {
          if (sIndex !== setIndex) return set;
          return { ...set, completed: !set.completed };
        })
      };
    }));
  };

  const addSet = (exerciseIndex: number) => {
    setExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex !== exerciseIndex) return exercise;
      
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet: SessionSet = {
        weight: lastSet?.weight || null,
        reps: lastSet?.reps || 10,
        completed: false
      };
      
      return {
        ...exercise,
        sets: [...exercise.sets, newSet]
      };
    }));
  };

  const updateNotes = (exerciseIndex: number, notes: string) => {
    setExercises(prev => prev.map((exercise, eIndex) => 
      eIndex === exerciseIndex ? { ...exercise, notes } : exercise
    ));
  };

  const toggleExerciseOpen = (exerciseIndex: number) => {
    setExercises(prev => prev.map((exercise, eIndex) => 
      eIndex === exerciseIndex ? { ...exercise, isOpen: !exercise.isOpen } : exercise
    ));
  };

  const handleSelectExercise = (exercise: { id: number; name: string; muscle: string }) => {
    const newExercise: SessionExercise = {
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      sets: [
        { weight: null, reps: 10, completed: false },
        { weight: null, reps: 10, completed: false },
        { weight: null, reps: 10, completed: false }
      ],
      notes: "",
      isRestTimerRunning: false,
      isOpen: true
    };

    setExercises(prev => [...prev, newExercise]);
    setShowExercisePicker(false);
  };

  const finishWorkout = () => {
    try {
      // Create session data
      const sessionData = {
        id: nanoid(),
        routineId: null, // Quick session has no routine
        routineName: "Quick Session",
        date: new Date().toISOString(),
        volume: totalVolume,
        duration: duration,
        setsCompleted: completedSets,
        totalSets: totalSets,
        isQuickSession: true,
        exercises: exercises.map(exercise => ({
          name: exercise.name,
          notes: exercise.notes,
          sets: exercise.sets.map(set => ({
            weight: set.weight || 0,
            reps: set.reps,
            completed: set.completed
          }))
        }))
      };

      // Save to sessions
      const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
      const updatedSessions = [...existingSessions, sessionData];
      localStorage.setItem("sessions", JSON.stringify(updatedSessions));

      toast({
        title: "Quick session completed! 🎉",
        description: `${completedSets} sets • ${Math.round(totalVolume)} kg total volume`,
        variant: "default"
      });

      // Navigate to home
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workout session. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/workout")}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Quick Session</h1>
              <p className="text-sm text-muted-foreground">Add exercises on the fly</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-around py-3 border-t bg-muted/30">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock size={14} />
            </div>
            <div className="font-semibold text-sm">{formatDuration(duration)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp size={14} />
            </div>
            <div className="font-semibold text-sm">{Math.round(totalVolume)} kg</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Target size={14} />
            </div>
            <div className="font-semibold text-sm">{completedSets}/{totalSets}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Add Exercise Button */}
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <Button
              onClick={() => setShowExercisePicker(true)}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus size={16} />
              Add Exercise
            </Button>
          </CardContent>
        </Card>

        {/* Exercises */}
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exerciseIndex} className="mobile-card">
            <Collapsible open={exercise.isOpen} onOpenChange={() => toggleExerciseOpen(exerciseIndex)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div>
                      <div className="font-semibold">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground font-normal">{exercise.muscle}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets.filter(set => set.completed).length}/{exercise.sets.length} sets
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea
                      placeholder="Add notes for this exercise..."
                      value={exercise.notes}
                      onChange={(e) => updateNotes(exerciseIndex, e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Sets</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSet(exerciseIndex)}
                        className="h-8 gap-1"
                      >
                        <Plus size={14} />
                        Add Set
                      </Button>
                    </div>

                    {/* Header */}
                    <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                      <div className="text-center">Set</div>
                      <div className="text-center">Previous</div>
                      <div className="text-center">Weight</div>
                      <div className="text-center">Reps</div>
                      <div className="text-center">✓</div>
                      <div></div>
                    </div>

                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-center text-sm font-medium">
                          {setIndex + 1}
                        </div>
                        <div className="text-center text-xs text-muted-foreground">
                          {getPreviousSet(exercise.id, exercise.name)}
                        </div>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="—"
                          value={set.weight === null ? '' : set.weight}
                          onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'weight', e.target.value)}
                          className="h-9 text-center text-sm"
                        />
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="0"
                          value={set.reps}
                          onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'reps', e.target.value)}
                          className="h-9 text-center text-sm"
                        />
                        <div className="flex justify-center">
                          <Checkbox
                            checked={set.completed}
                            onCheckedChange={() => toggleSetCompleted(exerciseIndex, setIndex)}
                            className="h-5 w-5"
                          />
                        </div>
                        <div></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}

        {/* Finish Workout */}
        {exercises.length > 0 && (
          <div className="pt-4">
            <Button
              onClick={finishWorkout}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Finish Quick Session
            </Button>
          </div>
        )}
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        open={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleSelectExercise}
      />
    </div>
  );
};