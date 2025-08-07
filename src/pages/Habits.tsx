import { useState, useEffect } from "react";
import { Target, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { dateKey } from "@/utils/date";
import type { Habit, HabitCompletions } from "@/types";

export const Habits = () => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletions>({});
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [habitForm, setHabitForm] = useState({ name: '', type: 'do' as 'do' | 'avoid', category: 'health' });

  const today = dateKey();
  const todayCompletions = habitCompletions[today] || {};
  const completedCount = Object.values(todayCompletions).filter(Boolean).length;

  const loadData = () => {
    setHabits(JSON.parse(localStorage.getItem('habits') || '[]'));
    setHabitCompletions(JSON.parse(localStorage.getItem('habitCompletions') || '{}'));
  };

  useEffect(() => { loadData(); }, []);

  const handleAddHabit = () => {
    if (!habitForm.name.trim()) return;
    const newHabit: Habit = { id: Date.now().toString(), ...habitForm, name: habitForm.name.trim(), streak: 0, completed: false };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    toast({ title: "Habit added", description: `${newHabit.name} has been added` });
    setHabitForm({ name: '', type: 'do', category: 'health' });
    setIsAddHabitOpen(false);
  };

  const toggleHabit = (habitId: string) => {
    const updatedCompletions = { ...habitCompletions };
    if (!updatedCompletions[today]) updatedCompletions[today] = {};
    updatedCompletions[today][habitId] = !(updatedCompletions[today][habitId] || false);
    setHabitCompletions(updatedCompletions);
    localStorage.setItem('habitCompletions', JSON.stringify(updatedCompletions));
  };

  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Habits</h1><p className="text-muted-foreground">Build consistent daily habits</p></div>
        <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-2" />Add Habit</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Habit</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Habit Name</Label><Input value={habitForm.name} onChange={(e) => setHabitForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Drink 8 glasses of water" /></div>
              <div><Label>Type</Label><Select value={habitForm.type} onValueChange={(value: 'do' | 'avoid') => setHabitForm(prev => ({ ...prev, type: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="do">✅ Do</SelectItem><SelectItem value="avoid">❌ Avoid</SelectItem></SelectContent></Select></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddHabitOpen(false)}>Cancel</Button><Button onClick={handleAddHabit} disabled={!habitForm.name.trim()}>Add Habit</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mobile-card mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Target size={20} />Today's Progress</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Habits Completed</span><span className="text-sm text-muted-foreground">{completedCount} / {habits.length}</span></div>
          <Progress value={progress} className="h-3" />
          {habits.length === 0 && <p className="text-xs text-muted-foreground mt-1">Add your first habit to start tracking</p>}
        </CardContent>
      </Card>

      {habits.length === 0 ? (
        <Card className="mobile-card"><CardContent className="text-center py-8"><Target className="mx-auto mb-4 text-muted-foreground" size={48} /><p className="text-muted-foreground mb-4">No habits yet</p><Button onClick={() => setIsAddHabitOpen(true)}><Plus size={16} className="mr-2" />Add Your First Habit</Button></CardContent></Card>
      ) : (
        <div className="space-y-4">{habits.map((habit) => {
          const isCompleted = todayCompletions[habit.id] || false;
          return (
            <Card key={habit.id} className="mobile-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{habit.name}</h3>
                    <Badge className="mt-1" variant="secondary">{habit.category}</Badge>
                  </div>
                  <Button variant={isCompleted ? "default" : "outline"} size="sm" onClick={() => toggleHabit(habit.id)} className={isCompleted ? "bg-success text-white" : ""}>
                    {isCompleted ? <Check size={16} /> : <Plus size={16} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}</div>
      )}
    </div>
  );
};