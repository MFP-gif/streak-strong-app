import { useState, useEffect } from "react";
import { ArrowLeft, User, Lock, CreditCard, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: Array<{
    title: string;
    path: string;
  }>;
}

export const Settings = () => {
  const navigate = useNavigate();

  const sections: SettingsSection[] = [
    {
      id: "account",
      title: "Account",
      icon: <User size={20} />,
      items: [
        { title: "Profile", path: "/settings/profile" },
        { title: "Account", path: "/settings/account" },
        { title: "Manage Subscription (Coming soon)", path: "" },
        { title: "Notifications (Coming soon)", path: "" },
      ]
    },
    {
      id: "preferences", 
      title: "Preferences",
      icon: <Lock size={20} />,
      items: [
        { title: "Workouts (Coming soon)", path: "" },
        { title: "Privacy & Social", path: "/settings/privacy" },
        { title: "Apple Health (Coming soon)", path: "" },
        { title: "Integrations (Coming soon)", path: "" },
        { title: "Export & Import Data (Coming soon)", path: "" },
      ]
    }
  ];

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
        {sections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-2 py-2">
              {section.icon}
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h2>
            </div>

            {/* Section Items */}
            <div className="bg-card rounded-lg border">
              {section.items.map((item, index) => (
                <button
                  key={item.path || item.title}
                  onClick={() => item.path && navigate(item.path)}
                  disabled={!item.path}
                  className={`
                    w-full flex items-center justify-between px-4 py-4 text-left
                    transition-colors
                    ${!item.path 
                      ? 'text-muted-foreground cursor-not-allowed' 
                      : 'hover:bg-muted/50'
                    }
                    ${index !== section.items.length - 1 ? 'border-b border-border' : ''}
                  `}
                >
                  <span className="font-medium">{item.title}</span>
                  {item.path && <ChevronRight size={16} className="text-muted-foreground" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Links */}
        <div className="space-y-4 pt-4 border-t">
          <button
            onClick={() => {/* Contact Us disabled */}}
            className="w-full text-left px-2 py-2 text-muted-foreground"
            disabled
          >
            Contact Us
          </button>
          
          <button
            onClick={() => navigate('/about')}
            className="w-full text-left px-2 py-2 hover:text-foreground transition-colors"
          >
            About Discipra
          </button>
        </div>
      </div>
    </div>
  );
};