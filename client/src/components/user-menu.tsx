import { useState } from "react";
import { useLocation } from "wouter";
import { User, LogOut, Settings, Store, ChevronDown, Shield, Bell, RefreshCw, Moon, Sun, Eye } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user?: {
    name: string;
    type: "user" | "business";
    avatar?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Check if current user is admin
  const isAdmin = localStorage.getItem("adminAuth") === "true";

  if (!user) {
    return (
      <Button
        onClick={() => setLocation("/login")}
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-sudan-red"
      >
        تسجيل الدخول
      </Button>
    );
  }

  const handleLogout = () => {
    // Clear user session/localStorage here
    setLocation("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent space-x-2 space-x-reverse transition-colors px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
            <span className="font-medium text-sm">
              {isAdmin ? "المدير العام" : (user.type === "business" ? `${user.name} - صاحب عمل` : user.name)}
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-border">
          <p className="text-sm font-medium text-gray-900 dark:text-foreground">{isAdmin ? "أحمد محمد" : user.name}</p>
          <p className="text-xs text-gray-600 dark:text-muted-foreground">
            {isAdmin ? "المدير العام – صلاحيات كاملة 👨‍💼" : (user.type === "business" ? "صاحب عمل 💼" : "مستخدم عادي 👤")}
          </p>
        </div>
        
        
        {/* Theme Toggle */}
        <DropdownMenuItem onClick={toggleTheme} className="hover:bg-gray-50 dark:hover:bg-accent">
          {theme === "light" ? (
            <Moon className="ml-2 h-4 w-4 text-gray-600 dark:text-muted-foreground" />
          ) : (
            <Sun className="ml-2 h-4 w-4 text-yellow-500" />
          )}
          <span>{theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/admin-dashboard")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <Shield className="ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
              <span>لوحة تحكم المطوّر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/settings")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <Settings className="ml-2 h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              <span>إعدادات النظام</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/dashboard")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <RefreshCw className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>الرجوع إلى الواجهة العامة</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-accent">
              <Bell className="ml-2 h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              <span>الإشعارات</span>
              <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded-full">3</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {user.type === "business" && !isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/business-dashboard")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <Store className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>لوحة تحكم المتجر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/store-settings")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <Settings className="ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
              <span>إعدادات المتجر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('/stores', '_blank')} className="hover:bg-gray-50 dark:hover:bg-accent">
              <Eye className="ml-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>معاينة المتجر كما يراه العميل</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/dashboard")} className="hover:bg-gray-50 dark:hover:bg-accent">
              <RefreshCw className="ml-2 h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              <span>الرجوع إلى الواجهة العامة</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {!isAdmin && (
          <>
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-accent">
              <Settings className="ml-2 h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="ml-2 h-4 w-4" />
          <span className="font-medium">تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}