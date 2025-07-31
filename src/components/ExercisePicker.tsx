import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import exercisesData from "@/data/exercises.json";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
}

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExercisePicker = ({ open, onClose, onSelectExercise }: ExercisePickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = exercisesData.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onClose();
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[560px] max-w-[95vw] sm:max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col sm:rounded-lg rounded-t-2xl sm:h-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Choose Exercise</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleSelectExercise(exercise)}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-medium text-sm">{exercise.name}</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {exercise.muscle}
                </Badge>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No exercises found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};