import { useLocation } from "wouter";
import { Home, ShoppingBasket, Building, Briefcase, Megaphone, Store, LogOut, Settings, User, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  // Mock user data - replace with real authentication state
  const mockUser = {
    name: "أحمد محمد",
    type: "business" as const, // Could be "business" or "user"
    avatar: undefined
  };

  // Check if current user is admin
  const isAdmin = localStorage.getItem("adminAuth") === "true";

  const navItems = [
    { path: "/dashboard", icon: Home, label: "الرئيسية" },
    { path: "/market", icon: ShoppingBasket, label: "السوق" },
    { path: "/stores", icon: Store, label: "محلات" },
    { path: "/services", icon: Building, label: "الخدمات" },
    { path: "/jobs", icon: Briefcase, label: "الوظائف" },
    { path: "/announcements", icon: Megaphone, label: "الإعلانات" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-sudan-gold px-4 py-3 transition-all duration-300 backdrop-blur-sm shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                  isActive ? "text-sudan-red bg-sudan-sand/50 dark:bg-sudan-copper/30 border border-sudan-gold shadow-lg" : "text-sudan-earth dark:text-sudan-sand hover:bg-sudan-sand/30 dark:hover:bg-sudan-copper/20 hover:text-sudan-red"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}



          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                location === "/admin-dashboard" || location === "/business-dashboard" || location === "/jobs" || location === "/announcements"
                  ? "text-sudan-red bg-sudan-sand/50 dark:bg-sudan-copper/30 border border-sudan-gold shadow-lg" 
                  : "text-sudan-earth dark:text-sudan-sand hover:bg-sudan-sand/30 dark:hover:bg-sudan-copper/20 hover:text-sudan-red"
              }`}>
                <User className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">الحساب</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={8} className="w-56">
              {/* Jobs and Announcements moved here */}
              <DropdownMenuItem onClick={() => setLocation("/jobs")}>
                <Briefcase className="ml-2 h-4 w-4" />
                <span>الوظائف</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/announcements")}>
                <Megaphone className="ml-2 h-4 w-4" />
                <span>الإعلانات</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Admin Dashboard - Only for admins */}
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => setLocation("/admin-dashboard")}>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>لوحة تحكم المطور</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Business Dashboard - Only for business owners */}
              {mockUser.type === "business" && !isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => setLocation("/business-dashboard")}>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>لوحة تحكم المتجر</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/store-settings")}>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>إعدادات المتجر</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open('/stores', '_blank')}>
                    <Eye className="ml-2 h-4 w-4" />
                    <span>معاينة متجري كما يراه الزبون</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              {/* Logout */}
              <DropdownMenuItem 
                onClick={() => setLocation("/login")} 
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="ml-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
