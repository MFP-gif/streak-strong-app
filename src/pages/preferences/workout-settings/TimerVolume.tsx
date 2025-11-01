import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const volumeOptions = ["High", "Normal", "Low", "Off"];

export const TimerVolume = () => {
  const navigate = useNavigate();
  const [selectedVolume, setSelectedVolume] = useState("High");

  useEffect(() => {
    const saved = localStorage.getItem('soundSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedVolume(settings.timerVolume || "High");
    }
  }, []);

  const handleSelect = (volume: string) => {
    setSelectedVolume(volume);
    const saved = localStorage.getItem('soundSettings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.timerVolume = volume;
    localStorage.setItem('soundSettings', JSON.stringify(settings));
    toast.success("Timer volume updated");
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
            <h1 className="text-xl font-semibold">Timer Sound Volume</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border m-4">
        {volumeOptions.map((volume, index) => (
          <button
            key={volume}
            onClick={() => handleSelect(volume)}
            className={`
              w-full flex items-center justify-between px-4 py-4 text-left
              transition-colors hover:bg-muted/50
              ${index !== volumeOptions.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <span className="font-medium">{volume}</span>
            {selectedVolume === volume && (
              <Check size={20} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
