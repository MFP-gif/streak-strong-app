import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Workout } from "./pages/Workout";
import { WorkoutSession } from "./pages/WorkoutSession";
import { QuickWorkoutSession } from "./pages/QuickWorkoutSession";
import { Nutrition } from "./pages/Nutrition";
import { Habits } from "./pages/Habits";
import { Profile } from "./pages/Profile";
import { SessionSummary } from "./pages/SessionSummary";
import { Settings } from "./pages/Settings";
import { AccountSettings } from "./pages/settings/Account";
import { PreferencesSettings } from "./pages/settings/Preferences";
import { AboutDiscipra } from "./pages/AboutDiscipra";
import { MobileNavigation } from "./components/MobileNavigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/workout/quick" element={<QuickWorkoutSession />} />
            <Route path="/history/:sessionId" element={<SessionSummary />} />
            <Route path="/workout/:id/session" element={<WorkoutSession />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/profile" element={<AccountSettings />} />
            <Route path="/settings/privacy" element={<PreferencesSettings />} />
            <Route path="/settings/preferences" element={<PreferencesSettings />} />
            <Route path="/about" element={<AboutDiscipra />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
