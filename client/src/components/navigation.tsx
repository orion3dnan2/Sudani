import { useLocation } from "wouter";
import { Home, ShoppingBasket, Building, Briefcase, Megaphone, Store, LogOut } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "الرئيسية" },
    { path: "/market", icon: ShoppingBasket, label: "السوق" },
    { path: "/stores", icon: Store, label: "محلات" },
    { path: "/services", icon: Building, label: "الخدمات" },
    { path: "/jobs", icon: Briefcase, label: "الوظائف" },
    { path: "/announcements", icon: Megaphone, label: "الإعلانات" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? "text-sudan-red" : "text-gray-600"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={() => setLocation("/login")}
            className="flex flex-col items-center py-2 px-3 text-red-500 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">خروج</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
