import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LanguageData {
  language: 'en' | 'pt';
}

export const Language = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<LanguageData>({
    language: 'en'
  });
  const [originalData, setOriginalData] = useState<LanguageData>({
    language: 'en'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('language') || JSON.stringify(formData));
    setFormData(savedPreferences);
    setOriginalData(savedPreferences);
  }, []);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call and i18n integration
      localStorage.setItem('language', JSON.stringify(formData));
      setOriginalData(formData);
      
      toast({ 
        title: "Language updated", 
        description: "Your language preference has been saved",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save language preference",
        variant: "destructive"
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
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Language</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-card rounded-lg border">
          <div className="px-4 py-4">
            <Label className="font-medium block mb-2">App Language</Label>
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