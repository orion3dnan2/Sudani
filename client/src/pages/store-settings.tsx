import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowRight, 
  Store, 
  Settings, 
  Image, 
  Phone, 
  MapPin, 
  Clock, 
  Mail,
  Globe,
  Save,
  Edit
} from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function StoreSettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Mock store data
  const [storeData, setStoreData] = useState({
    name: "مطعم الأصالة السوداني",
    ownerName: "أحمد محمد علي",
    type: "مطعم",
    description: "مطعم متخصص في الأكلات السودانية الأصيلة",
    phone: "+965 1234 5678",
    whatsapp: "+965 1234 5678",
    address: "الكويت - السالمية - شارع الخليج العربي",
    email: "info@alasala-restaurant.com",
    website: "www.alasala-restaurant.com",
    workingHours: {
      from: "09:00",
      to: "23:00"
    },
    socialMedia: {
      instagram: "@alasala_restaurant",
      facebook: "الأصالة السوداني",
      twitter: "@alasala_kw"
    }
  });

  const handleSave = (section?: string) => {
    toast({
      title: "تم حفظ الإعدادات بنجاح",
      description: "تم تحديث بيانات المتجر",
    });
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSection(null);
    // Reset form data here if needed
  };

  const handleEditSection = (section: string) => {
    setEditingSection(section);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
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
              <h1 className="text-2xl font-bold text-gray-800">إعدادات المتجر</h1>
              <p className="text-gray-600">{storeData.name}</p>
              <Badge className="bg-green-100 text-green-700 text-xs mt-1">🏢 إعدادات صاحب العمل</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="text-sm text-gray-500">
              استخدم أزرار التعديل لكل قسم منفصل
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Store className="w-5 h-5 text-blue-600" />
                  <span>المعلومات الأساسية</span>
                </div>
                {editingSection !== "basic" && (
                  <Button
                    onClick={() => handleEditSection("basic")}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المتجر
                  </label>
                  <Input
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    disabled={editingSection !== "basic"}
                    className={editingSection !== "basic" ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم صاحب العمل
                  </label>
                  <Input
                    value={storeData.ownerName}
                    onChange={(e) => setStoreData({...storeData, ownerName: e.target.value})}
                    disabled={editingSection !== "basic"}
                    className={editingSection !== "basic" ? "bg-gray-50" : ""}
                    placeholder="أدخل اسم صاحب العمل"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع النشاط
                  </label>
                  <select 
                    value={storeData.type}
                    onChange={(e) => setStoreData({...storeData, type: e.target.value})}
                    disabled={editingSection !== "basic"}
                    className={`w-full px-3 py-2 border rounded-md ${editingSection !== "basic" ? "bg-gray-50" : ""}`}
                  >
                    <option value="مطعم">مطعم</option>
                    <option value="متجر">متجر</option>
                    <option value="خدمات">خدمات</option>
                    <option value="محل تجاري">محل تجاري</option>
                  </select>
                </div>
                <div></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف المتجر
                </label>
                <textarea
                  value={storeData.description}
                  onChange={(e) => setStoreData({...storeData, description: e.target.value})}
                  disabled={editingSection !== "basic"}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md resize-none ${editingSection !== "basic" ? "bg-gray-50" : ""}`}
                />
              </div>
              {editingSection === "basic" && (
                <div className="flex items-center space-x-2 space-x-reverse pt-4 border-t">
                  <Button
                    onClick={() => handleSave("basic")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span>معلومات الاتصال</span>
                </div>
                {editingSection !== "contact" && (
                  <Button
                    onClick={() => handleEditSection("contact")}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <Input
                    value={storeData.phone}
                    onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                    disabled={editingSection !== "contact"}
                    className={editingSection !== "contact" ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الواتساب
                  </label>
                  <Input
                    value={storeData.whatsapp}
                    onChange={(e) => setStoreData({...storeData, whatsapp: e.target.value})}
                    disabled={editingSection !== "contact"}
                    className={editingSection !== "contact" ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline ml-1" />
                  العنوان
                </label>
                <Input
                  value={storeData.address}
                  onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                  disabled={editingSection !== "contact"}
                  className={editingSection !== "contact" ? "bg-gray-50" : ""}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline ml-1" />
                    البريد الإلكتروني
                  </label>
                  <Input
                    value={storeData.email}
                    onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                    disabled={editingSection !== "contact"}
                    className={editingSection !== "contact" ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline ml-1" />
                    الموقع الإلكتروني
                  </label>
                  <Input
                    value={storeData.website}
                    onChange={(e) => setStoreData({...storeData, website: e.target.value})}
                    disabled={editingSection !== "contact"}
                    className={editingSection !== "contact" ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
              {editingSection === "contact" && (
                <div className="flex items-center space-x-2 space-x-reverse pt-4 border-t">
                  <Button
                    onClick={() => handleSave("contact")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span>ساعات العمل</span>
                </div>
                {editingSection !== "hours" && (
                  <Button
                    onClick={() => handleEditSection("hours")}
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    من الساعة
                  </label>
                  <Input
                    type="time"
                    value={storeData.workingHours.from}
                    onChange={(e) => setStoreData({
                      ...storeData, 
                      workingHours: {...storeData.workingHours, from: e.target.value}
                    })}
                    disabled={editingSection !== "hours"}
                    className={editingSection !== "hours" ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إلى الساعة
                  </label>
                  <Input
                    type="time"
                    value={storeData.workingHours.to}
                    onChange={(e) => setStoreData({
                      ...storeData, 
                      workingHours: {...storeData.workingHours, to: e.target.value}
                    })}
                    disabled={editingSection !== "hours"}
                    className={editingSection !== "hours" ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
              {editingSection === "hours" && (
                <div className="flex items-center space-x-2 space-x-reverse pt-4 border-t">
                  <Button
                    onClick={() => handleSave("hours")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Globe className="w-5 h-5 text-pink-600" />
                  <span>حسابات التواصل الاجتماعي</span>
                </div>
                {editingSection !== "social" && (
                  <Button
                    onClick={() => handleEditSection("social")}
                    variant="outline"
                    size="sm"
                    className="text-pink-600 border-pink-600 hover:bg-pink-50"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  انستغرام
                </label>
                <Input
                  value={storeData.socialMedia.instagram}
                  onChange={(e) => setStoreData({
                    ...storeData, 
                    socialMedia: {...storeData.socialMedia, instagram: e.target.value}
                  })}
                  disabled={editingSection !== "social"}
                  className={editingSection !== "social" ? "bg-gray-50" : ""}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فيسبوك
                </label>
                <Input
                  value={storeData.socialMedia.facebook}
                  onChange={(e) => setStoreData({
                    ...storeData, 
                    socialMedia: {...storeData.socialMedia, facebook: e.target.value}
                  })}
                  disabled={editingSection !== "social"}
                  className={editingSection !== "social" ? "bg-gray-50" : ""}
                  placeholder="اسم الصفحة"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تويتر
                </label>
                <Input
                  value={storeData.socialMedia.twitter}
                  onChange={(e) => setStoreData({
                    ...storeData, 
                    socialMedia: {...storeData.socialMedia, twitter: e.target.value}
                  })}
                  disabled={editingSection !== "social"}
                  className={editingSection !== "social" ? "bg-gray-50" : ""}
                  placeholder="@username"
                />
              </div>
              {editingSection === "social" && (
                <div className="flex items-center space-x-2 space-x-reverse pt-4 border-t">
                  <Button
                    onClick={() => handleSave("social")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Image className="w-5 h-5 text-orange-600" />
                <span>شعار المتجر</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                {isEditing && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      variant="outline"
                      className="border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400"
                    >
                      <Image className="w-4 h-4 ml-2" />
                      رفع شعار جديد
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}