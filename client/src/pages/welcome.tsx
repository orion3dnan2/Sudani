import { useEffect } from "react";
import { useLocation } from "wouter";

export default function WelcomePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  const handleStart = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="sudan-gradient h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 text-center px-6">
        <div className="pulse-logo mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-4xl font-bold">
              <span className="text-sudan-red">ب</span>
              <span className="text-sudan-green">س</span>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">البيت السوداني</h1>
        <p className="text-xl md:text-2xl mb-2 font-latin ltr">Sudanese House</p>
        <p className="text-lg mb-8">جسر التواصل بين الجالية السودانية في دولة الكويت</p>
        <div className="space-y-4 w-full max-w-sm">
          <button 
            onClick={() => setLocation("/login")}
            className="w-full bg-white text-sudan-red px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={handleStart}
            className="w-full border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-sudan-red transition-all duration-300"
          >
            الدخول كزائر
          </button>
          
          {/* Admin Access */}
          <div className="text-center pt-4">
            <button
              onClick={() => setLocation("/admin-login")}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              دخول المطور
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
