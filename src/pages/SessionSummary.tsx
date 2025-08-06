import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, TrendingUp, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutSession } from "@/utils/streak";

export const SessionSummary = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    try {
      const sessions: WorkoutSession[] = JSON.parse(localStorage.getItem('sessions') || '[]');
      const foundSession = sessions.find(s => s.id === sessionId);
      setSession(foundSession || null);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-background pb-20 pt-4 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-xl font-bold">Session not found</h1>
        </div>
      </div>
    );
  }

  const totalSets = session.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const totalVolume = session.exercises.reduce((total, exercise) => {
    return total + exercise.sets.reduce((setTotal: number, set: any) => {
      return setTotal + (set.weight || 0) * (set.reps || 0);
    }, 0);
  }, 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{session.routineName}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(session.date)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="text-primary" size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{session.duration}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Dumbbell className="text-primary" size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{totalSets}</div>
            <div className="text-xs text-muted-foreground">Sets</div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-primary" size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{totalVolume}</div>
            <div className="text-xs text-muted-foreground">kg Volume</div>
          </CardContent>
        </Card>
      </div>

      {/* Exercises */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.exercises.map((exercise, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-3">{exercise.name}</h3>
              <div className="space-y-2">
                {exercise.sets.map((set: any, setIndex: number) => (
                  <div key={setIndex} className="flex items-center justify-between">
                    <Badge variant="outline" className="w-12">
                      {setIndex + 1}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {set.weight ? `${set.weight} kg` : '–'} × {set.reps || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};