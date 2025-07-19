import { useState } from "react";
import { ArrowRight, User, Target, Dumbbell, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

type OnboardingStep = "welcome" | "personal" | "goals" | "experience" | "habits" | "complete";

interface OnboardingData {
  name: string;
  age: string;
  weight: string;
  height: string;
  goal: "lose_weight" | "gain_muscle" | "maintain" | "improve_health" | "";
  experience: "beginner" | "intermediate" | "advanced" | "";
  habits: string[];
}

export const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    goal: "",
    experience: "",
    habits: []
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = ["welcome", "personal", "goals", "experience", "habits", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const completeOnboarding = () => {
    // TODO: Save to Supabase
    console.log("Onboarding data:", data);
    localStorage.setItem("discipra_onboarded", "true");
    navigate("/");
  };

  const toggleHabit = (habit: string) => {
    const newHabits = data.habits.includes(habit)
      ? data.habits.filter(h => h !== habit)
      : [...data.habits, habit];
    updateData({ habits: newHabits });
  };

  const goalOptions = [
    { value: "lose_weight", label: "Lose Weight", icon: "📉" },
    { value: "gain_muscle", label: "Gain Muscle", icon: "💪" },
    { value: "maintain", label: "Maintain Weight", icon: "⚖️" },
    { value: "improve_health", label: "Improve Health", icon: "❤️" }
  ];

  const experienceOptions = [
    { value: "beginner", label: "Beginner", desc: "New to fitness" },
    { value: "intermediate", label: "Intermediate", desc: "Some experience" },
    { value: "advanced", label: "Advanced", desc: "Very experienced" }
  ];

  const habitOptions = [
    "Drink 8 glasses of water daily",
    "Exercise 3+ times per week", 
    "Sleep 7-8 hours nightly",
    "Eat 5 servings of fruits/vegetables",
    "No social media before 10 AM",
    "Read for 30 minutes daily",
    "Meditate for 10 minutes",
    "No junk food",
    "Take daily vitamins",
    "Go to bed before 11 PM"
  ];

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">💪</div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Discipra</h1>
            <p className="text-muted-foreground mb-8">
              Your all-in-one fitness and self-discipline companion. 
              Let's get you set up in just a few minutes.
            </p>
            <Button onClick={nextStep} className="w-full btn-mobile gap-2">
              Get Started
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "personal") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => updateData({ age: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={data.weight}
                  onChange={(e) => updateData({ weight: e.target.value })}
                  placeholder="70"
                />
              </div>
            </div>
            <Button 
              onClick={nextStep} 
              className="w-full btn-mobile gap-2"
              disabled={!data.name || !data.age || !data.weight}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "goals") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Your Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData({ goal: option.value as any })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.goal === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
            <Button 
              onClick={nextStep} 
              className="w-full btn-mobile gap-2 mt-6"
              disabled={!data.goal}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "experience") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell size={20} />
              Experience Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {experienceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData({ experience: option.value as any })}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  data.experience === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.desc}</div>
              </button>
            ))}
            <Button 
              onClick={nextStep} 
              className="w-full btn-mobile gap-2 mt-6"
              disabled={!data.experience}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "habits") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Choose Habits
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select habits you'd like to track (you can modify these later)
            </p>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {habitOptions.map((habit) => {
              const isSelected = data.habits.includes(habit);
              return (
                <button
                  key={habit}
                  onClick={() => toggleHabit(habit)}
                  className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle size={12} className="text-primary-foreground" />}
                    </div>
                    {habit}
                  </div>
                </button>
              );
            })}
            <Button 
              onClick={nextStep} 
              className="w-full btn-mobile gap-2 mt-6"
              disabled={data.habits.length === 0}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="mobile-card w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">You're All Set!</h1>
            <p className="text-muted-foreground mb-8">
              Welcome to Discipra, {data.name}! Your personalized fitness 
              and habit tracking journey starts now.
            </p>
            <Button onClick={completeOnboarding} className="w-full btn-mobile gap-2">
              Start Your Journey
              <ArrowRight size={18} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};