import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Home } from "./pages/Home";
import { Workout } from "./pages/Workout";
import { WorkoutSession } from "./pages/WorkoutSession";
import { QuickWorkoutSession } from "./pages/QuickWorkoutSession";
import { Nutrition } from "./pages/Nutrition";
import { Habits } from "./pages/Habits";
import { Profile } from "./pages/Profile";
import { SessionSummary } from "./pages/SessionSummary";
import { Calendar } from "./pages/profile/Calendar";
import { Statistics } from "./pages/profile/Statistics";
import { MeasurementsPage } from "./pages/profile/MeasurementsPage";
import { ProgressPhotos } from "./pages/profile/ProgressPhotos";
import NotFound from "./pages/NotFound";
import { MobileNavigation } from "./components/MobileNavigation";
import { SettingsIndex } from "./pages/settings/SettingsIndex";
import { Profile as AccountProfile } from "./pages/account/Profile";
import { AccountSettings } from "./pages/account/AccountSettings";
import { ManageSubscription } from "./pages/account/ManageSubscription";
import { Notifications } from "./pages/account/Notifications";
import { PrivacySocial } from "./pages/preferences/PrivacySocial";
import { Units } from "./pages/preferences/Units";
import { Language } from "./pages/preferences/Language";
import { Theme } from "./pages/preferences/Theme";
import { WorkoutSettings } from "./pages/preferences/WorkoutSettings";
import { Sounds } from "./pages/preferences/workout-settings/Sounds";
import { TimerSound } from "./pages/preferences/workout-settings/TimerSound";
import { TimerVolume } from "./pages/preferences/workout-settings/TimerVolume";
import { CheckSetVolume } from "./pages/preferences/workout-settings/CheckSetVolume";
import { LivePRVolume } from "./pages/preferences/workout-settings/LivePRVolume";
import { PreviousWorkoutValues } from "./pages/preferences/workout-settings/PreviousWorkoutValues";
import { FirstDayOfWeek } from "./pages/preferences/workout-settings/FirstDayOfWeek";
import { RestTimer } from "./pages/preferences/workout-settings/RestTimer";
import { Integrations } from "./pages/preferences/Integrations";
import { AboutDiscipra } from "./pages/AboutDiscipra";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/quick-workout" element={<QuickWorkoutSession />} />
            <Route path="/workout-session/:routineId" element={<WorkoutSession />} />
            <Route path="/session-summary" element={<SessionSummary />} />
            <Route path="/profile/calendar" element={<Calendar />} />
            <Route path="/profile/statistics" element={<Statistics />} />
            <Route path="/profile/measurements" element={<MeasurementsPage />} />
            <Route path="/profile/progress-photos" element={<ProgressPhotos />} />
            <Route path="/settings" element={<SettingsIndex />} />
            <Route path="/account/profile" element={<AccountProfile />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/account/subscription" element={<ManageSubscription />} />
            <Route path="/account/notifications" element={<Notifications />} />
            <Route path="/preferences/privacy-social" element={<PrivacySocial />} />
            <Route path="/preferences/units" element={<Units />} />
            <Route path="/preferences/language" element={<Language />} />
            <Route path="/preferences/theme" element={<Theme />} />
          <Route path="/preferences/workout-settings" element={<WorkoutSettings />} />
          <Route path="/preferences/workout-settings/sounds" element={<Sounds />} />
          <Route path="/preferences/workout-settings/sounds/timer-sound" element={<TimerSound />} />
          <Route path="/preferences/workout-settings/sounds/timer-volume" element={<TimerVolume />} />
          <Route path="/preferences/workout-settings/sounds/check-set" element={<CheckSetVolume />} />
          <Route path="/preferences/workout-settings/sounds/live-pr-volume" element={<LivePRVolume />} />
          <Route path="/preferences/workout-settings/rest-timer" element={<RestTimer />} />
          <Route path="/preferences/workout-settings/first-day" element={<FirstDayOfWeek />} />
          <Route path="/preferences/workout-settings/previous-values" element={<PreviousWorkoutValues />} />
            <Route path="/preferences/integrations" element={<Integrations />} />
            <Route path="/about" element={<AboutDiscipra />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNavigation />
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;