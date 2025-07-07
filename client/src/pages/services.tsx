import { ArrowRight, Utensils, Scissors, Wrench, Car, Phone } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function ServicesPage() {
  const [, setLocation] = useLocation();

  const serviceCategories = [
    { name: "مطاعم", count: "١٥ مطعم", icon: Utensils },
    { name: "صالونات", count: "٨ صالون", icon: Scissors },
    { name: "خدمات تقنية", count: "١٢ شركة", icon: Wrench },
    { name: "مواصلات", count: "٦ خدمات", icon: Car },
  ];

  const featuredServices = [
    {
      id: 1,
      name: "مطعم الأصالة السوداني",
      description: "أطباق سودانية أصيلة",
      rating: "٤.٨",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
    {
      id: 2,
      name: "صالون الجمال السوداني",
      description: "خدمات تجميل متكاملة",
      rating: "٤.٣",
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
    {
      id: 3,
      name: "مكتب الخرطوم للاستشارات",
      description: "استشارات قانونية ومالية",
      rating: "٥.٠",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
  ];

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xs ${i <= numRating ? "text-yellow-400" : "text-gray-300"}`}>
          ⭐
        </span>
      );
    }
    return stars;
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
              <h2 className="text-xl font-bold text-gray-800">دليل الخدمات</h2>
              <p className="text-sm text-gray-600">خدمات الجالية السودانية</p>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-sudan-green" />
                </div>
                <h3 className="font-bold text-sm">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.count}</p>
              </div>
            );
          })}
        </div>

        {/* Featured Services */}
        <div className="space-y-4">
          {featuredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(service.rating)}
                    </div>
                    <span className="text-xs text-gray-600 mr-2">{service.rating}</span>
                  </div>
                </div>
                <button className="bg-sudan-green text-white p-2 rounded-full">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
