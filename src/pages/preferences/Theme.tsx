import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ThemeData {
  theme: 'light' | 'dark';
}

export const Theme = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ThemeData>({
    theme: 'light'
  });
  const [originalData, setOriginalData] = useState<ThemeData>({
    theme: 'light'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const currentTheme = savedTheme || 'light';
    
    setFormData({ theme: currentTheme });
    setOriginalData({ theme: currentTheme });
  }, []);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setFormData({ theme });
    applyTheme(theme);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('theme', formData.theme);
      setOriginalData(formData);
      
      toast({ 
        title: "Theme updated", 
        description: "Your theme preference has been saved",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme preference",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    applyTheme(originalData.theme);
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
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Theme</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-card rounded-lg border">
          <div className="px-4 py-4">
            <Label className="font-medium block mb-2">App Theme</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose your preferred theme
            </p>
            <Select
              value={formData.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {hasChanges && (
          <div className="action-bar-mobile">
            <div className="flex gap-3 bg-background p-4 border rounded-lg shadow-lg">
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
          </div>
        )}
      </div>
    </div>
  );
};