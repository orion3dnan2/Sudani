import { ArrowRight, Store, ShoppingBag, Phone, Plus, X } from "lucide-react";
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

export default function StoresPage() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const storeCategories = [
    { name: "الكل", icon: Store, color: "bg-gray-500" },
    { name: "مواد غذائية", icon: ShoppingBag, color: "bg-sudan-red" },
    { name: "ملابس وأزياء", icon: ShoppingBag, color: "bg-sudan-green" },
    { name: "إلكترونيات", icon: ShoppingBag, color: "bg-sudan-yellow" },
    { name: "مستلزمات منزلية", icon: ShoppingBag, color: "bg-sudan-blue" },
    { name: "صيدليات", icon: ShoppingBag, color: "bg-green-600" },
  ];

  // Fetch stores (using products for now)
  const { data: allStores = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products').then(res => res.json()) as Promise<Product[]>
  });

  // Filter stores based on selected category and search term
  const filteredStores = allStores
    .filter(store => selectedCategory === "الكل" || store.category === selectedCategory)
    .filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle phone call
  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
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

  // Form for adding new stores
  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      imageUrl: "",
      contactInfo: "",
      isAvailable: true
    }
  });

  // Mutation for adding new store
  const addStoreMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "تم إضافة المحل بنجاح",
        description: "تم إضافة المحل الجديد إلى دليل المحلات",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة المحل",
        description: "حدث خطأ أثناء إضافة المحل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertProduct) => {
    addStoreMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sudan-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المحلات...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

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
              <h2 className="text-xl font-bold text-gray-800">دليل المحلات</h2>
              <p className="text-sm text-gray-600">محلات الجالية السودانية</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-sudan-green text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن محل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-2xl px-4 py-3 text-sm border-2 border-gray-100 focus:border-sudan-green focus:outline-none"
            />
          </div>
        </div>

        {/* Store Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {storeCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button 
                key={category.name} 
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-2xl p-4 shadow-lg text-center transition-all ${
                  selectedCategory === category.name
                    ? 'bg-sudan-red text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  selectedCategory === category.name 
                    ? 'bg-white bg-opacity-20' 
                    : category.color || 'bg-green-50'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    selectedCategory === category.name ? 'text-white' : 'text-white'
                  }`} />
                </div>
                <h3 className="font-bold text-sm">{category.name}</h3>
                <p className="text-xs opacity-80">
                  {category.name === "الكل" 
                    ? `${allStores.length} محل`
                    : `${allStores.filter(s => s.category === category.name).length} محل`
                  }
                </p>
              </button>
            );
          })}
        </div>

        {/* Filtered Stores */}
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img 
                  src={store.imageUrl || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                  alt={store.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.description}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {renderStars(4)}
                    </div>
                    <span className="text-xs text-gray-600 mr-2">4.0</span>
                  </div>
                  <p className="text-xs text-sudan-green font-bold mt-1">{store.category}</p>
                </div>
                <button 
                  onClick={() => handlePhoneCall(store.contactInfo || "")}
                  className="bg-sudan-green text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {selectedCategory === "الكل" ? "لا توجد محلات متاحة" : `لا توجد محلات في فئة ${selectedCategory}`}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {selectedCategory === "الكل" 
                  ? "سيتم عرض المحلات هنا عند إضافتها"
                  : `اختر فئة أخرى أو أضف محل جديد في فئة ${selectedCategory}`
                }
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-sudan-green text-white px-6 py-3 rounded-full font-bold text-sm"
              >
                إضافة محل جديد
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة محل جديد</h3>
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
                      <FormLabel>اسم المحل</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: سوبر ماركت النيل" {...field} />
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
                      <FormLabel>وصف المحل</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصف مفصل للمحل وما يقدمه..." {...field} />
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
                      <FormLabel>فئة المحل</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة المحل" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="مواد غذائية">🥫 مواد غذائية</SelectItem>
                          <SelectItem value="ملابس وأزياء">👔 ملابس وأزياء</SelectItem>
                          <SelectItem value="إلكترونيات">📱 إلكترونيات</SelectItem>
                          <SelectItem value="مستلزمات منزلية">🏠 مستلزمات منزلية</SelectItem>
                          <SelectItem value="صيدليات">💊 صيدليات</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="+96599123456" {...field} />
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
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="السالمية - شارع سالم المبارك" {...field} />
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
                    disabled={addStoreMutation.isPending}
                    className="flex-1 bg-sudan-green hover:bg-green-700"
                  >
                    {addStoreMutation.isPending ? "جاري الإضافة..." : "إضافة المحل"}
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