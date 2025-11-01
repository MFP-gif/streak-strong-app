import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Sounds = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    timerSound: "Default",
    timerVolume: "High",
    checkSet: "Off",
    livePersonalRecordVolume: "High",
  });

  useEffect(() => {
    const saved = localStorage.getItem('soundSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

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
            <h1 className="text-xl font-semibold">Sounds</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Sound Type Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-3 px-4">Sound Type</h2>
          <div className="bg-card rounded-lg border">
            <button
              onClick={() => navigate('/preferences/workout-settings/sounds/timer-sound')}
              className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">Timer Sound</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{settings.timerSound}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>

        {/* Sounds Volume Section */}
        <div>
          <h2 className="text-sm text-muted-foreground mb-3 px-4">Sounds Volume</h2>
          <div className="bg-card rounded-lg border">
            <button
              onClick={() => navigate('/preferences/workout-settings/sounds/timer-volume')}
              className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted/50 border-b border-border"
            >
              <span className="font-medium">Timer Volume</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{settings.timerVolume}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
            
            <button
              onClick={() => navigate('/preferences/workout-settings/sounds/check-set')}
              className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted/50 border-b border-border"
            >
              <span className="font-medium">Check Set</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{settings.checkSet}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>

            <button
              onClick={() => navigate('/preferences/workout-settings/sounds/live-pr-volume')}
              className="w-full flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">Live Personal Record Volume</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{settings.livePersonalRecordVolume}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
