import { Settings, Camera, TrendingUp, Moon, Bell, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Profile = () => {
  // Mock data - will be replaced with actual state management
  const userStats = {
    name: "Alex Johnson",
    joinDate: "March 2024",
    totalWorkouts: 47,
    longestStreak: 21,
    currentWeight: "75 kg",
    goalWeight: "72 kg"
  };

  const measurements = [
    { date: "Today", weight: "75.2 kg", bodyFat: "12.5%" },
    { date: "1 week ago", weight: "75.8 kg", bodyFat: "13.1%" },
    { date: "2 weeks ago", weight: "76.1 kg", bodyFat: "13.4%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Track your progress</p>
        </div>
        <Button size="sm" variant="outline" className="btn-mobile gap-2">
          <Settings size={16} />
          Settings
        </Button>
      </div>

      {/* User Profile */}
      <Card className="mobile-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/api/placeholder/64/64" alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User size={24} />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{userStats.name}</h2>
              <p className="text-sm text-muted-foreground">
                Member since {userStats.joinDate}
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Camera size={14} />
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userStats.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Total Workouts</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{userStats.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Weight</span>
            <span className="font-semibold">{userStats.currentWeight}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Goal Weight</span>
            <span className="font-semibold">{userStats.goalWeight}</span>
          </div>
          <div className="pt-2">
            <Button className="w-full btn-mobile gap-2">
              <TrendingUp size={16} />
              Log New Measurement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Measurements */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {measurements.map((measurement, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-sm">{measurement.weight}</div>
                <div className="text-xs text-muted-foreground">{measurement.date}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{measurement.bodyFat}</div>
                <div className="text-xs text-muted-foreground">Body Fat</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="mobile-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-muted-foreground" />
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-muted-foreground" />
              <span className="font-medium">Push Notifications</span>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full btn-mobile">
              Export Data
            </Button>
            <Button variant="outline" className="w-full btn-mobile text-destructive">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};