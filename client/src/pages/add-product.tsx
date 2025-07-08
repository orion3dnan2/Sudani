import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Package, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProductSchema, insertServiceSchema, type InsertProduct, type InsertService } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddProductPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("product");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Product form
  const productForm = useForm<InsertProduct>({
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

  // Service form
  const serviceForm = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      phone: "",
      address: "",
      imageUrl: ""
    }
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      productForm.reset();
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "تم إضافة المنتج الجديد إلى متجرك",
      });
      setLocation("/business-dashboard");
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة المنتج",
        description: "حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: (data: InsertService) => {
      console.log("Sending service data:", data);
      return apiRequest('/api/services', { 
        method: 'POST', 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      serviceForm.reset();
      toast({
        title: "تم إضافة الخدمة بنجاح",
        description: "تم إضافة الخدمة الجديدة إلى قائمة خدماتك",
      });
      setLocation("/business-dashboard");
    },
    onError: (error: any) => {
      console.error("Service creation error:", error);
      toast({
        title: "خطأ في إضافة الخدمة",
        description: error.message || "حدث خطأ أثناء إضافة الخدمة. يرجى التأكد من ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
    }
  });

  const onSubmitProduct = (data: InsertProduct) => {
    addProductMutation.mutate(data);
  };

  const onSubmitService = (data: InsertService) => {
    console.log("Form data before submission:", data);
    console.log("Form errors:", serviceForm.formState.errors);
    addServiceMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setLocation("/business-dashboard")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">إضافة منتج أو خدمة جديدة</h1>
              <p className="text-gray-600">أضف منتجاً جديداً أو خدمة إلى متجرك</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="product">إضافة منتج</TabsTrigger>
            <TabsTrigger value="service">إضافة خدمة</TabsTrigger>
          </TabsList>

          {/* Add Product Tab */}
          <TabsContent value="product">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-sudan-green rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">إضافة منتج جديد</h2>
                  <p className="text-sm text-gray-600">أدخل تفاصيل المنتج الذي تريد إضافته</p>
                </div>
              </div>

              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={productForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المنتج</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: ملوخية بالدجاج" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={productForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>السعر</FormLabel>
                          <FormControl>
                            <Input placeholder="5.500 د.ك" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={productForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المنتج</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اكتب وصف مفصل للمنتج..." 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={productForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>فئة المنتج</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر فئة المنتج" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="طعام">🍽️ طعام</SelectItem>
                              <SelectItem value="مشروبات">🥤 مشروبات</SelectItem>
                              <SelectItem value="حلويات">🍰 حلويات</SelectItem>
                              <SelectItem value="ملابس">👔 ملابس</SelectItem>
                              <SelectItem value="إلكترونيات">📱 إلكترونيات</SelectItem>
                              <SelectItem value="مستلزمات منزلية">🏠 مستلزمات منزلية</SelectItem>
                              <SelectItem value="أخرى">📦 أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={productForm.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف للطلب</FormLabel>
                          <FormControl>
                            <Input placeholder="+96599123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={productForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رابط صورة المنتج (اختياري)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/business-dashboard")}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      disabled={addProductMutation.isPending}
                      className="flex-1 bg-sudan-green hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      {addProductMutation.isPending ? "جاري الحفظ..." : "حفظ المنتج"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Add Service Tab */}
          <TabsContent value="service">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-sudan-blue rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">إضافة خدمة جديدة</h2>
                  <p className="text-sm text-gray-600">أدخل تفاصيل الخدمة التي تقدمها</p>
                </div>
              </div>

              <Form {...serviceForm}>
                <form onSubmit={serviceForm.handleSubmit(onSubmitService)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={serviceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم الخدمة</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: صالون النيل للرجال" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="phone"
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
                  </div>

                  <FormField
                    control={serviceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف الخدمة</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اكتب وصف مفصل للخدمة المقدمة..." 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={serviceForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>فئة الخدمة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر فئة الخدمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="مطعم">🍽️ مطعم</SelectItem>
                              <SelectItem value="صالون">✂️ صالون</SelectItem>
                              <SelectItem value="خدمات قانونية">⚖️ خدمات قانونية</SelectItem>
                              <SelectItem value="خدمات تقنية">💻 خدمات تقنية</SelectItem>
                              <SelectItem value="مواصلات">🚗 مواصلات</SelectItem>
                              <SelectItem value="شركة شحن">🚚 شركة شحن</SelectItem>
                              <SelectItem value="شركة سفر وسياحة">✈️ شركة سفر وسياحة</SelectItem>
                              <SelectItem value="عيادة طبية">🏥 عيادة طبية</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={serviceForm.control}
                      name="address"
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
                  </div>

                  <FormField
                    control={serviceForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رابط صورة الخدمة (اختياري)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 space-x-reverse pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/business-dashboard")}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      disabled={addServiceMutation.isPending}
                      className="flex-1 bg-sudan-blue hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      {addServiceMutation.isPending ? "جاري الحفظ..." : "حفظ الخدمة"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}