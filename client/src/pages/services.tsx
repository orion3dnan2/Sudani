import { ArrowRight, Utensils, Scissors, Wrench, Car, Phone, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServiceSchema, type InsertService } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import type { Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function ServicesPage() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const serviceCategories = [
    { name: "مطاعم", count: "١٥ مطعم", icon: Utensils },
    { name: "صالونات", count: "٨ صالون", icon: Scissors },
    { name: "خدمات تقنية", count: "١٢ شركة", icon: Wrench },
    { name: "مواصلات", count: "٦ خدمات", icon: Car },
  ];

  // Fetch services from database
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/services'],
    queryFn: () => fetch('/api/services').then(res => res.json()) as Promise<Service[]>
  });

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

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  // Form for adding new services
  const form = useForm<InsertService>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      phone: "",
      address: "",
      rating: "4.5",
      imageUrl: "",
      isActive: true
    }
  });

  // Mutation for adding new service
  const addServiceMutation = useMutation({
    mutationFn: (data: InsertService) => apiRequest('/api/services', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "تم إضافة الخدمة بنجاح",
        description: "تم إضافة الخدمة الجديدة إلى دليل الخدمات",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة الخدمة",
        description: "حدث خطأ أثناء إضافة الخدمة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertService) => {
    addServiceMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sudan-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الخدمات...</p>
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
              <h2 className="text-xl font-bold text-gray-800">دليل الخدمات</h2>
              <p className="text-sm text-gray-600">خدمات الجالية السودانية</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-sudan-green text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
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
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img 
                  src={service.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
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
                <button 
                  onClick={() => handleCall(service.phone)}
                  className="bg-sudan-green text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة خدمة جديدة</h3>
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
                      <FormLabel>اسم الخدمة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: مطعم الأصالة السوداني" {...field} />
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
                      <FormLabel>وصف الخدمة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصف مفصل للخدمة..." {...field} />
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
                      <FormLabel>فئة الخدمة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة الخدمة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="مطاعم">مطاعم</SelectItem>
                          <SelectItem value="صالونات">صالونات</SelectItem>
                          <SelectItem value="خدمات قانونية">خدمات قانونية</SelectItem>
                          <SelectItem value="خدمات تقنية">خدمات تقنية</SelectItem>
                          <SelectItem value="مواصلات">مواصلات</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
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
                    disabled={addServiceMutation.isPending}
                    className="flex-1 bg-sudan-green hover:bg-green-700"
                  >
                    {addServiceMutation.isPending ? "جاري الإضافة..." : "إضافة الخدمة"}
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
