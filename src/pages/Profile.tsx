import { useState, useEffect } from "react";
import { 
  BarChart3, Calendar, Scale, TrendingUp, Camera, Settings,
  ChevronDown, ChevronRight, Dumbbell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dateKey } from "@/utils/date";
import { workoutStreak, aggregateSessions, muscleDistribution } from "@/utils/stats";
import { toDisplayWeight, getWeightUnit } from "@/utils/units";
import type { Session, SessionSet, Measurement, Preferences, ProgressPhoto, ChartMetric, TimeWindow } from "@/types";

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionSets, setSessionSets] = useState<{ [sessionId: string]: SessionSet[] }>({});
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    units: 'kg',
    language: 'en',
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  
  const [chartMetric, setChartMetric] = useState<ChartMetric>('duration');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('month');
  const [isLogMeasurementOpen, setIsLogMeasurementOpen] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [measurementForm, setMeasurementForm] = useState({ 
    date: dateKey(), 
    weightKg: '', 
    chest: '', 
    waist: '', 
    arms: '', 
    thighs: '', 
    bodyFat: '' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const sessionsData = JSON.parse(localStorage.getItem('sessions') || '[]');
    const sessionSetsData = JSON.parse(localStorage.getItem('sessionSets') || '{}');
    const measurementsData = JSON.parse(localStorage.getItem('measurements') || '[]');
    const photosData = JSON.parse(localStorage.getItem('photos') || '[]');
    const preferencesData = JSON.parse(localStorage.getItem('preferences') || JSON.stringify(preferences));
    
    setSessions(sessionsData);
    setSessionSets(sessionSetsData);
    setMeasurements(measurementsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setPhotos(photosData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setPreferences(preferencesData);
  };

  const handleLogMeasurement = () => {
    if (!measurementForm.date) return;
    
    const newMeasurement: Measurement = {
      id: `measurement_${Date.now()}`,
      date: measurementForm.date,
      ...(measurementForm.weightKg && { weightKg: parseFloat(measurementForm.weightKg) }),
      ...(measurementForm.chest && { chest: parseFloat(measurementForm.chest) }),
      ...(measurementForm.waist && { waist: parseFloat(measurementForm.waist) }),
      ...(measurementForm.arms && { arms: parseFloat(measurementForm.arms) }),
      ...(measurementForm.thighs && { thighs: parseFloat(measurementForm.thighs) }),
      ...(measurementForm.bodyFat && { bodyFat: parseFloat(measurementForm.bodyFat) })
    };
    
    const updatedMeasurements = [newMeasurement, ...measurements];
    setMeasurements(updatedMeasurements);
    localStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
    
    toast({ title: "Measurement logged", description: "Your measurement has been recorded" });
    setMeasurementForm({ date: dateKey(), weightKg: '', chest: '', waist: '', arms: '', thighs: '', bodyFat: '' });
    setIsLogMeasurementOpen(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newPhoto: ProgressPhoto = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        dataUrl,
        caption: ''
      };
      
      const updatedPhotos = [newPhoto, ...photos];
      setPhotos(updatedPhotos);
      localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      
      toast({ title: "Photo added", description: "Your progress photo has been saved" });
    };
    reader.readAsDataURL(file);
    setIsPhotoPickerOpen(false);
  };

  const stats = workoutStreak(sessions);
  const latestWeight = measurements.find(m => m.weightKg)?.weightKg;
  const chartData = aggregateSessions(sessions, sessionSets, { metric: chartMetric, window: timeWindow });
  const muscleData = muscleDistribution(sessionSets, timeWindow);

  const getMetricLabel = (metric: ChartMetric) => {
    switch (metric) {
      case 'duration': return 'Duration (min)';
      case 'volume': return 'Volume (kg)';
      case 'reps': return 'Total Reps';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your fitness journey</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
          <Settings size={16} />
        </Button>
      </div>

      {/* Charts Section */}
      <Card className="mobile-card mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Analytics
            </CardTitle>
            <Select value={timeWindow} onValueChange={(value: TimeWindow) => setTimeWindow(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={chartMetric} onValueChange={(value: ChartMetric) => setChartMetric(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="duration">Duration</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="reps">Reps</TabsTrigger>
            </TabsList>
            <TabsContent value={chartMetric} className="mt-4">
              <div className="h-40 flex items-end gap-2 p-4 bg-muted/50 rounded-lg">
                {chartData.values.length > 0 ? (
                  chartData.values.map((value, index) => {
                    const maxValue = Math.max(...chartData.values);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full bg-primary rounded-t min-h-[4px]"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{chartData.labels[index]}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-muted-foreground">
                    No data available for {getMetricLabel(chartMetric).toLowerCase()}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card className="mobile-card mb-6">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Dialog open={isLogMeasurementOpen} onOpenChange={setIsLogMeasurementOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Scale size={20} />
                <span className="text-xs">Measurements</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Measurement</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={measurementForm.date} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, date: e.target.value }))} 
                  />
                </div>
                <div>
                  <Label>Weight ({getWeightUnit(preferences.units)})</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={measurementForm.weightKg} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, weightKg: e.target.value }))}
                    placeholder="70.5" 
                  />
                </div>
                <div>
                  <Label>Chest (cm)</Label>
                  <Input 
                    type="number" 
                    value={measurementForm.chest} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, chest: e.target.value }))}
                    placeholder="100" 
                  />
                </div>
                <div>
                  <Label>Waist (cm)</Label>
                  <Input 
                    type="number" 
                    value={measurementForm.waist} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, waist: e.target.value }))}
                    placeholder="85" 
                  />
                </div>
                <div>
                  <Label>Arms (cm)</Label>
                  <Input 
                    type="number" 
                    value={measurementForm.arms} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, arms: e.target.value }))}
                    placeholder="35" 
                  />
                </div>
                <div>
                  <Label>Thighs (cm)</Label>
                  <Input 
                    type="number" 
                    value={measurementForm.thighs} 
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, thighs: e.target.value }))}
                    placeholder="55" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLogMeasurementOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLogMeasurement}>
                  Log Measurement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/profile/calendar')}>
            <Calendar size={20} />
            <span className="text-xs">Calendar</span>
          </Button>

          <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/profile/statistics')}>
            <TrendingUp size={20} />
            <span className="text-xs">Statistics</span>
          </Button>

          <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/profile/progress-photos')}>
            <Camera size={20} />
            <span className="text-xs">Progress Photos</span>
          </Button>

          <Dialog open={isPhotoPickerOpen} onOpenChange={setIsPhotoPickerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-16 flex-col gap-1 col-span-2">
                <Camera size={20} />
                <span className="text-xs">Progress Photos</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Progress Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                />
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {photos.slice(0, 6).map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.dataUrl}
                        alt="Progress"
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{sessions.length}</div>
            <div className="text-xs text-muted-foreground">Total Workouts</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{stats.longest}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Stats */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale size={20} />
            Current Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Weight</span>
            <span className="text-sm text-muted-foreground">
              {latestWeight ? `${toDisplayWeight(latestWeight, preferences.units)} ${getWeightUnit(preferences.units)}` : 'Not set'}
            </span>
          </div>
          
          {muscleData.length > 0 && (
            <div>
              <span className="text-sm font-medium mb-2 block">Muscle Distribution ({timeWindow})</span>
              <div className="space-y-1">
                {muscleData.slice(0, 3).map(({ muscle, sets }) => (
                  <div key={muscle} className="flex justify-between items-center text-xs">
                    <span>{muscle}</span>
                    <span className="text-muted-foreground">{sets} sets</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};