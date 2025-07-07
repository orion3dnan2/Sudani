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
              <span className="text-sudan-red">س</span>
              <span className="text-sudan-green">ك</span>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">سوداني في الكويت</h1>
        <p className="text-xl md:text-2xl mb-2 font-latin ltr">Sudanese in Kuwait</p>
        <p className="text-lg mb-8">جسر التواصل بين الجالية السودانية في دولة الكويت</p>
        <button 
          onClick={handleStart}
          className="bg-white text-sudan-red px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          ابدأ الآن
          <i className="fas fa-arrow-left mr-2"></i>
        </button>
      </div>
    </div>
  );
}
