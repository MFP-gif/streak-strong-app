import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const timerOptions = [
  "Off",
  "30 seconds",
  "45 seconds",
  "1 minute",
  "1 minute 30 seconds",
  "2 minutes",
  "2 minutes 30 seconds",
  "3 minutes",
  "4 minutes",
  "5 minutes"
];

export const RestTimer = () => {
  const navigate = useNavigate();
  const [selectedTimer, setSelectedTimer] = useState("Off");

  useEffect(() => {
    const saved = localStorage.getItem('workoutSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedTimer(settings.defaultRestTimer || "Off");
    }
  }, []);

  const handleSelect = (timer: string) => {
    setSelectedTimer(timer);
    const saved = localStorage.getItem('workoutSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.defaultRestTimer = timer;
    localStorage.setItem('workoutSettings', JSON.stringify(settings));
    toast.success("Default rest timer updated");
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
            <h1 className="text-xl font-semibold">Default Rest Timer</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border m-4">
        {timerOptions.map((timer, index) => (
          <button
            key={timer}
            onClick={() => handleSelect(timer)}
            className={`
              w-full flex items-center justify-between px-4 py-4 text-left
              transition-colors hover:bg-muted/50
              ${index !== timerOptions.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <span className="font-medium">{timer}</span>
            {selectedTimer === timer && (
              <Check size={20} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
