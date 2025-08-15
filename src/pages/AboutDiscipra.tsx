import { ArrowLeft, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const AboutDiscipra = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">About Discipra</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* App Info */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl font-bold text-primary">Discipra</div>
            <p className="text-muted-foreground">
              Your complete fitness companion for tracking workouts, nutrition, and building healthy habits.
            </p>
            <div className="text-sm text-muted-foreground">
              Version 1.0.0
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Discipra was built to help you build lasting discipline in your fitness journey. 
                We believe that consistency beats perfection, and our app is designed to help you 
                track your progress, stay motivated, and build healthy habits that last a lifetime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What We Offer</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">🏋️ Workout Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Log your workouts, track your progress, and analyze your performance over time.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">🥗 Nutrition Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Track your daily calories and maintain a healthy relationship with food.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">📈 Habit Building</h3>
                <p className="text-sm text-muted-foreground">
                  Create and maintain healthy habits with our intuitive tracking system.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">📊 Progress Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your progress with detailed charts and statistics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connect With Us</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="mailto:hello@discipra.com">
                    <Mail size={16} className="mr-3" />
                    hello@discipra.com
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  <Instagram size={16} className="mr-3" />
                  @discipra (Coming Soon)
                </Button>
                <Button variant="outline" className="justify-start" disabled>
                  <Twitter size={16} className="mr-3" />
                  @discipra (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Legal</h2>
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button variant="ghost" className="justify-start p-0 h-auto" disabled>
                Privacy Policy (Coming Soon)
              </Button>
              <Button variant="ghost" className="justify-start p-0 h-auto" disabled>
                Terms of Service (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          Made with ❤️ for the fitness community
        </div>
      </div>
    </div>
  );
};