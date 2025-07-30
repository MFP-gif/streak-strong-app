import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getRoutines, WorkoutRoutine } from "@/features/workout/storage";
import { calculateVolume, formatDuration } from "@/utils/workout";
import { useToast } from "@/hooks/use-toast";

interface SessionSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface SessionExercise {
  exerciseId: number;
  name: string;
  muscle: string;
  notes: string;
  restTimer: boolean;
  sets: SessionSet[];
  isOpen: boolean;
}

export const WorkoutSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load routine
  useEffect(() => {
    if (id) {
      const routines = getRoutines();
      const foundRoutine = routines.find(r => r.id === id);
      
      if (foundRoutine) {
        setRoutine(foundRoutine);
        
        // Initialize session exercises
        const sessionExercises: SessionExercise[] = foundRoutine.exercises.map(ex => ({
          exerciseId: ex.id,
          name: ex.name,
          muscle: ex.muscle,
          notes: "",
          restTimer: false,
          isOpen: true,
          sets: Array.from({ length: ex.sets }, (_, index) => ({
            id: `${ex.id}-${index}`,
            weight: ex.weight || 0,
            reps: ex.reps,
            completed: false
          }))
        }));
        
        setExercises(sessionExercises);
      } else {
        toast({
          title: "Routine not found",
          description: "The requested workout routine could not be found.",
          variant: "destructive"
        });
        navigate("/workout");
      }
    }
  }, [id, navigate, toast]);

  const updateSetValue = (exerciseId: number, setId: string, field: 'weight' | 'reps', value: number) => {
    setExercises(prev => prev.map(ex => 
      ex.exerciseId === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId 
                ? { ...set, [field]: value }
                : set
            )
          }
        : ex
    ));
  };

  const toggleSetCompleted = (exerciseId: number, setId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.exerciseId === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId 
                ? { ...set, completed: !set.completed }
                : set
            )
          }
        : ex
    ));
  };

  const addSet = (exerciseId: number) => {
    setExercises(prev => prev.map(ex => 
      ex.exerciseId === exerciseId 
        ? {
            ...ex,
            sets: [
              ...ex.sets,
              {
                id: `${exerciseId}-${ex.sets.length}`,
                weight: ex.sets[ex.sets.length - 1]?.weight || 0,
                reps: ex.sets[ex.sets.length - 1]?.reps || 10,
                completed: false
              }
            ]
          }
        : ex
    ));
  };

  const updateNotes = (exerciseId: number, notes: string) => {
    setExercises(prev => prev.map(ex => 
      ex.exerciseId === exerciseId ? { ...ex, notes } : ex
    ));
  };

  const toggleExerciseOpen = (exerciseId: number) => {
    setExercises(prev => prev.map(ex => 
      ex.exerciseId === exerciseId ? { ...ex, isOpen: !ex.isOpen } : ex
    ));
  };

  const finishWorkout = () => {
    if (!routine) return;

    const completedSets = exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
    
    const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
    
    const volume = calculateVolume(exercises.flatMap(ex => 
      ex.sets.filter(set => set.completed)
    ));
    
    const duration = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);

    // Save session to localStorage
    const session = {
      id: Date.now().toString(),
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      volume,
      duration,
      setsCompleted: completedSets,
      totalSets,
      exercises: exercises.map(ex => ({
        name: ex.name,
        notes: ex.notes,
        sets: ex.sets.map(set => ({
          weight: set.weight,
          reps: set.reps,
          completed: set.completed
        }))
      }))
    };

    try {
      const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
      localStorage.setItem("sessions", JSON.stringify([...existingSessions, session]));
      
      toast({
        title: "Workout completed! 🎉",
        description: `${completedSets}/${totalSets} sets • ${volume.toFixed(1)}kg volume`,
        variant: "default"
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error saving workout",
        description: "Failed to save your workout session.",
        variant: "destructive"
      });
    }
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-6xl animate-pulse">💪</div>
      </div>
    );
  }

  const completedSets = exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0
  );
  
  const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
  
  const volume = calculateVolume(exercises.flatMap(ex => 
    ex.sets.filter(set => set.completed)
  ));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/workout")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <Button
            onClick={finishWorkout}
            className="btn-mobile"
          >
            Finish
          </Button>
        </div>

        {/* Routine Name & Stats */}
        <Collapsible open={!isHeaderCollapsed} onOpenChange={setIsHeaderCollapsed}>
          <div className="px-4 pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <h1 className="text-xl font-bold text-foreground">{routine.name}</h1>
                {isHeaderCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="text-lg font-bold">{formatDuration(currentTime.getTime() - startTime.getTime())}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="text-lg font-bold">{volume.toFixed(1)}kg</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Sets</div>
                  <div className="text-lg font-bold">{completedSets}/{totalSets}</div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-4">
        {exercises.map((exercise) => (
          <Card key={exercise.exerciseId} className="mobile-card">
            <CardContent className="p-4">
              <Collapsible open={exercise.isOpen} onOpenChange={() => toggleExerciseOpen(exercise.exerciseId)}>
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-3">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex-1 justify-start p-0 h-auto">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        💪
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-primary">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground">{exercise.muscle}</div>
                      </div>
                      {exercise.isOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </div>

                <CollapsibleContent>
                  {/* Notes */}
                  <div className="mb-4">
                    <Textarea
                      placeholder="Add notes here..."
                      value={exercise.notes}
                      onChange={(e) => updateNotes(exercise.exerciseId, e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  {/* Rest Timer Toggle */}
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      id={`rest-${exercise.exerciseId}`}
                      checked={exercise.restTimer}
                      onCheckedChange={(checked) => {
                        setExercises(prev => prev.map(ex => 
                          ex.exerciseId === exercise.exerciseId 
                            ? { ...ex, restTimer: !!checked }
                            : ex
                        ));
                      }}
                    />
                    <label htmlFor={`rest-${exercise.exerciseId}`} className="text-sm text-muted-foreground">
                      Rest timer
                    </label>
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium">
                      <div className="text-center">#</div>
                      <div className="text-center">Previous</div>
                      <div className="text-center">KG</div>
                      <div className="text-center">REPS</div>
                      <div className="text-center">✓</div>
                    </div>

                    {exercise.sets.map((set, index) => (
                      <div key={set.id} className="grid grid-cols-5 gap-2 items-center">
                        <div className="text-center text-sm font-medium">
                          {index + 1}
                        </div>
                        
                        <div className="text-center text-xs text-muted-foreground">
                          -
                        </div>
                        
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSetValue(exercise.exerciseId, set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="h-8 text-center text-sm"
                          min="0"
                          step="0.5"
                        />
                        
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSetValue(exercise.exerciseId, set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="h-8 text-center text-sm"
                          min="0"
                        />
                        
                        <div className="flex justify-center">
                          <Checkbox
                            checked={set.completed}
                            onCheckedChange={() => toggleSetCompleted(exercise.exerciseId, set.id)}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Set Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addSet(exercise.exerciseId)}
                      className="w-full gap-2"
                    >
                      <Plus size={14} />
                      Add Set
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};