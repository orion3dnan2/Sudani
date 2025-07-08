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
  Database,
  Check,
  X,
  UserPlus,
  Crown,
  Palette,
  FileText,
  Image,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Approval/Rejection mutations for announcements
  const approveAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/announcements/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "تم قبول الإعلان بنجاح" });
    }
  });

  const rejectAnnouncementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/announcements/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "تم رفض الإعلان" });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userType");
    setLocation("/admin-login");
  };

  // Filter functions
  const filteredData = (data: any[], type: string) => {
    if (!data) return [];
    
    return data.filter(item => {
      const matchesSearch = searchTerm === "" || 
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      
      return matchesSearch && matchesStatus;
    });
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

  const FilterBar = () => (
    <div className="flex items-center space-x-4 space-x-reverse mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border rounded-lg text-sm"
      >
        <option value="all">كل الحالات</option>
        <option value="active">نشط</option>
        <option value="inactive">غير نشط</option>
      </select>
    </div>
  );

  const ManagementTable = ({ title, data, type, icon: Icon, color }: any) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Icon className={`w-5 h-5 ${color}`} />
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
        <FilterBar />
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredData(data, type).map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3 space-x-reverse mb-2">
                  <h3 className="font-medium text-gray-800">
                    {item.name || item.title}
                  </h3>
                  <Badge 
                    variant={item.isActive ? "default" : "secondary"}
                    className={item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                  >
                    {item.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
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
                {type === 'announcements' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => approveAnnouncementMutation.mutate(item.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => rejectAnnouncementMutation.mutate(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف "${item.name || item.title}"؟`)) {
                      if (type === 'products') deleteProductMutation.mutate(item.id);
                      if (type === 'services') deleteServiceMutation.mutate(item.id);
                      if (type === 'jobs') deleteJobMutation.mutate(item.id);
                      if (type === 'announcements') deleteAnnouncementMutation.mutate(item.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {filteredData(data, type).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا توجد بيانات مطابقة</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const UserManagementTable = () => {
    const mockUsers = [
      { id: 1, username: "admin", fullName: "المدير العام", type: "admin", isActive: true, createdAt: new Date() },
      { id: 2, username: "store_owner", fullName: "صاحب متجر", type: "business", isActive: true, createdAt: new Date() },
      { id: 3, username: "user123", fullName: "مستخدم عادي", type: "user", isActive: true, createdAt: new Date() },
    ];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-5 h-5 text-blue-600" />
              <span>إدارة المستخدمين</span>
            </CardTitle>
            <Button
              onClick={() => setLocation("/add-user")}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 ml-2" />
              إضافة مستخدم
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FilterBar />
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <h3 className="font-medium text-gray-800">{user.fullName}</h3>
                    <Badge 
                      variant={user.type === 'admin' ? 'destructive' : user.type === 'business' ? 'default' : 'secondary'}
                      className={
                        user.type === 'admin' ? 'bg-red-100 text-red-700' :
                        user.type === 'business' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {user.type === 'admin' ? 'مدير' : user.type === 'business' ? 'صاحب عمل' : 'مستخدم عادي'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">@{user.username}</p>
                  <p className="text-xs text-gray-400">
                    ID: {user.id} | تاريخ الإنشاء: {user.createdAt.toLocaleDateString('ar')}
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                    <Crown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف المستخدم "${user.fullName}"؟`)) {
                        toast({ title: "تم حذف المستخدم", description: "تم حذف المستخدم بنجاح" });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const SystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Palette className="w-5 h-5 text-purple-600" />
            <span>إعدادات التصميم</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">شعار التطبيق</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">اضغط لرفع شعار جديد</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الألوان الأساسية</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 bg-red-600 rounded border" title="أحمر سوداني"></div>
                <div className="h-10 bg-green-600 rounded border" title="أخضر سوداني"></div>
                <div className="h-10 bg-blue-600 rounded border" title="أزرق سوداني"></div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">اسم التطبيق</label>
            <Input defaultValue="البيت السوداني" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">الوصف</label>
            <Input defaultValue="منصة الجالية السودانية في الكويت" />
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <FileText className="w-5 h-5 text-green-600" />
            <span>إعدادات النصوص</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">رسالة الترحيب</label>
            <Input defaultValue="أهلاً وسهلاً بك في البيت السوداني" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">شروط الاستخدام</label>
            <textarea 
              className="w-full p-3 border rounded-lg h-24"
              defaultValue="شروط الاستخدام للتطبيق..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">معلومات الاتصال</label>
            <Input defaultValue="للتواصل: info@sudanese-house.com" />
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            حفظ النصوص
          </Button>
        </CardContent>
      </Card>
    </div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">النظرة العامة</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ManagementTable
                title="آخر المنتجات"
                data={products.slice(0, 3)}
                type="products"
                icon={Package}
                color="text-green-600"
              />
              <ManagementTable
                title="آخر الخدمات"
                data={services.slice(0, 3)}
                type="services"
                icon={Briefcase}
                color="text-blue-600"
              />
              <ManagementTable
                title="آخر الوظائف"
                data={jobs.slice(0, 3)}
                type="jobs"
                icon={Users}
                color="text-purple-600"
              />
              <ManagementTable
                title="آخر الإعلانات"
                data={announcements.slice(0, 3)}
                type="announcements"
                icon={MessageSquare}
                color="text-orange-600"
              />
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <ManagementTable
              title="إدارة الإعلانات"
              data={announcements}
              type="announcements"
              icon={MessageSquare}
              color="text-orange-600"
            />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <ManagementTable
              title="إدارة الوظائف"
              data={jobs}
              type="jobs"
              icon={Users}
              color="text-purple-600"
            />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ManagementTable
              title="إدارة الخدمات"
              data={services}
              type="services"
              icon={Briefcase}
              color="text-blue-600"
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ManagementTable
              title="إدارة المنتجات"
              data={products}
              type="products"
              icon={Package}
              color="text-green-600"
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}