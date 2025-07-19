import { NavLink, useLocation } from "react-router-dom";
import { Home, Dumbbell, Apple, CheckCircle, User } from "lucide-react";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/workout", icon: Dumbbell, label: "Workout" },
  { path: "/nutrition", icon: Apple, label: "Nutrition" },
  { path: "/habits", icon: CheckCircle, label: "Habits" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const MobileNavigation = () => {
  const location = useLocation();

  return (
    <nav className="tab-bar">
      <div className="flex">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`tab-item ${isActive ? 'active' : ''}`}
            >
              <Icon 
                size={20} 
                className={isActive ? "text-primary" : "text-muted-foreground"} 
              />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};