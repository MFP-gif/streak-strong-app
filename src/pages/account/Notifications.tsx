import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export const Notifications = () => {
  const navigate = useNavigate();
  
  // UI-only state - not persisted
  const [notifications, setNotifications] = useState({
    workoutReminders: false,
    streaks: false,
    friendActivity: false,
    productUpdates: false,
  });

  const notificationSections = [
    {
      title: "Workout Reminders",
      description: "Get notified when it's time to work out",
      key: "workoutReminders" as const,
    },
    {
      title: "Streaks",
      description: "Notifications about your workout streaks",
      key: "streaks" as const,
    },
    {
      title: "Friend Activity",
      description: "Updates when friends complete workouts",
      key: "friendActivity" as const,
    },
    {
      title: "Product Updates",
      description: "News about new features and improvements",
      key: "productUpdates" as const,
    },
  ];

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
              onClick={() => navigate('/settings')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Notifications</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Coming Soon Notice */}
        <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium">Notifications coming soon.</span> These settings are for preview only.
          </p>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          {notificationSections.map((section, index) => (
            <div key={section.key} className="bg-card rounded-lg border">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex-1">
                  <Label className="font-medium block">{section.title}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.description}
                  </p>
                </div>
                <Switch
                  checked={notifications[section.key]}
                  onCheckedChange={() => handleToggle(section.key)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Notification preferences will be saved when this feature is available.
          </p>
        </div>
      </div>
    </div>
  );
};