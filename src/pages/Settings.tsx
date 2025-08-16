import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Privacy & Social", path: "/settings/privacy" },
    { title: "Units", path: "/settings/units" },
    { title: "Language", path: "/settings/language" },
    { title: "Theme", path: "/settings/theme" },
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
      <div className="px-4 py-6">
        {/* Main Settings Menu */}
        <div className="bg-card rounded-lg border">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center justify-between px-4 py-4 text-left
                transition-colors hover:bg-muted/50
                ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}
              `}
            >
              <span className="font-medium">{item.title}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Additional Links */}
        <div className="space-y-4 pt-8 border-t mt-8">
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