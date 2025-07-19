import { Plus, CheckCircle, X, Flame, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const Habits = () => {
  // Mock data - will be replaced with actual state management
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Drink 8 glasses of water",
      type: "start",
      streak: 12,
      completed: true,
      category: "Health"
    },
    {
      id: 2,
      name: "No social media before 10 AM",
      type: "stop",
      streak: 8,
      completed: true,
      category: "Productivity"
    },
    {
      id: 3,
      name: "Read for 30 minutes",
      type: "start",
      streak: 5,
      completed: false,
      category: "Learning"
    },
    {
      id: 4,
      name: "No junk food",
      type: "stop",
      streak: 15,
      completed: true,
      category: "Nutrition"
    },
    {
      id: 5,
      name: "Morning meditation",
      type: "start",
      streak: 3,
      completed: false,
      category: "Wellness"
    }
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Health: "bg-blue-100 text-blue-800",
      Productivity: "bg-green-100 text-green-800", 
      Learning: "bg-purple-100 text-purple-800",
      Nutrition: "bg-orange-100 text-orange-800",
      Wellness: "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Habits</h1>
          <p className="text-muted-foreground">Build your daily discipline</p>
        </div>
        <Button size="sm" className="btn-mobile gap-2">
          <Plus size={16} />
          Add Habit
        </Button>
      </div>

      {/* Daily Progress */}
      <Card className="mobile-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} habits completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {Math.round((completedCount / totalCount) * 100)}%
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Flame className="streak-fire" size={14} />
                <span>12 day streak</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="progress-fill rounded-full"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Habits</h2>
        <div className="space-y-3">
          {habits.map((habit) => (
            <Card key={habit.id} className="mobile-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      habit.completed
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {habit.completed && <CheckCircle size={16} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${
                        habit.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Flame className="streak-fire" size={14} />
                        <span className="text-sm font-medium">{habit.streak}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getCategoryColor(habit.category)}`}
                      >
                        {habit.category}
                      </Badge>
                      <Badge 
                        variant={habit.type === 'start' ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        {habit.type === 'start' ? 'Do' : 'Avoid'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calendar View Button */}
      <Card className="mobile-card">
        <CardContent className="p-4">
          <Button variant="outline" className="w-full btn-mobile gap-2">
            <Calendar size={18} />
            View Calendar History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};