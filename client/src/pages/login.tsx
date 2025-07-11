import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, Shield, Briefcase, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username is "admin" (case insensitive)
    const isAdmin = formData.username.toLowerCase() === "admin";
    
    // For admin login, check password
    if (isAdmin) {
      if (formData.password === "123456") {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("userType", "admin");
        setLocation("/admin-dashboard");
      } else {
        alert("كلمة المرور غير صحيحة للمدير العام");
        return;
      }
    } else {
      // Regular business users
      localStorage.setItem("userType", "business");
      setLocation("/business-dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    
    // Check if username is "admin" (case insensitive)
    const isAdmin = formData.username.toLowerCase() === "admin";
    
    if (isAdmin) {
      alert("لا يمكن إنشاء حساب مدير جديد");
      return;
    }
    
    try {
      // Create new business user in database
      const userData = {
        username: formData.username,
        password: formData.password,
        fullName: formData.businessName || formData.username,
        phone: "", // This can be filled later in profile
        email: "", // This can be filled later in profile
      };
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "فشل في إنشاء الحساب");
        return;
      }
      
      // Store user data and redirect
      localStorage.setItem("userType", "business");
      localStorage.setItem("username", formData.username);
      setLocation("/business-dashboard");
      
    } catch (error) {
      console.error("Signup error:", error);
      alert("حدث خطأ أثناء إنشاء الحساب");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#114B5F] via-[#028090] to-[#E4F9F5] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white/20">
            <span className="text-2xl font-bold text-sudan-red">البيت</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-arabic">البيت السوداني</h1>
          <p className="text-white/90 text-base font-medium">منصة رواد الأعمال السودانيين في الكويت</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-4 pt-6">
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-1">
                <TabsTrigger 
                  value="login" 
                  className="rounded-xl text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-xl text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
                >
                  حساب جديد
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="space-y-6 px-6 pb-8">
            {isLogin && (
              <div className="bg-gradient-to-r from-teal-500/10 to-green-500/10 p-4 rounded-2xl border border-teal-200/50">
                <div className="flex items-center space-x-3 space-x-reverse mb-3">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <h3 className="text-sm font-semibold text-gray-800">تسجيل الدخول التلقائي</h3>
                </div>
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-3 h-3 text-sudan-red" />
                    <span>المدير العام: اسم المستخدم "Admin"</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Briefcase className="w-3 h-3 text-sudan-green" />
                    <span>أصحاب الأعمال: أي اسم مستخدم آخر</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  اسم المستخدم أو البريد الإلكتروني
                </label>
                <Input
                  type="text"
                  placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="text-right w-full py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Business Fields for Signup */}
              {!isLogin && formData.username.toLowerCase() !== "admin" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">اسم المتجر/الشركة</label>
                    <Input
                      type="text"
                      placeholder="مثال: مطعم الأصالة السوداني"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="text-right w-full py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50/50 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">نوع النشاط التجاري</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                      className="w-full py-4 border border-gray-200 rounded-2xl text-right bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                      required
                    >
                      <option value="">اختر نوع النشاط</option>
                      <option value="restaurant">مطعم</option>
                      <option value="store">متجر</option>
                      <option value="salon">صالون</option>
                      <option value="legal">خدمات قانونية</option>
                      <option value="tech">خدمات تقنية</option>
                      <option value="transport">مواصلات</option>
                      <option value="shipping">شركة شحن</option>
                      <option value="travel">سفر وسياحة</option>
                      <option value="medical">عيادة طبية</option>
                    </select>
                  </div>
                </>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="text-right w-full py-4 pl-12 pr-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50/50 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
                  <Input
                    type="password"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="text-right w-full py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50/50 transition-all duration-300"
                    required
                  />
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full bg-[#007F5F] hover:bg-[#006B4F] text-white py-4 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Lock className="w-5 h-5" />
                <span>{isLogin ? "تسجيل الدخول التلقائي" : "إنشاء حساب جديد"}</span>
              </Button>

              {/* Forgot Password Link (only for login) */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
                    onClick={() => alert("يرجى الاتصال بالمدير العام لإعادة تعيين كلمة المرور")}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
              )}
            </form>

            {/* Guest Access Section */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 bg-white px-4">أو</span>
              </div>
              <Button 
                onClick={() => setLocation("/dashboard")} 
                variant="outline"
                className="w-full py-3 text-base font-medium rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
              >
                الدخول كزائر
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4">
              بتسجيل الدخول، أنت توافق على{" "}
              <button className="text-teal-600 hover:underline">شروط الاستخدام</button>
              {" • "}
              <button className="text-teal-600 hover:underline">سياسة الخصوصية</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}