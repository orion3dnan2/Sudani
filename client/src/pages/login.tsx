import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, User, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"user" | "business">("user");
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
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
    
    // Mock authentication - replace with real API call
    console.log("تسجيل الدخول:", { 
      email: formData.email, 
      userType, 
      isLogin 
    });
    
    // Redirect based on user type
    if (userType === "business") {
      setLocation("/business-dashboard");
    } else {
      setLocation("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("كلمات المرور غير متطابقة");
      return;
    }
    
    // Mock signup - replace with real API call
    console.log("إنشاء حساب جديد:", { 
      ...formData, 
      userType 
    });
    
    // Redirect to appropriate dashboard
    if (userType === "business") {
      setLocation("/business-dashboard");
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sudan-red to-sudan-green p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-sudan-red">البيت</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">البيت السوداني</h1>
          <p className="text-white/80 text-sm">منصة الجالية السودانية في الكويت</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">حساب جديد</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">نوع المستخدم</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("user")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === "user"
                      ? "border-sudan-green bg-sudan-green/10 text-sudan-green"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">مستخدم عادي</div>
                  <div className="text-xs opacity-75">زائر - عامة الناس</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType("business")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    userType === "business"
                      ? "border-sudan-red bg-sudan-red/10 text-sudan-red"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">صاحب عمل</div>
                  <div className="text-xs opacity-75">متجر أو خدمات</div>
                </button>
              </div>
            </div>

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              {/* Email/Phone Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <Input
                  type="text"
                  placeholder="example@email.com أو +96599123456"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="text-right"
                  required
                />
              </div>

              {/* Business Fields for Signup */}
              {!isLogin && userType === "business" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">اسم المتجر/الشركة</label>
                    <Input
                      type="text"
                      placeholder="مثال: مطعم الأصالة السوداني"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="text-right"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">نوع النشاط التجاري</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-right"
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
                    className="text-right pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="text-right"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                  userType === "business"
                    ? "bg-sudan-red hover:bg-red-600"
                    : "bg-sudan-green hover:bg-green-600"
                }`}
              >
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </Button>
            </form>

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-center">
                <button className="text-sm text-sudan-blue hover:underline">
                  نسيت كلمة المرور؟
                </button>
              </div>
            )}

            {/* Guest Access */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => setLocation("/dashboard")}
                className="flex items-center justify-center space-x-2 space-x-reverse text-gray-600 hover:text-sudan-green transition-colors mx-auto"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">الدخول كزائر</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/70 text-xs">
          <p>بتسجيل الدخول، أنت توافق على</p>
          <div className="flex justify-center space-x-4 space-x-reverse mt-1">
            <button className="hover:text-white underline">شروط الاستخدام</button>
            <span>•</span>
            <button className="hover:text-white underline">سياسة الخصوصية</button>
          </div>
        </div>
      </div>
    </div>
  );
}