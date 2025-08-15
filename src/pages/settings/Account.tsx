import { useState, useEffect } from "react";
import { ArrowLeft, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<UserProfile>({});
  const [originalData, setOriginalData] = useState<UserProfile>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setFormData(savedProfile);
    setOriginalData(savedProfile);
  }, []);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate birthday if provided
      if (formData.birthday && !isValidDate(formData.birthday)) {
        toast({ 
          title: "Invalid date", 
          description: "Please enter a valid birthday",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem('userProfile', JSON.stringify(formData));
      setOriginalData(formData);
      
      toast({ 
        title: "Profile updated", 
        description: "Your profile has been saved successfully",
        duration: 2000
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  const handleSignOut = () => {
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
    
    toast({ title: "Signed out", description: "Redirecting to login..." });
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    toast({ 
      title: "Account deleted", 
      description: "All data has been permanently removed" 
    });
    navigate('/signup');
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
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
            <h1 className="text-xl font-semibold">Account</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <Label htmlFor="link">Website</Label>
              <Input
                id="link"
                value={formData.link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <Label htmlFor="sex">Sex</Label>
              <Select 
                value={formData.sex || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value as any }))}
              >
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
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4 pt-6 border-t">
          <h2 className="text-lg font-semibold">Account Actions</h2>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full" disabled>
              Change Username (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Change Email (Coming Soon)
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Update Password (Coming Soon)
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSignOut}
            >
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
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                  >
                    Delete Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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