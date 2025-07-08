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
        <Button variant="ghost" className="text-white hover:bg-white/10 space-x-2 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="font-medium">{isAdmin ? "المدير العام" : user.name}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{isAdmin ? "المدير العام" : user.name}</p>
          <p className="text-xs text-gray-500">
            {isAdmin ? "صلاحيات كاملة" : (user.type === "business" ? "صاحب عمل" : "مستخدم عادي")}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/admin-dashboard")}>
              <Shield className="ml-2 h-4 w-4" />
              <span>لوحة تحكم المطوّر</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {user.type === "business" && !isAdmin && (
          <>
            <DropdownMenuItem onClick={() => setLocation("/business-dashboard")}>
              <Store className="ml-2 h-4 w-4" />
              <span>لوحة تحكم الأعمال</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem>
          <Settings className="ml-2 h-4 w-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}