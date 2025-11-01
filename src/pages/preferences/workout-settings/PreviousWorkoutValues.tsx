import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const options = [
  {
    value: "Any workout",
    description: "Your previous exercise values will be fetched from the last time you did that exercise, regardless of routines."
  },
  {
    value: "Same Routine",
    description: "Your previous exercise values will be fetched from the last time you did that exercise in the current routine you are performing."
  }
];

export const PreviousWorkoutValues = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Any workout");

  useEffect(() => {
    const saved = localStorage.getItem('workoutSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedOption(settings.previousWorkoutValues || "Any workout");
    }
  }, []);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    const saved = localStorage.getItem('workoutSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.previousWorkoutValues = option;
    localStorage.setItem('workoutSettings', JSON.stringify(settings));
    toast.success("Setting updated");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Previous Workout Values</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border m-4">
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`
              w-full px-4 py-4 text-left
              transition-colors hover:bg-muted/50
              ${index !== options.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-medium">{option.value}</span>
              {selectedOption === option.value && (
                <Check size={20} className="text-primary flex-shrink-0 ml-2" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
