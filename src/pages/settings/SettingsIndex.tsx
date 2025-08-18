import { ArrowLeft, ChevronRight, User, Lock, CreditCard, Bell, Shield, Ruler, Globe, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SettingsIndex = () => {
  const navigate = useNavigate();

  const accountItems = [
    { title: "Profile", path: "/account/profile", icon: User },
    { title: "Account Settings", path: "/account/settings", icon: Lock },
    { title: "Manage Subscription", path: "/account/subscription", icon: CreditCard, disabled: true, comingSoon: true },
    { title: "Notifications", path: "/account/notifications", icon: Bell },
  ];

  const preferencesItems = [
    { title: "Privacy & Social", path: "/preferences/privacy-social", icon: Shield },
    { title: "Units", path: "/preferences/units", icon: Ruler },
    { title: "Language", path: "/preferences/language", icon: Globe },
    { title: "Theme", path: "/preferences/theme", icon: Moon },
  ];

  // hidden for now – feature not ready
  // const hiddenItems = [
  //   { title: "Workouts", path: "/settings/workouts" },
  //   { title: "Apple Health", path: "/settings/apple-health" },
  //   { title: "Integrations", path: "/settings/integrations" },
  //   { title: "Export & Import Data", path: "/settings/export-import" },
  // ];

  const handleItemClick = (item: any) => {
    if (item.disabled) {
      // Show placeholder for coming soon items
      return;
    }
    navigate(item.path);
  };

  const renderMenuItem = (item: any, index: number, array: any[]) => {
    const Icon = item.icon;
    const isLast = index === array.length - 1;
    
    return (
      <button
        key={item.path}
        onClick={() => handleItemClick(item)}
        className={`
          w-full flex items-center justify-between px-4 py-4 text-left
          transition-colors 
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}
          ${!isLast ? 'border-b border-border' : ''}
        `}
        disabled={item.disabled}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-muted-foreground" />
          <span className={`font-medium ${item.comingSoon ? 'text-muted-foreground' : ''}`}>
            {item.title}
            {item.comingSoon && (
              <span className="text-xs text-muted-foreground ml-2">(Coming soon)</span>
            )}
          </span>
        </div>
        {!item.disabled && <ChevronRight size={16} className="text-muted-foreground" />}
      </button>
    );
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
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Account Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">
            Account
          </h2>
          <div className="bg-card rounded-lg border">
            {accountItems.map((item, index) => renderMenuItem(item, index, accountItems))}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-2">
            Preferences
          </h2>
          <div className="bg-card rounded-lg border">
            {preferencesItems.map((item, index) => renderMenuItem(item, index, preferencesItems))}
          </div>
        </div>

        {/* Additional Links */}
        <div className="space-y-4 pt-8 border-t">
          <button
            onClick={() => navigate('/about')}
            className="w-full text-left px-2 py-2 hover:text-foreground transition-colors text-muted-foreground"
          >
            About Discipra
          </button>
        </div>
      </div>
    </div>
  );
};