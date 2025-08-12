import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Dumbbell, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutTrend } from "@/components/analytics/WorkoutTrend";
import { muscleDistribution } from "@/utils/stats";
import { useNavigate } from "react-router-dom";
import type { Session, SessionSet, Preferences } from "@/types";

type TimeWindow = "week" | "month" | "3m" | "6m" | "year";

export const Statistics = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionSets, setSessionSets] = useState<{ [sessionId: string]: SessionSet[] }>({});
  const [preferences, setPreferences] = useState<Preferences>({ units: "kg", language: "en", privateProfile: false, hideSuggested: false, defaultWorkoutVisibility: "private" });
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("month");

  useEffect(() => {
    const loadData = () => {
      const sessionsData = JSON.parse(localStorage.getItem('sessions') || '[]');
      const sessionSetsData = JSON.parse(localStorage.getItem('sessionSets') || '{}');
      const preferencesData = JSON.parse(localStorage.getItem('preferences') || '{}');
      
      setSessions(sessionsData);
      setSessionSets(sessionSetsData);
      setPreferences({ ...preferences, ...preferencesData });
    };

    loadData();
  }, []);

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => new Date(session.date) >= weekAgo);
    
    const totalDuration = weekSessions.reduce((sum, session) => {
      const start = new Date(session.start);
      const end = new Date(session.end);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
    }, 0);

    const totalVolume = weekSessions.reduce((sum, session) => sum + (session.totalVolumeKg || 0), 0);
    const totalReps = weekSessions.reduce((sum, session) => sum + (session.totalReps || 0), 0);

    return {
      workouts: weekSessions.length,
      duration: Math.round(totalDuration),
      volume: Math.round(totalVolume),
      reps: totalReps
    };
  };

  const getMuscleDistribution = () => {
    return muscleDistribution(sessionSets, timeWindow);
  };

  const weeklyStats = getWeeklyStats();
  const muscleData = getMuscleDistribution();

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
          <p className="text-muted-foreground">Your workout analytics</p>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Dumbbell size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.workouts}</p>
            <p className="text-xs text-muted-foreground">Workouts this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.duration}</p>
            <p className="text-xs text-muted-foreground">Minutes this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.volume}</p>
            <p className="text-xs text-muted-foreground">Volume (kg) this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold">{weeklyStats.reps}</p>
            <p className="text-xs text-muted-foreground">Reps this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="muscles">Muscle Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Workout Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkoutTrend 
                sessions={sessions} 
                sessionSets={sessionSets} 
                units={preferences.units}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muscles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Muscle Distribution</CardTitle>
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
            </CardHeader>
            <CardContent>
              {muscleData.length > 0 ? (
                <div className="space-y-3">
                  {muscleData.map((muscle, index) => {
                    const maxSets = Math.max(...muscleData.map(m => m.sets));
                    const percentage = maxSets > 0 ? (muscle.sets / maxSets) * 100 : 0;
                    
                    return (
                      <div key={muscle.muscle} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{muscle.muscle}</span>
                          <span className="text-sm text-muted-foreground">{muscle.sets} sets</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No muscle data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};