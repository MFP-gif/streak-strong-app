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
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [usernameForm, setUsernameForm] = useState({ username: '', currentPassword: '' });
  const [emailForm, setEmailForm] = useState({ email: '', currentPassword: '' });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const accountActions = [
    {
      title: "Change Username",
      description: "Update your username",
      icon: User,
      onClick: () => setUsernameDialogOpen(true),
    },
    {
      title: "Change Email",
      description: "Update your email address",
      icon: Mail,
      onClick: () => setEmailDialogOpen(true),
    },
    {
      title: "Update Password",
      description: "Change your account password",
      icon: Lock,
      onClick: () => setPasswordDialogOpen(true),
    },
  ];

  const validateUsername = (username: string) => {
    if (username.length < 3 || username.length > 20) {
      return "Username must be 3-20 characters";
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return "Username can only contain lowercase letters, numbers, and underscores";
    }
    return null;
  };

  const validateEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and numbers";
    }
    return null;
  };

  const handleUsernameChange = async () => {
    const usernameError = validateUsername(usernameForm.username);
    if (usernameError) {
      toast({ title: "Invalid username", description: usernameError, variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      profile.username = usernameForm.username;
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      toast({ title: "Username updated", description: "Your username has been changed successfully" });
      setUsernameDialogOpen(false);
      setUsernameForm({ username: '', currentPassword: '' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update username", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChange = async () => {
    const emailError = validateEmail(emailForm.email);
    if (emailError) {
      toast({ title: "Invalid email", description: emailError, variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      profile.email = emailForm.email;
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      toast({ 
        title: "Email updated", 
        description: "Verification email sent to your new address",
        duration: 4000 
      });
      setEmailDialogOpen(false);
      setEmailForm({ email: '', currentPassword: '' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update email", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Password mismatch", description: "New passwords don't match", variant: "destructive" });
      return;
    }
    
    const passwordError = validatePassword(passwordForm.newPassword);
    if (passwordError) {
      toast({ title: "Invalid password", description: passwordError, variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({ title: "Password updated", description: "Your password has been changed successfully" });
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update password", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
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
      navigate('/');
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
      navigate('/');
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
    <div className="min-h-screen bg-background pb-20">
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

      {/* Username Change Dialog */}
      <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newUsername">New Username</Label>
              <Input
                id="newUsername"
                value={usernameForm.username}
                onChange={(e) => setUsernameForm(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                placeholder="Enter new username"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-1">
                3-20 characters, lowercase letters, numbers, and underscores only
              </p>
            </div>
            <div>
              <Label htmlFor="currentPasswordUsername">Current Password</Label>
              <Input
                id="currentPasswordUsername"
                type="password"
                value={usernameForm.currentPassword}
                onChange={(e) => setUsernameForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsernameDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUsernameChange}
              disabled={!usernameForm.username || !usernameForm.currentPassword || isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Username'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Change Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter new email address"
              />
            </div>
            <div>
              <Label htmlFor="currentPasswordEmail">Current Password</Label>
              <Input
                id="currentPasswordEmail"
                type="password"
                value={emailForm.currentPassword}
                onChange={(e) => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send a verification email to your new address.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEmailChange}
              disabled={!emailForm.email || !emailForm.currentPassword || isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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