import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PrivacySocialPreferences {
  privateProfile: boolean;
  hideSuggested: boolean;
  defaultWorkoutVisibility: 'public' | 'friends' | 'private';
}

export const PrivacySocialSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PrivacySocialPreferences>({
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  const [originalData, setOriginalData] = useState<PrivacySocialPreferences>({
    privateProfile: false,
    hideSuggested: false,
    defaultWorkoutVisibility: 'private'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('privacySocial') || JSON.stringify(formData));
    setFormData(savedPreferences);
    setOriginalData(savedPreferences);
  }, []);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('privacySocial', JSON.stringify(formData));
      setOriginalData(formData);
      
      toast({ 
        title: "Privacy settings updated", 
        description: "Your privacy preferences have been saved",
        duration: 2000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
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
            <h1 className="text-xl font-semibold">Privacy & Social</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Private Profile */}
        <div className="bg-card rounded-lg border">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <Label className="font-medium">Private Profile</Label>
              <p className="text-sm text-muted-foreground">
                Hide your profile from other users
              </p>
            </div>
            <Switch
              checked={formData.privateProfile}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, privateProfile: checked }))
              }
            />
          </div>
        </div>

        {/* Hide Suggested */}
        <div className="bg-card rounded-lg border">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <Label className="font-medium">Hide Suggested</Label>
              <p className="text-sm text-muted-foreground">
                Don't show suggested users
              </p>
            </div>
            <Switch
              checked={formData.hideSuggested}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, hideSuggested: checked }))
              }
            />
          </div>
        </div>

        {/* Default Workout Visibility */}
        <div className="bg-card rounded-lg border">
          <div className="px-4 py-4">
            <Label className="font-medium block mb-2">Default Workout Visibility</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose who can see your workouts by default
            </p>
            <Select
              value={formData.defaultWorkoutVisibility}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, defaultWorkoutVisibility: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
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