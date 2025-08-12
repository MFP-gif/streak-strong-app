import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aggregateSessions } from "@/utils/stats";
import type { Session, SessionSet } from "@/types";

interface WorkoutTrendProps {
  sessions: Session[];
  sessionSets: { [sessionId: string]: SessionSet[] };
  units?: "kg" | "lb";
}

type MetricType = "duration" | "volume" | "reps";
type TimeWindow = "week" | "month" | "3m" | "6m" | "year";

export const WorkoutTrend = ({ sessions, sessionSets, units = "kg" }: WorkoutTrendProps) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>("duration");
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("month");

  const data = aggregateSessions(sessions, sessionSets, { metric: activeMetric, window: timeWindow });

  const getYAxisLabel = () => {
    switch (activeMetric) {
      case "duration": return "Minutes";
      case "volume": return units === "kg" ? "Volume (kg)" : "Volume (lb)";
      case "reps": return "Reps";
      default: return "";
    }
  };

  const getMetricName = () => {
    switch (activeMetric) {
      case "duration": return "Duration";
      case "volume": return "Volume";
      case "reps": return "Reps";
      default: return "";
    }
  };

  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index] || 0
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={activeMetric === "duration" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMetric("duration")}
          >
            Duration
          </Button>
          <Button
            variant={activeMetric === "volume" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMetric("volume")}
          >
            Volume
          </Button>
          <Button
            variant={activeMetric === "reps" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMetric("reps")}
          >
            Reps
          </Button>
        </div>
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

      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-32 border-2 border-dashed border-muted rounded-lg flex items-center justify-center mb-4">
                <span className="text-muted-foreground">No data yet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getMetricName()} data will appear here after you complete some workouts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};