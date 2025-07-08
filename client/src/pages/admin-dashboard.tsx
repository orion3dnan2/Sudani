import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  Users, 
  Package, 
  Briefcase, 
  MessageSquare, 
  Settings,
  Trash2,
  Edit,
  Plus,
  LogOut,
  Eye,
  BarChart3,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin auth
  const isAdmin = localStorage.getItem("adminAuth") === "true";
  if (!isAdmin) {
    setLocation("/admin-login");
    return null;
  }

  // Fetch all data
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["/api/jobs"],
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["/api/announcements"],
  });

  // Delete mutations
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "تم حذف المنتج بنجاح" });
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/services/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم حذف الخدمة بنجاح" });
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/jobs/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "تم حذف الوظيفة بنجاح" });
    }
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/announcements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "تم حذف الإعلان بنجاح" });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userType");
    setLocation("/admin-login");
  };

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DataTable = ({ title, data, type, deleteMutation }: any) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Database className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
          <Button
            onClick={() => setLocation("/add-product")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة جديد
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {item.name || item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'products' && `${item.price} - ${item.category}`}
                  {type === 'services' && `${item.phone} - ${item.category}`}
                  {type === 'jobs' && `${item.company} - ${item.type}`}
                  {type === 'announcements' && `${item.category} - ${item.price || 'مجاني'}`}
                </p>
                <p className="text-xs text-gray-400">
                  ID: {item.id} | تاريخ الإنشاء: {new Date(item.createdAt).toLocaleDateString('ar')}
                </p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-green-600">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600"
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف "${item.name || item.title}"؟`)) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد بيانات
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">لوحة تحكم المطور</h1>
              <p className="text-blue-200 text-sm">إدارة شاملة للنظام - البيت السوداني</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="text-right">
              <p className="font-medium">المدير العام</p>
              <p className="text-xs text-blue-200">صلاحيات كاملة</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المنتجات"
            value={products.length}
            icon={Package}
            color="bg-green-500"
            description="في السوق والمحلات"
          />
          <StatCard
            title="إجمالي الخدمات"
            value={services.length}
            icon={Briefcase}
            color="bg-blue-500"
            description="شركات ومؤسسات"
          />
          <StatCard
            title="إجمالي الوظائف"
            value={jobs.length}
            icon={Users}
            color="bg-purple-500"
            description="فرص عمل متاحة"
          />
          <StatCard
            title="إجمالي الإعلانات"
            value={announcements.length}
            icon={MessageSquare}
            color="bg-orange-500"
            description="إعلانات وأخبار"
          />
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <BarChart3 className="w-5 h-5" />
                    <span>إحصائيات سريعة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>إجمالي المحتوى</span>
                      <span className="font-bold">
                        {products.length + services.length + jobs.length + announcements.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span>المنتجات النشطة</span>
                      <span className="font-bold text-green-600">
                        {products.filter((p: any) => p.isAvailable).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span>الخدمات النشطة</span>
                      <span className="font-bold text-blue-600">
                        {services.filter((s: any) => s.isActive).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span>الوظائف النشطة</span>
                      <span className="font-bold text-purple-600">
                        {jobs.filter((j: any) => j.isActive).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setLocation("/add-product")}
                      className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      <span>إضافة منتج</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Settings className="w-6 h-6 mb-2" />
                      <span>إعدادات النظام</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <span>إدارة المستخدمين</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Database className="w-6 h-6 mb-2" />
                      <span>النسخ الاحتياطي</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <DataTable
              title="إدارة المنتجات"
              data={products}
              type="products"
              deleteMutation={deleteProductMutation}
            />
          </TabsContent>

          <TabsContent value="services">
            <DataTable
              title="إدارة الخدمات"
              data={services}
              type="services"
              deleteMutation={deleteServiceMutation}
            />
          </TabsContent>

          <TabsContent value="jobs">
            <DataTable
              title="إدارة الوظائف"
              data={jobs}
              type="jobs"
              deleteMutation={deleteJobMutation}
            />
          </TabsContent>

          <TabsContent value="announcements">
            <DataTable
              title="إدارة الإعلانات"
              data={announcements}
              type="announcements"
              deleteMutation={deleteAnnouncementMutation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}