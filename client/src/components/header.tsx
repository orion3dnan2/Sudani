import { Bell, User, LogOut, Settings, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import UserMenu from "./user-menu";

export default function Header() {
  const [, setLocation] = useLocation();
  
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-sudan-red to-sudan-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">بس</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">البيت السوداني</h1>
              <p className="text-xs text-gray-500">جاليتك في خدمتك</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            {isAdmin && (
              <>
                <button 
                  onClick={() => setLocation("/admin-dashboard")}
                  className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  title="العودة إلى لوحة التحكم"
                >
                  <Settings className="h-5 w-5 text-red-600" />
                </button>
                <button 
                  onClick={() => setLocation("/dashboard")}
                  className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                  title="🔁 العودة إلى واجهة المستخدم"
                >
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </button>
                <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </>
            )}
            {mockUser ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <UserMenu user={mockUser} />
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setLocation("/login")}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
