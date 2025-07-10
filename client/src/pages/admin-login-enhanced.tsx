import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginSchema, type LoginData } from "@shared/schema";

interface LoginResponse {
  user: {
    id: number;
    username: string;
    fullName: string;
    userType: string;
  };
  message: string;
}

export default function AdminLoginEnhanced() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطأ في تسجيل الدخول");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${data.user.fullName}`,
      });
      
      // Store user data in localStorage for persistence
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      
      // Redirect based on user type
      if (data.user.userType === "admin" || data.user.userType === "developer") {
        setLocation("/admin-super-dashboard");
      } else {
        setLocation("/admin-dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            البيت السوداني
          </h1>
          <p className="text-purple-200 text-lg">
            لوحة إدارة النظام
          </p>
          <div className="flex justify-center space-x-2 space-x-reverse mt-4">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              🔒 Super Admin
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              🛠️ Developer
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              تسجيل الدخول للإدارة
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              أدخل بيانات الدخول للوصول إلى لوحة الإدارة
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center space-x-2 space-x-reverse">
                  <User className="h-4 w-4" />
                  <span>اسم المستخدم</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  {...register("username")}
                  className="h-12 text-right"
                  dir="rtl"
                />
                {errors.username && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2 space-x-reverse">
                  <Lock className="h-4 w-4" />
                  <span>كلمة المرور</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    {...register("password")}
                    className="h-12 text-right pr-12"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span>دخول إلى النظام</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                بيانات تجريبية:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 dark:text-amber-300">مدير عام:</span>
                  <code className="bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded text-amber-800 dark:text-amber-200">
                    admin / 123456
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 dark:text-amber-300">مطور:</span>
                  <code className="bg-amber-100 dark:bg-amber-800 px-2 py-1 rounded text-amber-800 dark:text-amber-200">
                    developer / dev123
                  </code>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>إدارة المستخدمين</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>مراقبة النظام</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>إدارة المحتوى</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>التحليلات</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-purple-200 text-sm">
            © 2025 البيت السوداني - جميع الحقوق محفوظة
          </p>
          <p className="text-purple-300 text-xs mt-2">
            نظام إدارة متطور مع حماية أمنية عالية
          </p>
        </div>
      </div>
    </div>
  );
}