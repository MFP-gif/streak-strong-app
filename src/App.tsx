import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Workout } from "./pages/Workout";
import { WorkoutSession } from "./pages/WorkoutSession";
import { Nutrition } from "./pages/Nutrition";
import { Habits } from "./pages/Habits";
import { Profile } from "./pages/Profile";
import { Onboarding } from "./pages/Onboarding";
import { MobileNavigation } from "./components/MobileNavigation";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboarded = localStorage.getItem("discipra_onboarded");
    setIsOnboarded(!!onboarded);
  }, []);

  // Show loading state while checking onboarding status
  if (isOnboarded === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-6xl animate-pulse">💪</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isOnboarded ? (
            <Routes>
              <Route path="*" element={<Onboarding />} />
            </Routes>
          ) : (
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workout" element={<Workout />} />
                <Route path="/workout/:id/session" element={<WorkoutSession />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileNavigation />
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
