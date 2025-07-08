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
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-sudan-red to-sudan-green rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🏠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">البيت السوداني</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">جاليتك في خدمتك 🇸🇩</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title={theme === "light" ? "تبديل للوضع الليلي" : "تبديل للوضع النهاري"}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>

            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/admin-dashboard")}
                  className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800"
                  title="العودة إلى لوحة التحكم"
                >
                  <Settings className="h-5 w-5 text-red-600 dark:text-red-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/dashboard")}
                  className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                  title="العودة إلى واجهة المستخدم"
                >
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="الإشعارات"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </>
            )}
            
            {mockUser ? (
              <UserMenu user={mockUser} />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/login")}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                title="تسجيل الدخول"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
