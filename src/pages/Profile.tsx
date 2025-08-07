import { useState, useEffect } from "react";
import { User, Settings, TrendingUp, Moon, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dateKey } from "@/utils/date";
import { recalcWorkoutStreak } from "@/utils/stats";
import type { Session, Measurement, Theme } from "@/types";

export const Profile = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLogMeasurementOpen, setIsLogMeasurementOpen] = useState(false);
  const [measurementForm, setMeasurementForm] = useState({ date: dateKey(), weight: '' });

  const loadData = () => {
    const sessionsData = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(sessionsData);
    setMeasurements(JSON.parse(localStorage.getItem('measurements') || '[]').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  };

  useEffect(() => { loadData(); }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
    toast({ title: "Theme updated", description: `Switched to ${newDarkMode ? 'dark' : 'light'} mode` });
  };

  const handleLogMeasurement = () => {
    if (!measurementForm.date || !measurementForm.weight) return;
    const newMeasurement = { date: measurementForm.date, weight: parseFloat(measurementForm.weight) };
    const updatedMeasurements = [newMeasurement, ...measurements];
    setMeasurements(updatedMeasurements);
    localStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
    toast({ title: "Measurement logged", description: `Weight recorded: ${newMeasurement.weight} kg` });
    setMeasurementForm({ date: dateKey(), weight: '' });
    setIsLogMeasurementOpen(false);
  };

  const stats = recalcWorkoutStreak(sessions);
  const latestWeight = measurements.find(m => m.weight)?.weight;

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-muted-foreground">Your fitness journey</p></div>
        <Button variant="outline" size="sm"><Settings size={16} /></Button>
      </div>

      <Card className="mobile-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16"><AvatarFallback className="text-lg font-bold">DC</AvatarFallback></Avatar>
            <div><h2 className="text-xl font-bold">Discipra User</h2><p className="text-muted-foreground">Member since today</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center"><p className="text-2xl font-bold">{sessions.length}</p><p className="text-sm text-muted-foreground">Total Workouts</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{stats.longest}</p><p className="text-sm text-muted-foreground">Longest Streak</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="mobile-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Scale size={20} />Current Stats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center"><span className="text-sm font-medium">Current Weight</span><span className="text-sm text-muted-foreground">{latestWeight ? `${latestWeight} kg` : 'Not set'}</span></div>
          <Dialog open={isLogMeasurementOpen} onOpenChange={setIsLogMeasurementOpen}>
            <DialogTrigger asChild><Button variant="outline" className="w-full"><TrendingUp size={16} className="mr-2" />Log New Measurement</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Measurement</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Date</Label><Input type="date" value={measurementForm.date} onChange={(e) => setMeasurementForm(prev => ({ ...prev, date: e.target.value }))} /></div>
                <div><Label>Weight (kg)</Label><Input type="number" step="0.1" value={measurementForm.weight} onChange={(e) => setMeasurementForm(prev => ({ ...prev, weight: e.target.value }))} placeholder="e.g., 70.5" /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setIsLogMeasurementOpen(false)}>Cancel</Button><Button onClick={handleLogMeasurement} disabled={!measurementForm.date || !measurementForm.weight}>Log Measurement</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="mobile-card">
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Moon size={18} /><span className="font-medium">Dark Mode</span></div><Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} /></div>
        </CardContent>
      </Card>
    </div>
  );
};