import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Preferences } from "@/types";

export const PreferencesSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Preferences>({
    units: 'kg',
    language: 'en',
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  const [originalData, setOriginalData] = useState<Preferences>({
    units: 'kg',
    language: 'en',
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [originalTheme, setOriginalTheme] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('preferences') || JSON.stringify(formData));
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setFormData(savedPreferences);
    setOriginalData(savedPreferences);
    setIsDarkMode(shouldBeDark);
    setOriginalTheme(shouldBeDark);
  }, []);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || isDarkMode !== originalTheme;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('preferences', JSON.stringify(formData));
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDarkMode);
      
      setOriginalData(formData);
      setOriginalTheme(isDarkMode);
      
      toast({ 
        title: "Preferences updated", 
        description: "Your preferences have been saved successfully",
        duration: 2000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsDarkMode(originalTheme);
    document.documentElement.classList.toggle('dark', originalTheme);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/settings')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Preferences</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Privacy & Social */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Privacy & Social
          </h2>
          
          <div className="bg-card rounded-lg border">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div>
                <Label className="font-medium">Private Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Hide your profile from other users
                </p>
              </div>
              <Switch
                checked={formData.privateProfile}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privateProfile: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div>
                <Label className="font-medium">Hide Suggested</Label>
                <p className="text-sm text-muted-foreground">
                  Don't show suggested users
                </p>
              </div>
              <Switch
                checked={formData.hideSuggested}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hideSuggested: checked }))}
              />
            </div>
            
            <div className="px-4 py-4">
              <Label className="font-medium block mb-2">Default Workout Visibility</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose who can see your workouts by default
              </p>
              <Select
                value={formData.defaultWorkoutVisibility}
                onValueChange={(value) => setFormData(prev => ({ ...prev, defaultWorkoutVisibility: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Units & Display */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Units & Display
          </h2>
          
          <div className="bg-card rounded-lg border">
            <div className="px-4 py-4 border-b border-border">
              <Label className="font-medium block mb-2">Weight Units</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your preferred weight measurement
              </p>
              <Select
                value={formData.units}
                onValueChange={(value) => setFormData(prev => ({ ...prev, units: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="px-4 py-4 border-b border-border">
              <Label className="font-medium block mb-2">Language</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Choose your preferred language
              </p>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <Label className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme across the app
                </p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  setIsDarkMode(checked);
                  document.documentElement.classList.toggle('dark', checked);
                }}
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Integrations
          </h2>
          
          <div className="bg-card rounded-lg border">
            <div className="px-4 py-4">
              <Label className="font-medium block mb-2">Apple Health</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Sync your workouts with Apple Health
              </p>
              <Button variant="outline" className="w-full" disabled>
                Connect Apple Health (Coming Soon)
              </Button>
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {hasChanges && (
          <div className="fixed bottom-4 left-4 right-4 flex gap-3 bg-background p-4 border rounded-lg shadow-lg">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};