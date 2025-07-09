import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Users, 
  Building, 
  AlertTriangle, 
  FileText,
  Settings,
  BarChart3,
  Database,
  Shield,
  Plus,
  Edit,
  Trash2,
  Download,
  Calendar,
  Eye,
  EyeOff,
  Check,
  X,
  Search,
  Filter,
  RefreshCw,
  User,
  Bell,
  Activity,
  TrendingUp,
  PieChart,
  BarChart,
  Camera,
  Lock,
  Mail,
  Phone,
  Globe,
  Send,
  Archive,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  ChevronRight,
  Menu,
  Home,
  LogOut,
  Save
} from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User as UserType, Product, Service, Job, Announcement } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalErrors: number;
  totalListings: number;
  usersByRole: { [key: string]: number };
  monthlyGrowth: { [key: string]: number };
}

interface SystemLog {
  id: number;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  userId?: number;
  resolved: boolean;
}

interface BackupInfo {
  id: number;
  timestamp: string;
  size: string;
  type: 'full' | 'partial';
  status: 'completed' | 'failed' | 'in_progress';
}

export default function AdminDashboardEnhanced() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState({
    name: "أحمد محمد",
    email: "admin@sudanhouse.com",
    phone: "+965 5555 1234",
    role: "مطور النظام",
    avatar: ""
  });
  const [notificationText, setNotificationText] = useState("");
  const [notificationTarget, setNotificationTarget] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('/api/admin/stats'),
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('/api/users'),
  });

  // Fetch system logs
  const { data: logs = [], isLoading: logsLoading } = useQuery<SystemLog[]>({
    queryKey: ['/api/admin/logs'],
    queryFn: () => apiRequest('/api/admin/logs'),
  });

  // Fetch backup history
  const { data: backups = [], isLoading: backupsLoading } = useQuery<BackupInfo[]>({
    queryKey: ['/api/admin/backups'],
    queryFn: () => apiRequest('/api/admin/backups'),
  });

  // Fetch all content for management
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('/api/products'),
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    queryFn: () => apiRequest('/api/services'),
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: () => apiRequest('/api/jobs'),
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements'],
    queryFn: () => apiRequest('/api/announcements'),
  });

  // User management mutations
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserType> }) => 
      apiRequest(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: "تم تحديث المستخدم بنجاح" });
      setEditingUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: "تم حذف المستخدم بنجاح" });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest(`/api/users/${id}/toggle-status`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: "تم تحديث حالة المستخدم بنجاح" });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/users/${id}/reset-password`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: "تم إعادة تعيين كلمة المرور بنجاح" });
      setShowPasswordDialog(false);
    },
  });

  // Content deletion mutations
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "تم حذف المنتج بنجاح" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/services/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم حذف الخدمة بنجاح" });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/jobs/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "تم حذف الوظيفة بنجاح" });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/announcements/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "تم حذف الإعلان بنجاح" });
    },
  });

  // Backup and notification mutations
  const createBackupMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/backup', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      toast({ title: "تم إنشاء النسخة الاحتياطية بنجاح" });
    },
  });

  const resolveLogMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/logs/${id}/resolve`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      toast({ title: "تم حل المشكلة بنجاح" });
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: (data: { message: string; target: string }) => 
      apiRequest('/api/admin/notifications', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "تم إرسال الإشعار بنجاح" });
      setNotificationText("");
    },
  });

  // Helper functions
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.userType === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'business': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'نظرة عامة', icon: Home },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users },
    { id: 'content', label: 'إدارة المحتوى', icon: FileText },
    { id: 'analytics', label: 'التحليلات والتقارير', icon: BarChart3 },
    { id: 'logs', label: 'سجلات الأخطاء', icon: AlertTriangle },
    { id: 'notifications', label: 'إدارة الإشعارات', icon: Bell },
    { id: 'backup', label: 'النسخ الاحتياطية', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 min-h-screen`}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full justify-start"
            >
              <Menu className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">القائمة</span>}
            </Button>
          </div>
          
          <nav className="mt-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 text-right hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="w-full justify-start"
            >
              <ArrowLeft className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">العودة</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Profile Management */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">إدارة الملف الشخصي</h1>
                  <p className="text-gray-600 dark:text-gray-400">إدارة بيانات المطور الشخصية</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <Edit className="w-5 h-5" />
                      <span>تحديث البيانات الشخصية</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الدور</label>
                      <Input
                        value={profileData.role}
                        disabled
                        className="w-full bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                    <Button className="w-full">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <Lock className="w-5 h-5" />
                      <span>تغيير كلمة المرور</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">كلمة المرور الحالية</label>
                      <Input type="password" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label>
                      <Input type="password" className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                      <Input type="password" className="w-full" />
                    </div>
                    <Button className="w-full" variant="outline">
                      <Lock className="w-4 h-4 ml-2" />
                      تغيير كلمة المرور
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Overview Dashboard */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">لوحة التحكم الرئيسية</h1>
                  <p className="text-gray-600 dark:text-gray-400">نظرة عامة على النظام والإحصائيات</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">إجمالي المستخدمين</p>
                        <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">الأعمال التجارية</p>
                        <p className="text-3xl font-bold">{stats?.totalBusinesses || 0}</p>
                      </div>
                      <Building className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">الأخطاء النشطة</p>
                        <p className="text-3xl font-bold">{stats?.totalErrors || 0}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">إجمالي الإعلانات</p>
                        <p className="text-3xl font-bold">{stats?.totalListings || 0}</p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <Activity className="w-5 h-5" />
                      <span>النشاط الأخير</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-medium">مستخدم جديد انضم للمنصة</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">منذ 5 دقائق</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div>
                          <p className="font-medium">تم إضافة منتج جديد</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">منذ 15 دقيقة</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <div>
                          <p className="font-medium">تحديث في إعدادات النظام</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">منذ ساعة</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <TrendingUp className="w-5 h-5" />
                      <span>الإحصائيات السريعة</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>منتجات نشطة</span>
                        <span className="font-bold text-green-600">{products.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>خدمات متاحة</span>
                        <span className="font-bold text-blue-600">{services.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>وظائف مفتوحة</span>
                        <span className="font-bold text-purple-600">{jobs.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>إعلانات عامة</span>
                        <span className="font-bold text-orange-600">{announcements.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">إدارة المستخدمين</h1>
                  <p className="text-gray-600 dark:text-gray-400">إدارة شاملة لجميع المستخدمين</p>
                </div>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="البحث عن المستخدمين..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="تصفية حسب الدور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الأدوار</SelectItem>
                          <SelectItem value="admin">مدير</SelectItem>
                          <SelectItem value="manager">مدير فرعي</SelectItem>
                          <SelectItem value="business">صاحب عمل</SelectItem>
                          <SelectItem value="user">مستخدم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button>
                        <UserPlus className="w-4 h-4 ml-2" />
                        إضافة مستخدم
                      </Button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredUsers.length} مستخدم
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {user.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                              {user.fullName}
                            </h3>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                @{user.username}
                              </p>
                              <Badge className={getRoleBadgeColor(user.userType || 'user')}>
                                {user.userType === 'admin' ? 'مدير' : 
                                 user.userType === 'manager' ? 'مدير فرعي' :
                                 user.userType === 'business' ? 'صاحب عمل' : 'مستخدم'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowPasswordDialog(true);
                            }}
                          >
                            <Lock className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Content Management */}
          {activeSection === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">إدارة المحتوى</h1>
                  <p className="text-gray-600 dark:text-gray-400">إدارة جميع المحتويات والفئات</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>المنتجات ({products.length})</span>
                      <Button size="sm" onClick={() => setLocation("/add-product")}>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة منتج
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>الخدمات ({services.length})</span>
                      <Button size="sm" onClick={() => setLocation("/add-product")}>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة خدمة
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{service.category}</p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => deleteServiceMutation.mutate(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>الوظائف ({jobs.length})</span>
                      <Button size="sm" onClick={() => setLocation("/jobs")}>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة وظيفة
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {jobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => deleteJobMutation.mutate(job.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>الإعلانات ({announcements.length})</span>
                      <Button size="sm" onClick={() => setLocation("/announcements")}>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة إعلان
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                          <div>
                            <p className="font-medium">{announcement.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{announcement.category}</p>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">التحليلات والتقارير</h1>
                  <p className="text-gray-600 dark:text-gray-400">تحليلات شاملة لأداء المنصة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>نمو المستخدمين</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-green-600">+15%</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">هذا الشهر</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>النشاط اليومي</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-blue-600">248</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">زيارة اليوم</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 space-x-reverse">
                      <PieChart className="w-5 h-5 text-purple-600" />
                      <span>أداء المحتوى</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-3xl font-bold text-purple-600">89%</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">معدل الرضا</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>الرسوم البيانية التفاعلية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <BarChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      قريباً: رسوم بيانية تفاعلية للنشاط والنمو
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Logs */}
          {activeSection === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">سجلات الأخطاء</h1>
                  <p className="text-gray-600 dark:text-gray-400">مراقبة أخطاء النظام وحلها</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>سجلات النظام</span>
                    <Button size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] })}>
                      <RefreshCw className="w-4 h-4 ml-2" />
                      تحديث
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className={`w-3 h-3 rounded-full ${
                            log.level === 'error' ? 'bg-red-500' :
                            log.level === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="font-medium">{log.message}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(log.timestamp).toLocaleString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {log.resolved ? (
                            <Badge className="bg-green-100 text-green-800">
                              تم الحل
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveLogMutation.mutate(log.id)}
                            >
                              <Check className="w-4 h-4 ml-2" />
                              حل
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">إدارة الإشعارات</h1>
                  <p className="text-gray-600 dark:text-gray-400">إرسال إشعارات للمستخدمين</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Send className="w-5 h-5" />
                    <span>إرسال إشعار جديد</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">المستهدفون</label>
                    <Select value={notificationTarget} onValueChange={setNotificationTarget}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستهدفين" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المستخدمين</SelectItem>
                        <SelectItem value="business">أصحاب الأعمال</SelectItem>
                        <SelectItem value="admin">المديرين</SelectItem>
                        <SelectItem value="user">المستخدمون العاديون</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">نص الإشعار</label>
                    <Textarea
                      value={notificationText}
                      onChange={(e) => setNotificationText(e.target.value)}
                      placeholder="اكتب نص الإشعار هنا..."
                      className="h-32"
                    />
                  </div>
                  <Button 
                    onClick={() => sendNotificationMutation.mutate({
                      message: notificationText,
                      target: notificationTarget
                    })}
                    disabled={!notificationText.trim()}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 ml-2" />
                    إرسال الإشعار
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Backup System */}
          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">النسخ الاحتياطية</h1>
                  <p className="text-gray-600 dark:text-gray-400">إدارة النسخ الاحتياطية للنظام</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>النسخ الاحتياطية</span>
                    <Button onClick={() => createBackupMutation.mutate()}>
                      <Plus className="w-4 h-4 ml-2" />
                      إنشاء نسخة احتياطية
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {backups.map((backup) => (
                      <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <Database className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              نسخة احتياطية {backup.type === 'full' ? 'كاملة' : 'جزئية'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(backup.timestamp).toLocaleString('ar-SA')} - {backup.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge className={
                            backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                            backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {backup.status === 'completed' ? 'مكتملة' :
                             backup.status === 'failed' ? 'فشلت' : 'قيد التنفيذ'}
                          </Badge>
                          {backup.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 ml-2" />
                              تحميل
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={true} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل المستخدم</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                <Input
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الدور</label>
                <Select
                  value={editingUser.userType || 'user'}
                  onValueChange={(value) => setEditingUser({...editingUser, userType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="business">صاحب عمل</SelectItem>
                    <SelectItem value="manager">مدير فرعي</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  إلغاء
                </Button>
                <Button
                  onClick={() => updateUserMutation.mutate({
                    id: editingUser.id,
                    data: {
                      fullName: editingUser.fullName,
                      userType: editingUser.userType
                    }
                  })}
                >
                  حفظ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Password Reset Dialog */}
      {showPasswordDialog && (
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                هل أنت متأكد من إعادة تعيين كلمة المرور لهذا المستخدم؟
              </p>
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={() => selectedUserId && resetPasswordMutation.mutate(selectedUserId)}
                  variant="destructive"
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}