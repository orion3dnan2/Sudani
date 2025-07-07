import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-sudan-red to-sudan-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">سك</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">سوداني في الكويت</h1>
              <p className="text-xs text-gray-500">جاليتك في خدمتك</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
