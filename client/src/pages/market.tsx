import { ArrowRight, Search, Plus, ShoppingBasket, MessageCircle, Filter, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import type { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function MarketPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const categories = [
    { name: "الكل", icon: "🏪", count: 12 },
    { name: "أطعمة", icon: "🍽️", count: 5 },
    { name: "توابل", icon: "🌶️", count: 3 },
    { name: "ملابس", icon: "👕", count: 2 },
    { name: "أدوات منزلية", icon: "🏠", count: 2 },
  ];
  
  // Fetch products from database
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['/api/products', selectedCategory],
    queryFn: () => fetch(`/api/products?category=${encodeURIComponent(selectedCategory)}`).then(res => res.json()) as Promise<Product[]>
  });

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsAppOrder = (product: Product) => {
    const message = encodeURIComponent(
      `السلام عليكم\nأريد طلب: ${product.name}\nالسعر: ${product.price} د.ك\nرقم المنتج: ${product.id}`
    );
    const phone = product.whatsappPhone || "+96599123456";
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Form for adding new products
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      whatsappPhone: "",
    }
  });

  // Mutation for adding new product
  const addProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "تم إضافة المنتج الجديد إلى السوق السوداني",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة المنتج",
        description: "حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertProduct) => {
    addProductMutation.mutate(data);
  };

  const renderStars = (rating: number = 4.5) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sudan-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">خطأ في تحميل المنتجات</h3>
            <p className="text-sm text-gray-600 mb-6">
              عذراً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-sudan-red text-white px-6 py-3 rounded-full font-bold text-sm"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-2xl px-12 py-4 text-sm border-2 border-gray-100 focus:border-sudan-red focus:outline-none"
            />
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
                    src={product.imageUrl || "/api/placeholder/400/200"} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">غير متوفر حالياً</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 shadow-md">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <div className="flex">
                        {renderStars(4.5)}
                      </div>
                      <span className="text-xs font-bold text-gray-700">4.5</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        فئة: {product.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-sudan-red">{product.price} د.ك</div>
                    <div className="flex space-x-2 space-x-reverse">
                      {product.isActive ? (
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
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-white text-sudan-red p-3 rounded-full shadow-lg border border-sudan-red"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة منتج جديد</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المنتج</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: توابل سودانية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المنتج</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصف مفصل للمنتج..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر (د.ك)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: 5.500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفئة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة المنتج" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="أطعمة">أطعمة</SelectItem>
                          <SelectItem value="توابل">توابل</SelectItem>
                          <SelectItem value="ملابس">ملابس</SelectItem>
                          <SelectItem value="أدوات منزلية">أدوات منزلية</SelectItem>
                          <SelectItem value="عطور">عطور</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsappPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الواتساب</FormLabel>
                      <FormControl>
                        <Input placeholder="+96599123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رابط الصورة (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-3 space-x-reverse pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={addProductMutation.isPending}
                    className="flex-1 bg-sudan-red hover:bg-red-700"
                  >
                    {addProductMutation.isPending ? "جاري الإضافة..." : "إضافة المنتج"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
