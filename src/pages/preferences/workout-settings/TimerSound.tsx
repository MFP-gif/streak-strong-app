import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const soundOptions = ["Default", "Alarm", "Futuristic", "Ting Ting", "Boxing Bell"];

export const TimerSound = () => {
  const navigate = useNavigate();
  const [selectedSound, setSelectedSound] = useState("Default");

  useEffect(() => {
    const saved = localStorage.getItem('soundSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedSound(settings.timerSound || "Default");
    }
  }, []);

  const handleSelect = (sound: string) => {
    setSelectedSound(sound);
    const saved = localStorage.getItem('soundSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.timerSound = sound;
    localStorage.setItem('soundSettings', JSON.stringify(settings));
    toast.success("Timer sound updated");
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
            <h1 className="text-xl font-semibold">Select Timer Sound</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border m-4">
        {soundOptions.map((sound, index) => (
          <button
            key={sound}
            onClick={() => handleSelect(sound)}
            className={`
              w-full flex items-center justify-between px-4 py-4 text-left
              transition-colors hover:bg-muted/50
              ${index !== soundOptions.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <span className="font-medium">{sound}</span>
            {selectedSound === sound && (
              <Check size={20} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
