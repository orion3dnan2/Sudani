import { Bell, User, LogOut, Settings, RefreshCw, Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";
import UserMenu from "./user-menu";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Check if current user is admin
  const isAdmin = localStorage.getItem("adminAuth") === "true";
  
  // Mock user data - replace with real authentication state
  const mockUser = {
    name: "أحمد محمد",
    type: "business" as const,
    avatar: undefined
  };

  const handleLogout = () => {
    setLocation("/login");
  };

  return (
    <header className="bg-white dark:bg-card shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b border-gray-200 dark:border-border">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-14 h-14 bg-gradient-to-r from-sudan-red to-sudan-green rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🏠</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">البيت السوداني</h1>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">سوداني وخليك قدها 🇸🇩</p>
              {/* System Status Badge */}
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  نشط
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-accent transition-colors"
              title={theme === "light" ? "تبديل للوضع الليلي" : "تبديل للوضع النهاري"}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>
            
            {mockUser ? (
              <UserMenu user={mockUser} />
            ) : (
              <Button
                onClick={() => setLocation("/login")}
                variant="outline"
                className="border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent transition-colors px-6 py-2"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
