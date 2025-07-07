import { ArrowRight, Search, Plus } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function MarketPage() {
  const [, setLocation] = useLocation();

  const categories = ["الكل", "أطعمة", "توابل", "حرف يدوية", "ملابس"];
  
  const products = [
    {
      id: 1,
      name: "توابل سودانية مشكلة",
      description: "توابل أصيلة من السودان",
      price: "٥ د.ك",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      id: 2,
      name: "قهوة سودانية",
      description: "قهوة محمصة تقليدياً",
      price: "٨ د.ك",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      id: 3,
      name: "أقمشة تقليدية",
      description: "أقمشة سودانية أصيلة",
      price: "١٥ د.ك",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      id: 4,
      name: "تمور وحلويات",
      description: "حلويات سودانية تقليدية",
      price: "١٢ د.ك",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
  ];

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
              <h2 className="text-xl font-bold text-gray-800">السوق السوداني</h2>
              <p className="text-sm text-gray-600">منتجات أصيلة من السودان</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-sudan-red rounded-full flex items-center justify-center">
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 space-x-reverse mb-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                index === 0
                  ? "bg-sudan-red text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sudan-red font-bold">{product.price}</span>
                  <button className="bg-sudan-red text-white p-2 rounded-full">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Button */}
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2">
          <button className="bg-sudan-red text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 space-x-reverse">
            <ShoppingBasket className="h-5 w-5" />
            <span>السلة (٣)</span>
            <div className="bg-white text-sudan-red w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">٣</div>
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
