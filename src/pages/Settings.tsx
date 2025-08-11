import { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Settings as SettingsIcon, Shield, Globe, 
  Moon, Trash2, LogOut, Mail, Star, Info, BookOpen, HelpCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile, Preferences, Theme } from "@/types";

export const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [preferences, setPreferences] = useState<Preferences>({
    units: 'kg',
    language: 'en',
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const savedPreferences = JSON.parse(localStorage.getItem('preferences') || JSON.stringify(preferences));
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    setUserProfile(savedProfile);
    setPreferences(savedPreferences);
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updates };
    setUserProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    toast({ title: "Profile updated", description: "Your profile has been saved" });
  };

  const updatePreferences = (updates: Partial<Preferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('preferences', JSON.stringify(newPreferences));
    toast({ title: "Preferences updated", description: "Your settings have been saved" });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
    toast({ title: "Theme updated", description: `Switched to ${newDarkMode ? 'dark' : 'light'} mode` });
  };

  const handleSignOut = () => {
    // Clear all data except preferences
    const keysToKeep = ['preferences', 'theme'];
    const storage: { [key: string]: string } = {};
    keysToKeep.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) storage[key] = value;
    });
    
    localStorage.clear();
    
    keysToKeep.forEach(key => {
      if (storage[key]) localStorage.setItem(key, storage[key]);
    });
    
    toast({ title: "Signed out", description: "All local data has been cleared" });
    navigate('/');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    toast({ title: "Account deleted", description: "All data has been permanently removed" });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Account Section */}
      <Card className="mobile-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={userProfile.name || ''} 
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Input 
                value={userProfile.bio || ''} 
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder="Tell us about yourself"
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input 
                value={userProfile.link || ''} 
                onChange={(e) => updateProfile({ link: e.target.value })}
                placeholder="https://your-website.com"
              />
            </div>
            <div>
              <Label>Sex</Label>
              <Select value={userProfile.sex || ''} onValueChange={(value) => updateProfile({ sex: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Birthday</Label>
              <Input 
                type="date"
                value={userProfile.birthday || ''} 
                onChange={(e) => updateProfile({ birthday: e.target.value })}
              />
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-3">
            <Button variant="outline" className="w-full" disabled>
              Change Username (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Update Password (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 size={16} className="mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all your data. This action cannot be undone.
                </p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="mobile-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={20} />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={18} />
              <span className="font-medium">Private Profile</span>
            </div>
            <Switch 
              checked={preferences.privateProfile} 
              onCheckedChange={(checked) => updatePreferences({ privateProfile: checked })} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={18} />
              <span className="font-medium">Hide Suggested</span>
            </div>
            <Switch 
              checked={preferences.hideSuggested} 
              onCheckedChange={(checked) => updatePreferences({ hideSuggested: checked })} 
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Globe size={16} />
              Default Workout Visibility
            </Label>
            <Select 
              value={preferences.defaultWorkoutVisibility} 
              onValueChange={(value) => updatePreferences({ defaultWorkoutVisibility: value as any })}
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

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <SettingsIcon size={16} />
              Units
            </Label>
            <Select 
              value={preferences.units} 
              onValueChange={(value) => updatePreferences({ units: value as any })}
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

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Globe size={16} />
              Language
            </Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => updatePreferences({ language: value as any })}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} />
              <span className="font-medium">Dark Mode</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>

          <div className="border-t pt-4">
            <Button variant="outline" className="w-full" disabled>
              <span className="mr-2">🍎</span>
              Connect Apple Health (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guides Section */}
      <Card className="mobile-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Guides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <BookOpen size={16} className="mr-2" />
            Getting Started
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <BookOpen size={16} className="mr-2" />
            Routine Help
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle size={20} />
            Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="mailto:support@discipra.com">
              <Mail size={16} className="mr-2" />
              Contact Us
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Star size={16} className="mr-2" />
            Review on App Store (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Info size={16} className="mr-2" />
            About Discipra
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};