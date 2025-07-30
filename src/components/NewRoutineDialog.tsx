import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { saveRoutine } from "@/features/workout/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExercisePicker } from "./ExercisePicker";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
}

interface RoutineExercise extends Exercise {
  sets: number;
  reps: number;
}

interface NewRoutineDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (routine: { name: string; exercises: RoutineExercise[] }) => void;
}

export const NewRoutineDialog = ({ open, onClose, onSave }: NewRoutineDialogProps) => {
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    const routineExercise: RoutineExercise = {
      ...exercise,
      sets: 3,
      reps: 10
    };
    setExercises([...exercises, routineExercise]);
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const handleUpdateSets = (exerciseId: number, sets: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, sets } : ex
    ));
  };

  const handleUpdateReps = (exerciseId: number, reps: number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, reps } : ex
    ));
  };

  const handleSave = () => {
    if (routineName.trim() && exercises.length > 0) {
      onSave({ name: routineName.trim(), exercises });
      // handleClose() will be called by parent after successful save
    }
  };

  const handleClose = () => {
    setRoutineName("");
    setExercises([]);
    setShowExercisePicker(false);
    onClose();
  };

  const canSave = routineName.trim().length > 0 && exercises.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>New Routine</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="routineName">Routine Name</Label>
              <Input
                id="routineName"
                placeholder="Enter routine name..."
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value.slice(0, 40))}
                maxLength={40}
              />
              <div className="text-xs text-muted-foreground text-right">
                {routineName.length}/40
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Exercises</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExercisePicker(true)}
                  className="gap-2"
                >
                  <Plus size={14} />
                  Add Exercise
                </Button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No exercises added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground">{exercise.muscle}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={exercise.sets}
                            onChange={(e) => handleUpdateSets(exercise.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-xs text-center"
                          />
                          <span className="text-xs text-muted-foreground">sets</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={exercise.reps}
                            onChange={(e) => handleUpdateReps(exercise.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-xs text-center"
                          />
                          <span className="text-xs text-muted-foreground">reps</span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!canSave}
              className="flex-1"
            >
              Save Routine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExercisePicker
        open={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleAddExercise}
      />
    </>
  );
};