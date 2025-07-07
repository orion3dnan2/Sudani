import { ArrowRight, Calendar, MapPin, Phone, Tag, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnnouncementSchema, type InsertAnnouncement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import type { Announcement } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function AnnouncementsPage() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch announcements from database
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: () => fetch('/api/announcements').then(res => res.json()) as Promise<Announcement[]>
  });

  // Form for adding new announcements
  const form = useForm<InsertAnnouncement>({
    resolver: zodResolver(insertAnnouncementSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      phone: "",
      imageUrl: "",
      isActive: true
    }
  });

  // Mutation for adding new announcement
  const addAnnouncementMutation = useMutation({
    mutationFn: (data: InsertAnnouncement) => apiRequest('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "تم إضافة الإعلان بنجاح",
        description: "تم إضافة الإعلان الجديد إلى قائمة الإعلانات",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة الإعلان",
        description: "حدث خطأ أثناء إضافة الإعلان. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertAnnouncement) => {
    addAnnouncementMutation.mutate(data);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sudan-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الإعلانات...</p>
            </div>
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
              <h2 className="text-xl font-bold text-gray-800">الإعلانات</h2>
              <p className="text-sm text-gray-600">إعلانات الجالية السودانية</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-sudan-black text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Tag className="w-4 h-4 text-sudan-blue" />
                    <span className="text-xs font-bold text-sudan-blue bg-blue-50 px-2 py-1 rounded-full">
                      {announcement.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{announcement.description}</p>
                  
                  {announcement.price && (
                    <div className="text-lg font-bold text-sudan-green mb-2">
                      {announcement.price} د.ك
                    </div>
                  )}
                  
                  {announcement.phone && (
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{announcement.phone}</span>
                    </div>
                  )}
                </div>
                
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-20 h-20 rounded-xl object-cover ml-4"
                  />
                )}
              </div>
              
              {announcement.phone && (
                <button 
                  onClick={() => handleCall(announcement.phone!)}
                  className="w-full bg-sudan-black text-white py-3 rounded-full font-bold text-sm"
                >
                  اتصل الآن
                </button>
              )}
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد إعلانات متاحة</h3>
            <p className="text-sm text-gray-600 mb-6">
              سيتم عرض الإعلانات هنا عند إضافتها
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-sudan-black text-white px-6 py-3 rounded-full font-bold text-sm"
            >
              إضافة إعلان جديد
            </button>
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة إعلان جديد</h3>
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الإعلان</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: احتفالية اليوم الوطني السوداني" {...field} />
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
                      <FormLabel>تفاصيل الإعلان</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب تفاصيل الإعلان..." {...field} />
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
                      <FormLabel>فئة الإعلان</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة الإعلان" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="مناسبات">مناسبات</SelectItem>
                          <SelectItem value="بيع وشراء">بيع وشراء</SelectItem>
                          <SelectItem value="عقارات">عقارات</SelectItem>
                          <SelectItem value="خدمات">خدمات</SelectItem>
                          <SelectItem value="تدريب">تدريب</SelectItem>
                          <SelectItem value="إعلانات">إعلانات عامة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر (اختياري)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: 50.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف (اختياري)</FormLabel>
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
                    disabled={addAnnouncementMutation.isPending}
                    className="flex-1 bg-sudan-black hover:bg-gray-800"
                  >
                    {addAnnouncementMutation.isPending ? "جاري الإضافة..." : "إضافة الإعلان"}
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