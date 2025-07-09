import { useState } from "react";
import { useLocation } from "wouter";
import { User, LogOut, Settings, Store, ChevronDown, Shield } from "lucide-react";
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
  
  // Check if current user is admin
  const isAdmin = localStorage.getItem("adminAuth") === "true";

  if (!user) {
    return (
      <Button
        onClick={() => setLocation("/login")}
        variant="outline"
        className="border-sudan-gold text-sudan-earth dark:text-sudan-sand hover:bg-sudan-sand dark:hover:bg-sudan-copper/20 hover:text-sudan-red"
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
        <Button variant="ghost" className="text-sudan-earth dark:text-sudan-sand hover:bg-sudan-sand/20 dark:hover:bg-sudan-copper/20 space-x-2 space-x-reverse border border-sudan-gold/30">
          <div className="flex items-center space-x-2 space-x-reverse">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-sudan-gold/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-sudan-earth dark:text-sudan-sand" />
              </div>
            )}
            <span className="font-medium text-sudan-earth dark:text-sudan-sand">
              {isAdmin ? "المدير العام" : (user.type === "business" ? `${user.name} - صاحب عمل` : user.name)}
            </span>
            <ChevronDown className="w-4 h-4 text-sudan-earth dark:text-sudan-sand" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{isAdmin ? "أحمد محمد" : user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isAdmin ? "المدير العام – صلاحيات كاملة 👨‍💼" : (user.type === "business" ? "صاحب عمل 💼" : "مستخدم عادي 👤")}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/admin-dashboard")}>
              <Shield className="ml-2 h-4 w-4 text-red-600 dark:text-red-400" />
              <span>لوحة تحكم المطوّر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/settings")}>
              <Settings className="ml-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>إعدادات النظام</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
              <User className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>الرجوع إلى الواجهة العامة</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {user.type === "business" && !isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/business-dashboard")}>
              <Store className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>لوحة تحكم المتجر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/store-settings")}>
              <Settings className="ml-2 h-4 w-4 text-green-600 dark:text-green-400" />
              <span>إعدادات المتجر</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
              <User className="ml-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>الرجوع إلى الواجهة العامة</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {!isAdmin && (
          <>
            <DropdownMenuItem>
              <Settings className="ml-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}