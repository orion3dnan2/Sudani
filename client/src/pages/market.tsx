import { ArrowRight, Search, Plus, ShoppingBasket, MessageCircle, Filter } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function MarketPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const categories = [
    { name: "الكل", icon: "🏪", count: 12 },
    { name: "أطعمة", icon: "🍽️", count: 5 },
    { name: "توابل", icon: "🌶️", count: 3 },
    { name: "ملابس", icon: "👕", count: 2 },
    { name: "أدوات منزلية", icon: "🏠", count: 2 },
  ];
  
  const allProducts = [
    {
      id: 1,
      name: "توابل سودانية مشكلة",
      description: "توابل أصيلة من السودان - خليط مميز من الكمون والكزبرة والحلبة",
      price: "٥ د.ك",
      category: "توابل",
      seller: "أم أحمد للتوابل",
      phone: "+96599123456",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isAvailable: true,
      rating: 4.8,
    },
    {
      id: 2,
      name: "قهوة سودانية محمصة",
      description: "قهوة محمصة تقليدياً بالطريقة السودانية الأصيلة",
      price: "٨ د.ك",
      category: "أطعمة",
      seller: "مقهى النيل الأزرق",
      phone: "+96599234567",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isAvailable: true,
      rating: 4.9,
    },
    {
      id: 3,
      name: "جلابية سودانية أصيلة",
      description: "جلابية تقليدية سودانية مصنوعة من القطن الخالص",
      price: "١٥ د.ك",
      category: "ملابس",
      seller: "بيت الأزياء السودانية",
      phone: "+96599345678",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isAvailable: true,
      rating: 4.7,
    },
    {
      id: 4,
      name: "تمور وحلويات سودانية",
      description: "تشكيلة مميزة من التمور والحلويات السودانية التقليدية",
      price: "١٢ د.ك",
      category: "أطعمة",
      seller: "حلويات السودان",
      phone: "+96599456789",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isAvailable: true,
      rating: 4.6,
    },
    {
      id: 5,
      name: "أواني طبخ تقليدية",
      description: "أواني طبخ سودانية تقليدية من الفخار والمعدن",
      price: "٢٠ د.ك",
      category: "أدوات منزلية",
      seller: "التراث السوداني",
      phone: "+96599567890",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      isAvailable: false,
      rating: 4.5,
    },
  ];

  const filteredProducts = selectedCategory === "الكل" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  const handleWhatsAppOrder = (product: typeof allProducts[0]) => {
    const message = encodeURIComponent(
      `السلام عليكم\nأريد طلب: ${product.name}\nالسعر: ${product.price}\nمن: ${product.seller}`
    );
    const whatsappUrl = `https://wa.me/${product.phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xs ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">السوق السوداني</h2>
              <p className="text-sm text-gray-600">منتجات أصيلة من السودان</p>
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button className="w-10 h-10 bg-sudan-red rounded-full flex items-center justify-center shadow-md">
              <Search className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex space-x-3 space-x-reverse overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm whitespace-nowrap font-medium transition-all ${
                  selectedCategory === category.name
                    ? "bg-sudan-red text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-base">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({category.count})</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {filteredProducts.length > 0 
              ? `${filteredProducts.length} منتج متاح`
              : "لا توجد منتجات"
            }
          </div>
          <div className="text-xs text-gray-500">
            آخر تحديث: الآن
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">غير متوفر حالياً</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-md">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <div className="flex">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        البائع: {product.seller}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-sudan-red">{product.price}</div>
                    <div className="flex space-x-2 space-x-reverse">
                      {product.isAvailable ? (
                        <>
                          <button 
                            onClick={() => handleWhatsAppOrder(product)}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-1 space-x-reverse shadow-md hover:bg-green-600 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>اطلب الآن</span>
                          </button>
                          <button className="bg-sudan-red text-white p-2 rounded-xl shadow-md hover:bg-red-600 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button 
                          disabled
                          className="bg-gray-300 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
                        >
                          غير متوفر
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBasket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد منتجات حالياً</h3>
            <p className="text-sm text-gray-600 mb-6">
              عذراً، لا توجد منتجات متاحة في هذه الفئة في الوقت الحالي
            </p>
            <button 
              onClick={() => setSelectedCategory("الكل")}
              className="bg-sudan-red text-white px-6 py-3 rounded-full font-bold text-sm"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}

        {/* Floating Actions */}
        {filteredProducts.length > 0 && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 space-x-reverse">
            <button className="bg-sudan-red text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 space-x-reverse">
              <ShoppingBasket className="h-5 w-5" />
              <span>السلة (٠)</span>
            </button>
            <button className="bg-white text-sudan-red p-3 rounded-full shadow-lg border border-sudan-red">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
