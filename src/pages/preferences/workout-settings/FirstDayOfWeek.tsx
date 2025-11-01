import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const FirstDayOfWeek = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("Sunday");

  useEffect(() => {
    const saved = localStorage.getItem('workoutSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedDay(settings.firstDayOfWeek || "Sunday");
    }
  }, []);

  const handleSelect = (day: string) => {
    setSelectedDay(day);
    const saved = localStorage.getItem('workoutSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.firstDayOfWeek = day;
    localStorage.setItem('workoutSettings', JSON.stringify(settings));
    toast.success("First day of week updated");
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
            <h1 className="text-xl font-semibold">First Day of the Week</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border m-4">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => handleSelect(day)}
            className={`
              w-full flex items-center justify-between px-4 py-4 text-left
              transition-colors hover:bg-muted/50
              ${index !== days.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <span className="font-medium">{day}</span>
            {selectedDay === day && (
              <Check size={20} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
