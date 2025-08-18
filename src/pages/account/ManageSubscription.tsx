import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ManageSubscription = () => {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-semibold">Manage Subscription</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <span className="text-2xl">🚧</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Coming Soon</h2>
            <p className="text-muted-foreground max-w-sm">
              Subscription management features will be available soon. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};