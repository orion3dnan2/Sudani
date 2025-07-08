import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Admin credentials check
    if (credentials.username === "admin" && credentials.password === "123456") {
      // Store admin session in localStorage
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("userType", "admin");
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم المدير العام",
      });
      
      setLocation("/admin-dashboard");
    } else {
      toast({
        title: "خطأ في بيانات الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم المطور</h1>
          <p className="text-gray-300 text-sm">دخول المدير العام للنظام</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-lg text-white">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <Lock className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold">تسجيل دخول المدير</h2>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  اسم المستخدم
                </label>
                <Input
                  type="text"
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-white/20 border-white/30 text-white placeholder-gray-300 text-right"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">كلمة المرور</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white placeholder-gray-300 text-right pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-lg"
              >
                {isLoading ? "جاري التحقق..." : "دخول النظام"}
              </Button>
            </form>

            {/* Back to Main */}
            <div className="text-center pt-6 border-t border-white/20 mt-6">
              <button
                onClick={() => setLocation("/")}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>⚠️ هذه لوحة تحكم المطور - مخصصة للمدير العام فقط</p>
        </div>
      </div>
    </div>
  );
}