import { useState, useEffect } from "react";
import { ArrowLeft, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name?: string;
  bio?: string;
  link?: string;
  sex?: 'female' | 'male' | 'prefer-not-to-say';
  birthday?: string;
  avatar?: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProfileData>({});
  const [originalData, setOriginalData] = useState<ProfileData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setFormData(savedProfile);
    setOriginalData(savedProfile);
  }, []);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const validateForm = () => {
    if (!formData.name || formData.name.length < 1 || formData.name.length > 40) {
      toast({
        title: "Invalid name",
        description: "Name must be between 1-40 characters",
        variant: "destructive"
      });
      return false;
    }

    if (formData.bio && formData.bio.length > 160) {
      toast({
        title: "Bio too long",
        description: "Bio must be 160 characters or less",
        variant: "destructive"
      });
      return false;
    }

    if (formData.link && !formData.link.match(/^https?:\/\/.+/)) {
      toast({
        title: "Invalid link",
        description: "Link must start with http:// or https://",
        variant: "destructive"
      });
      return false;
    }

    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // age--;
      }
      
      if (age < 13) {
        toast({
          title: "Age requirement",
          description: "You must be at least 13 years old",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      localStorage.setItem('userProfile', JSON.stringify(formData));
      setOriginalData(formData);
      
      toast({ 
        title: "Profile updated", 
        description: "Your profile has been saved successfully",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setFormData(prev => ({ ...prev, avatar: dataUrl }));
          toast({ title: "Avatar updated", description: "Your profile picture has been changed" });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleNavigateAway = () => {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    navigate(-1);
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
              onClick={handleNavigateAway}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Edit Profile</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="text-primary"
          >
            {isSaving ? 'Saving...' : 'Done'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-24 h-24">
            <AvatarImage src={formData.avatar} />
            <AvatarFallback>
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleAvatarChange}
            className="text-primary"
          >
            <Camera size={16} className="mr-2" />
            Change Picture
          </Button>
        </div>

        {/* Public Profile Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Public profile data</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                maxLength={40}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Describe yourself"
                maxLength={160}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formData.link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>
        </div>

        {/* Private Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Private data</h3>
            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">?</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select 
                value={formData.sex || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span className="text-primary">Select</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Add bottom padding to prevent content being cut off */}
        <div className="pb-32"></div>

        {/* Sticky Save Button */}
        {isDirty && (
          <div className="action-bar-mobile">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full shadow-lg bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};