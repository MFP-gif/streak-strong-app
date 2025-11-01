import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface WorkoutSettingsData {
  keepAwakeDuringWorkout: boolean;
  plateCalculator: boolean;
  rpeTracking: boolean;
  smartSupersetScrolling: boolean;
  inlineTimer: boolean;
  livePersonalRecordNotification: boolean;
}

export const WorkoutSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<WorkoutSettingsData>({
    keepAwakeDuringWorkout: false,
    plateCalculator: true,
    rpeTracking: false,
    smartSupersetScrolling: false,
    inlineTimer: true,
    livePersonalRecordNotification: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('workoutSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key: keyof WorkoutSettingsData) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('workoutSettings', JSON.stringify(newSettings));
    toast.success("Setting updated");
  };

  const menuItems = [
    { title: "Sounds", path: "/preferences/workout-settings/sounds", hasValue: false },
    { title: "Default Rest Timer", path: "/preferences/workout-settings/rest-timer", value: "Off" },
    { title: "First day of the week", path: "/preferences/workout-settings/first-day", value: "Sunday" },
    { title: "Previous Workout Values", path: "/preferences/workout-settings/previous-values", value: "Default" },
  ];

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
            <h1 className="text-xl font-semibold">Workout Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Menu Items with Navigation */}
        <div className="bg-card rounded-lg border">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center justify-between px-4 py-4 text-left
                transition-colors hover:bg-muted/50
                ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}
              `}
            >
              <span className="font-medium">{item.title}</span>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                )}
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Toggle Settings */}
        <div className="bg-card rounded-lg border">
          {/* Keep Awake During Workout */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="keep-awake" className="font-medium">Keep Awake During Workout</Label>
              <Switch 
                id="keep-awake"
                checked={settings.keepAwakeDuringWorkout}
                onCheckedChange={() => handleToggle('keepAwakeDuringWorkout')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enable this if you don't want your phone to sleep while you're in a workout
            </p>
          </div>

          {/* Plate Calculator */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="plate-calc" className="font-medium">Plate Calculator</Label>
              <Switch 
                id="plate-calc"
                checked={settings.plateCalculator}
                onCheckedChange={() => handleToggle('plateCalculator')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              A plate calculator calculates the plates needed on a bar to achieve a specific weight. When enabled, a Calculator button will appear when inputting weight for barbell exercises.
            </p>
          </div>

          {/* RPE Tracking */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="rpe" className="font-medium">RPE Tracking</Label>
              <Switch 
                id="rpe"
                checked={settings.rpeTracking}
                onCheckedChange={() => handleToggle('rpeTracking')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              RPE (Rated Perceived Exertion) is a measure of the intensity an exercise. Enabling RPE tracking will allow you to log it for each set in your workouts.
            </p>
          </div>

          {/* Smart Superset Scrolling */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="superset" className="font-medium">Smart Superset Scrolling</Label>
              <Switch 
                id="superset"
                checked={settings.smartSupersetScrolling}
                onCheckedChange={() => handleToggle('smartSupersetScrolling')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When you complete a set, it'll automatically scroll to the next exercise in the superset.
            </p>
          </div>

          {/* Inline Timer */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="inline-timer" className="font-medium">Inline Timer</Label>
              <Switch 
                id="inline-timer"
                checked={settings.inlineTimer}
                onCheckedChange={() => handleToggle('inlineTimer')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Duration exercises have a built-in stopwatch for tracking time for each set
            </p>
          </div>

          {/* Live Personal Record Notification */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="pr-notification" className="font-medium">Live Personal Record Notification</Label>
              <Switch 
                id="pr-notification"
                checked={settings.livePersonalRecordNotification}
                onCheckedChange={() => handleToggle('livePersonalRecordNotification')}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, it'll notify you when you achieve a Personal Record upon checking the set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

