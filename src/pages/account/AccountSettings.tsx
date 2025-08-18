import { useState } from "react";
import { ArrowLeft, ChevronRight, User, Mail, Lock, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const accountActions = [
    {
      title: "Change Username",
      description: "Update your username",
      icon: User,
      onClick: () => handleUsernameChange(),
    },
    {
      title: "Change Email",
      description: "Update your email address",
      icon: Mail,
      onClick: () => handleEmailChange(),
    },
    {
      title: "Update Password",
      description: "Change your account password",
      icon: Lock,
      onClick: () => handlePasswordChange(),
    },
  ];

  const handleUsernameChange = () => {
    // TODO: Implement username change flow
    toast({
      title: "Feature coming soon",
      description: "Username change will be available soon"
    });
  };

  const handleEmailChange = () => {
    // TODO: Implement email change flow
    toast({
      title: "Feature coming soon",
      description: "Email change will be available soon"
    });
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change flow
    toast({
      title: "Feature coming soon",
      description: "Password change will be available soon"
    });
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // TODO: Replace with actual auth.signOut() call
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        title: "Confirmation required",
        description: "Please type 'DELETE' to confirm",
        variant: "destructive"
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      // TODO: Replace with actual user.deleteAccount() call
      localStorage.clear();
      
      toast({ 
        title: "Account deleted", 
        description: "All data has been permanently removed" 
      });
      navigate('/signup');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsDeletingAccount(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmText('');
    }
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
            <h1 className="text-xl font-semibold">Account Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Account Actions */}
        <div className="bg-card rounded-lg border">
          {accountActions.map((action, index) => {
            const Icon = action.icon;
            const isLast = index === accountActions.length - 1;
            
            return (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`
                  w-full flex items-center justify-between px-4 py-4 text-left
                  transition-colors hover:bg-muted/50
                  ${!isLast ? 'border-b border-border' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-muted-foreground" />
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Dangerous Actions */}
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full justify-start"
          >
            <LogOut size={16} className="mr-3" />
            {isSigningOut ? 'Signing out...' : 'Log Out'}
          </Button>

          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full justify-start"
          >
            <Trash2 size={16} className="mr-3" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <p className="text-sm font-medium">
              Type <span className="font-mono bg-muted px-1 rounded">DELETE</span> to confirm:
            </p>
            <div>
              <Label htmlFor="deleteConfirm" className="sr-only">
                Type DELETE to confirm
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount || deleteConfirmText !== 'DELETE'}
            >
              {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};