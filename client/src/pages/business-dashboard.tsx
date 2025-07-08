import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowRight, 
  Plus, 
  Store, 
  Package, 
  BarChart3, 
  Settings, 
  Users, 
  Eye,
  Edit,
  Trash2,
  Bell,
  Calendar,
  DollarSign,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BusinessDashboardPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock business data
  const businessData = {
    name: "مطعم الأصالة السوداني",
    type: "مطعم",
    productsCount: 12,
    servicesCount: 5,
    viewsThisMonth: 250,
    ordersThisMonth: 18,
    revenue: "450 د.ك"
  };

  const mockProducts = [
    { id: 1, name: "ملوخية بالدجاج", price: "5.500 د.ك", views: 45, status: "متاح" },
    { id: 2, name: "مشويات مشكلة", price: "8.000 د.ك", views: 38, status: "متاح" },
    { id: 3, name: "عصيدة باللحم", price: "6.000 د.ك", views: 32, status: "غير متاح" },
  ];

  const mockOrders = [
    { id: 1, customer: "أحمد محمد", item: "ملوخية بالدجاج", date: "2025-01-08", status: "مكتمل" },
    { id: 2, customer: "فاطمة علي", item: "مشويات مشكلة", date: "2025-01-07", status: "قيد التحضير" },
    { id: 3, customer: "محمد الأمين", item: "عصيدة باللحم", date: "2025-01-07", status: "مكتمل" },
  ];

  const handleLogout = () => {
    setLocation("/login");
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم الأعمال</h1>
              <p className="text-gray-600">{businessData.name} - {businessData.type}</p>
              <Badge className="bg-green-100 text-green-700 text-xs mt-1">🏢 صاحب عمل - صلاحيات محدودة</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button
              onClick={() => setLocation("/add-product")}
              className="bg-sudan-green hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج/خدمة
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-sudan-red text-sudan-red hover:bg-sudan-red hover:text-white"
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المنتجات"
            value={businessData.productsCount}
            icon={Package}
            color="bg-sudan-green"
          />
          <StatCard
            title="المشاهدات هذا الشهر"
            value={businessData.viewsThisMonth}
            icon={Eye}
            color="bg-sudan-blue"
          />
          <StatCard
            title="الطلبات هذا الشهر"
            value={businessData.ordersThisMonth}
            icon={Calendar}
            color="bg-sudan-yellow"
          />
          <StatCard
            title="الإيرادات"
            value={businessData.revenue}
            icon={DollarSign}
            color="bg-sudan-red"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="products">المنتجات والخدمات</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Bell className="w-5 h-5 text-sudan-green" />
                    <span>النشاط الأخير</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">طلب جديد من أحمد محمد</p>
                      <span className="text-xs text-gray-400">منذ ساعة</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">25 مشاهدة جديدة لمنتجاتك</p>
                      <span className="text-xs text-gray-400">منذ 3 ساعات</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">تم تحديث معلومات المتجر</p>
                      <span className="text-xs text-gray-400">أمس</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setLocation("/add-product")}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center bg-sudan-green/5 border-sudan-green text-sudan-green hover:bg-sudan-green hover:text-white"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      <span>إضافة منتج</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <span>عرض الإحصائيات</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <span>إدارة العملاء</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Settings className="w-6 h-6 mb-2" />
                      <span>الإعدادات</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة المنتجات والخدمات</CardTitle>
                  <Button
                    onClick={() => setLocation("/add-product")}
                    className="bg-sudan-green hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.price} • {product.views} مشاهدة</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === "متاح" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">طلب #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer} • {order.item}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === "مكتمل" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المتجر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم المتجر
                      </label>
                      <input
                        type="text"
                        value={businessData.name}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع النشاط
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option value="restaurant">مطعم</option>
                        <option value="store">متجر</option>
                        <option value="salon">صالون</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف المتجر
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg h-24"
                      placeholder="اكتب وصفاً مختصراً عن متجرك..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        placeholder="+96599123456"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان
                      </label>
                      <input
                        type="text"
                        placeholder="السالمية - شارع سالم المبارك"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-sudan-green hover:bg-green-600 text-white">
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}