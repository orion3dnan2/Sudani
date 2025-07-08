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
  Star,
  Bell,
  Activity,
  FileBarChart,
  UserCheck,
  Send,
  Lock,
  Download,
  Upload,
  Monitor,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  ShieldCheck,
  Globe,
  RefreshCw,
  History,
  ChevronRight,
  ExternalLink,
  Archive,
  Ban,
  Mail,
  Phone,
  MapPin,
  Award,
  Filter as FilterIcon,
  SortDesc,
  Home,
  ArrowLeft
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
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: "new_user", message: "مستخدم جديد سجل في التطبيق", time: "منذ 5 دقائق", read: false },
    { id: 2, type: "new_product", message: "تم إضافة منتج جديد للمراجعة", time: "منذ 15 دقيقة", read: false },
    { id: 3, type: "new_job", message: "وظيفة جديدة تحتاج موافقة", time: "منذ ساعة", read: true },
  ]);
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [moderationItems, setModerationItems] = useState<any[]>([
    { id: 1, type: "product", title: "مطعم البركة السوداني", status: "pending", submittedBy: "أحمد محمد", date: "2025-01-08" },
    { id: 2, type: "announcement", title: "شقة للإيجار في السالمية", status: "pending", submittedBy: "فاطمة علي", date: "2025-01-08" },
    { id: 3, type: "job", title: "مطلوب سائق", status: "pending", submittedBy: "محمد الأمين", date: "2025-01-07" },
  ]);
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

  // Notifications System
  const NotificationsPanel = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>الإشعارات الفورية</span>
          </CardTitle>
          <Badge variant="destructive">{notifications.filter(n => !n.read).length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-3 rounded-lg border ${!notif.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {notif.type === 'new_user' && <UserPlus className="w-4 h-4 text-green-600" />}
                  {notif.type === 'new_product' && <Package className="w-4 h-4 text-blue-600" />}
                  {notif.type === 'new_job' && <Briefcase className="w-4 h-4 text-purple-600" />}
                  <p className="text-sm font-medium">{notif.message}</p>
                </div>
                <span className="text-xs text-gray-500">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          <Check className="w-4 h-4 ml-2" />
          تمييز الكل كمقروء
        </Button>
      </CardContent>
    </Card>
  );

  // Activity Log
  const ActivityLog = () => {
    const activities = [
      { id: 1, user: "أحمد محمد", action: "إضافة منتج", target: "مطعم البركة", time: "منذ 10 دقائق", type: "create" },
      { id: 2, user: "فاطمة علي", action: "تعديل إعلان", target: "شقة للإيجار", time: "منذ 30 دقيقة", type: "update" },
      { id: 3, user: "Admin", action: "حذف وظيفة", target: "مطلوب محاسب", time: "منذ ساعة", type: "delete" },
      { id: 4, user: "محمد الأمين", action: "تسجيل دخول", target: "النظام", time: "منذ ساعتين", type: "login" },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Activity className="w-5 h-5 text-green-600" />
            <span>سجل النشاطات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'create' ? 'bg-green-100 text-green-600' :
                  activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'delete' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'create' && <Plus className="w-4 h-4" />}
                  {activity.type === 'update' && <Edit className="w-4 h-4" />}
                  {activity.type === 'delete' && <Trash2 className="w-4 h-4" />}
                  {activity.type === 'login' && <LogOut className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.user} قام بـ {activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.target}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Reports Section
  const ReportsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <FileBarChart className="w-5 h-5 text-purple-600" />
              <span>التقارير الدورية</span>
            </CardTitle>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">الزوار</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">1,247</p>
              <p className="text-xs text-gray-600">+12% من الأسبوع الماضي</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">الطلبات</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">89</p>
              <p className="text-xs text-gray-600">+8% من الأسبوع الماضي</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">الأكثر مشاهدة</span>
              </div>
              <p className="text-sm font-bold text-orange-600 mt-2">مطعم الأصالة</p>
              <p className="text-xs text-gray-600">245 مشاهدة</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">المستخدمون النشطون</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">156</p>
              <p className="text-xs text-gray-600">+5% من الأسبوع الماضي</p>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 ml-2" />
            تحميل التقرير المفصل
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Moderation System
  const ModerationSystem = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <UserCheck className="w-5 h-5 text-green-600" />
          <span>نظام الموافقة</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {moderationItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  {item.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                  {item.type === 'announcement' && <MessageSquare className="w-4 h-4 text-orange-600" />}
                  {item.type === 'job' && <Briefcase className="w-4 h-4 text-purple-600" />}
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <Badge variant="secondary">في الانتظار</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                مرسل بواسطة: {item.submittedBy} • {item.date}
              </p>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 ml-2" />
                  موافقة
                </Button>
                <Button size="sm" variant="destructive">
                  <X className="w-4 h-4 ml-2" />
                  رفض
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 ml-2" />
                  إرجاع للتعديل
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Advanced Search
  const AdvancedSearch = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Search className="w-5 h-5 text-blue-600" />
          <span>البحث المتقدم</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">البحث العام</label>
            <Input placeholder="اسم، هاتف، منتج..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">التاريخ</label>
            <Input type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">النوع</label>
            <select className="w-full p-2 border rounded">
              <option value="">جميع الأنواع</option>
              <option value="products">منتجات</option>
              <option value="services">خدمات</option>
              <option value="jobs">وظائف</option>
              <option value="announcements">إعلانات</option>
            </select>
          </div>
        </div>
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
          <Search className="w-4 h-4 ml-2" />
          بحث
        </Button>
      </CardContent>
    </Card>
  );

  // Custom Notifications Sender
  const CustomNotificationSender = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Send className="w-5 h-5 text-green-600" />
          <span>إرسال تنبيهات مخصصة</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">المستهدفون</label>
          <select className="w-full p-2 border rounded">
            <option value="all">جميع المستخدمين</option>
            <option value="business">أصحاب الأعمال فقط</option>
            <option value="users">المستخدمين العاديين فقط</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">عنوان التنبيه</label>
          <Input placeholder="مثال: تحديث مهم" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">نص التنبيه</label>
          <textarea 
            className="w-full p-3 border rounded-lg h-20"
            placeholder="مثال: يرجى تحديث بيانات متجرك..."
          />
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          <Send className="w-4 h-4 ml-2" />
          إرسال التنبيه
        </Button>
      </CardContent>
    </Card>
  );

  // User Permissions Management
  const UserPermissionsManager = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span>إدارة صلاحيات المستخدمين</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: "أحمد محمد", type: "business", status: "active" },
            { name: "فاطمة علي", type: "user", status: "active" },
            { name: "محمد الأمين", type: "business", status: "restricted" },
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">
                  {user.type === 'business' ? 'صاحب عمل' : 'مستخدم عادي'}
                </p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <select className="px-2 py-1 border rounded text-sm">
                  <option value="user">مستخدم عادي</option>
                  <option value="business">صاحب عمل</option>
                  <option value="moderator">مدير فرعي</option>
                </select>
                <Button size="sm" variant={user.status === 'active' ? 'destructive' : 'default'}>
                  {user.status === 'active' ? (
                    <>
                      <Ban className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Backup System
  const BackupSystem = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Archive className="w-5 h-5 text-blue-600" />
          <span>نظام النسخ الاحتياطي</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
            <Download className="w-6 h-6 mb-2" />
            <span>تحميل نسخة احتياطية</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 mb-2" />
            <span>استعادة نسخة</span>
          </Button>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-1">آخر نسخة احتياطية</p>
          <p className="text-xs text-gray-600">2025-01-08 - 10:30 AM</p>
        </div>
      </CardContent>
    </Card>
  );

  // Live User View
  const LiveUserView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Monitor className="w-5 h-5 text-green-600" />
          <span>عرض مباشر للتطبيق</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            اعرض التطبيق كما يراه المستخدمون العاديون
          </p>
          <Button 
            onClick={() => window.open('/', '_blank')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4 ml-2" />
            عرض التطبيق كزائر
          </Button>
          <Button 
            onClick={() => setLocation('/dashboard')}
            variant="outline" 
            className="w-full"
          >
            <Globe className="w-4 h-4 ml-2" />
            عرض لوحة المستخدم
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Performance Analytics
  const PerformanceAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Award className="w-5 h-5 text-yellow-600" />
          <span>تقييم الأداء العام</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">متوسط التقييم</span>
              </div>
              <p className="text-xl font-bold text-yellow-600">4.7</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">الأعلى تقييمًا</span>
              </div>
              <p className="text-sm font-bold text-green-600">مطعم الأصالة</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">التعليقات</span>
              </div>
              <p className="text-xl font-bold text-blue-600">342</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <SortDesc className="w-4 h-4 ml-2" />
            ترتيب حسب التقييم
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BackupSystem />
        <LiveUserView />
        <PerformanceAnalytics />
      </div>
    </div>
  );

  // Technical Logs Component
  const TechnicalLogs = () => {
    const [logType, setLogType] = useState("all");
    const [logFilter, setLogFilter] = useState("");
    
    const mockLogs = [
      { id: 1, type: "error", message: "Failed to connect to database", timestamp: "2025-01-08 11:30:15", level: "high" },
      { id: 2, type: "warning", message: "API rate limit approaching", timestamp: "2025-01-08 11:25:10", level: "medium" },
      { id: 3, type: "info", message: "User login successful", timestamp: "2025-01-08 11:20:05", level: "low" },
      { id: 4, type: "api", message: "GET /api/products - 200 OK", timestamp: "2025-01-08 11:15:30", level: "low" },
      { id: 5, type: "error", message: "File upload failed", timestamp: "2025-01-08 11:10:20", level: "high" },
    ];

    const filteredLogs = mockLogs.filter(log => {
      const matchesType = logType === "all" || log.type === logType;
      const matchesFilter = logFilter === "" || log.message.toLowerCase().includes(logFilter.toLowerCase());
      return matchesType && matchesFilter;
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>التقارير التقنية والسجلات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 space-x-reverse mb-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في السجلات..."
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">جميع السجلات</option>
              <option value="error">أخطاء</option>
              <option value="warning">تحذيرات</option>
              <option value="info">معلومات</option>
              <option value="api">API</option>
            </select>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-3 rounded-lg border ${
                  log.type === 'error' ? 'bg-red-50 border-red-200' :
                  log.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  log.type === 'info' ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Badge 
                      variant={log.type === 'error' ? 'destructive' : 'default'}
                      className={
                        log.type === 'error' ? 'bg-red-100 text-red-700' :
                        log.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        log.type === 'info' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{log.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

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
              <p className="font-medium">أحمد محمد</p>
              <p className="text-xs text-blue-200">المدير العام – صلاحيات كاملة</p>
              <Badge className="bg-green-500 text-white text-xs mt-1">✅ المدير العام – تحكم كامل</Badge>
            </div>
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 flex items-center space-x-2 space-x-reverse"
            >
              <RefreshCw className="w-4 h-4" />
              <span>🔁 العودة إلى واجهة المستخدم</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
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

        {/* Developer Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              onClick={() => setLocation('/add-section')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              ➕ إضافة قسم / مشروع جديد
            </Button>
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-12 text-xs">
            <TabsTrigger value="overview" className="text-xs">النظرة العامة</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">الإشعارات</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">سجل النشاط</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">التقارير</TabsTrigger>
            <TabsTrigger value="moderation" className="text-xs">الموافقة</TabsTrigger>
            <TabsTrigger value="search" className="text-xs">البحث المتقدم</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs">الإعلانات</TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs">الوظائف</TabsTrigger>
            <TabsTrigger value="services" className="text-xs">الخدمات</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">المنتجات</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">المستخدمين</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">الإعدادات</TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">التقارير التقنية</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <NotificationsPanel />
              <ActivityLog />
              <ModerationSystem />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NotificationsPanel />
              <CustomNotificationSender />
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityLog />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsSection />
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <ModerationSystem />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedSearch />
              <UserPermissionsManager />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserManagementTable />
              <UserPermissionsManager />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <TechnicalLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}