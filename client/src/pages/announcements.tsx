import { ArrowRight, Plus, Calendar, Phone, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function AnnouncementsPage() {
  const [, setLocation] = useLocation();

  const categories = ["الكل", "مناسبات", "بيع وشراء", "عقارات", "خدمات"];
  
  const announcements = [
    {
      id: 1,
      type: "event",
      title: "احتفالية اليوم الوطني السوداني",
      description: "انضموا إلينا للاحتفال باليوم الوطني السوداني في قاعة الفراهيدي",
      date: "السبت ١٥ يناير ٢٠٢٥",
      isNew: true,
    },
    {
      id: 2,
      type: "sale",
      title: "سيارة للبيع - هونداي النترا ٢٠١٨",
      description: "سيارة في حالة ممتازة، كيلومترات قليلة، فحص حديث",
      price: "٤٥٠٠ د.ك",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      postedTime: "منذ ساعتين",
    },
    {
      id: 3,
      type: "rental",
      title: "شقة مفروشة للإيجار - حولي",
      description: "شقة غرفتين وصالة، مفروشة بالكامل، مطبخ مجهز",
      price: "٣٥٠ د.ك شهرياً",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      postedTime: "منذ يوم",
    },
    {
      id: 4,
      type: "service",
      title: "خدمات صيانة منزلية",
      description: "صيانة المنازل والمكاتب، كهرباء وسباكة، خدمة ٢٤ ساعة",
      price: "أسعار منافسة",
      postedTime: "منذ ٣ أيام",
    },
  ];

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case "event":
        return { label: "مناسبة خاصة", color: "bg-gradient-to-r from-sudan-red to-sudan-green text-white" };
      case "sale":
        return { label: "بيع", color: "bg-sudan-yellow text-gray-800" };
      case "rental":
        return { label: "إيجار", color: "bg-blue-500 text-white" };
      case "service":
        return { label: "خدمة", color: "bg-gray-200 text-gray-700" };
      default:
        return { label: "عام", color: "bg-gray-200 text-gray-700" };
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">الإعلانات</h2>
              <p className="text-sm text-gray-600">أحدث المناسبات والإعلانات</p>
            </div>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold">
            <Plus className="h-3 w-3 ml-1" />
            إضافة إعلان
          </button>
        </div>

        {/* Announcement Categories */}
        <div className="flex space-x-2 space-x-reverse mb-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-bold ${
                index === 0
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Announcements Feed */}
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const badge = getCategoryBadge(announcement.type);
            
            if (announcement.type === "event") {
              return (
                <div key={announcement.id} className="bg-gradient-to-r from-sudan-red to-sudan-green rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="h-5 w-5" />
                      <span className="font-bold">مناسبة خاصة</span>
                    </div>
                    <span className="bg-white text-sudan-red px-2 py-1 rounded-full text-xs font-bold">جديد</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{announcement.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Calendar className="h-4 w-4 inline ml-1" />
                      {announcement.date}
                    </div>
                    <button className="bg-white text-sudan-red px-4 py-2 rounded-full text-sm font-bold">
                      التفاصيل
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={announcement.id} 
                className={`bg-white rounded-2xl p-5 shadow-lg ${
                  announcement.type === "sale" ? "border-r-4 border-sudan-yellow" : ""
                }`}
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  {announcement.image ? (
                    <img 
                      src={announcement.image} 
                      alt={announcement.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center">
                      <i className="fas fa-tools text-sudan-green text-2xl"></i>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sudan-green font-bold text-lg">{announcement.price}</span>
                      <div className="text-xs text-gray-500">{announcement.postedTime}</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse mt-4">
                  <button className="bg-sudan-red text-white px-4 py-2 rounded-full text-sm font-bold flex-1">
                    <Phone className="h-3 w-3 ml-1" />
                    اتصال
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-bold">
                    <MessageCircle className="h-3 w-3 ml-1" />
                    رسالة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
