import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Store, 
  Package, 
  Briefcase, 
  Megaphone, 
  Settings, 
  TrendingUp, 
  Shield, 
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
  Download,
  Upload,
  Bell
} from "lucide-react";
import type { User, Product, Service, Job, Announcement } from "@shared/schema";

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

interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  userType: string;
}

export default function AdminSuperDashboard() {
  const [currentUser] = useState<AdminUser>({
    id: 1,
    username: "admin",
    fullName: "أحمد محمد - المدير العام",
    userType: "admin"
  });

  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard statistics
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/stats");
      return response.json();
    },
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await apiRequest("/api/users");
      return response.json();
    },
  });

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await apiRequest("/api/products");
      return response.json();
    },
  });

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await apiRequest("/api/services");
      return response.json();
    },
  });

  // Fetch jobs
  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const response = await apiRequest("/api/jobs");
      return response.json();
    },
  });

  // Fetch announcements
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const response = await apiRequest("/api/announcements");
      return response.json();
    },
  });

  // Fetch system logs
  const { data: logs = [] } = useQuery<SystemLog[]>({
    queryKey: ["/api/admin/logs"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/logs");
      return response.json();
    },
  });

  // Fetch backup info
  const { data: backups = [] } = useQuery<BackupInfo[]>({
    queryKey: ["/api/admin/backups"],
    queryFn: async () => {
      const response = await apiRequest("/api/admin/backups");
      return response.json();
    },
  });

  // User management mutations
  const activateUserMutation = useMutation({
    mutationFn: (userId: number) =>
      apiRequest(`/api/admin/users/${userId}/activate`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم تفعيل المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (userId: number) =>
      apiRequest(`/api/admin/users/${userId}/deactivate`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم إلغاء تفعيل المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) =>
      apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "تم حذف المستخدم بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  // Content management mutations
  const approveProductMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest(`/api/admin/products/${productId}/approve`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم الموافقة على المنتج" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest(`/api/admin/products/${productId}/reject`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم رفض المنتج" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest(`/api/products/${productId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "تم حذف المنتج بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  // Similar mutations for services, jobs, announcements
  const approveServiceMutation = useMutation({
    mutationFn: (serviceId: number) =>
      apiRequest(`/api/admin/services/${serviceId}/approve`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم الموافقة على الخدمة" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const rejectServiceMutation = useMutation({
    mutationFn: (serviceId: number) =>
      apiRequest(`/api/admin/services/${serviceId}/reject`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم رفض الخدمة" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: number) =>
      apiRequest(`/api/services/${serviceId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "تم حذف الخدمة بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
  });

  const approveJobMutation = useMutation({
    mutationFn: (jobId: number) =>
      apiRequest(`/api/admin/jobs/${jobId}/approve`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم الموافقة على الوظيفة" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
  });

  const rejectJobMutation = useMutation({
    mutationFn: (jobId: number) =>
      apiRequest(`/api/admin/jobs/${jobId}/reject`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم رفض الوظيفة" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: number) =>
      apiRequest(`/api/jobs/${jobId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "تم حذف الوظيفة بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
  });

  const approveAnnouncementMutation = useMutation({
    mutationFn: (announcementId: number) =>
      apiRequest(`/api/admin/announcements/${announcementId}/approve`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم الموافقة على الإعلان" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const rejectAnnouncementMutation = useMutation({
    mutationFn: (announcementId: number) =>
      apiRequest(`/api/admin/announcements/${announcementId}/reject`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم رفض الإعلان" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (announcementId: number) =>
      apiRequest(`/api/announcements/${announcementId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast({ title: "تم حذف الإعلان بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  // Backup mutation
  const createBackupMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/admin/backup", { method: "POST" }),
    onSuccess: () => {
      toast({ title: "تم إنشاء نسخة احتياطية جديدة" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/backups"] });
    },
  });

  // Log resolution mutation
  const resolveLogMutation = useMutation({
    mutationFn: (logId: number) =>
      apiRequest(`/api/admin/logs/${logId}/resolve`, { method: "PUT" }),
    onSuccess: () => {
      toast({ title: "تم حل المشكلة" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/logs"] });
    },
  });

  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === "all" || user.userType === filterRole;
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);
    return roleMatch && statusMatch;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "developer": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "business": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getApprovalBadge = (isApproved: boolean | undefined) => {
    if (isApproved === undefined) return null;
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        موافق عليه
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
        قيد المراجعة
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-right" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-amber-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Shield className="h-8 w-8 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    لوحة الإدارة العامة
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">البيت السوداني</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {currentUser.userType === "admin" ? "مدير عام" : "مطور"}
              </Badge>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{currentUser.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{currentUser.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <TabsTrigger value="overview" className="text-sm">نظرة عامة</TabsTrigger>
            <TabsTrigger value="users" className="text-sm">المستخدمين</TabsTrigger>
            <TabsTrigger value="content" className="text-sm">المحتوى</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">التحليلات</TabsTrigger>
            <TabsTrigger value="logs" className="text-sm">السجلات</TabsTrigger>
            <TabsTrigger value="backups" className="text-sm">النسخ الاحتياطية</TabsTrigger>
            {currentUser.userType === "developer" && (
              <>
                <TabsTrigger value="system" className="text-sm">النظام</TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">الإعدادات</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">إجمالي المستخدمين</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    +12% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">أصحاب الأعمال</CardTitle>
                  <Store className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats?.totalBusinesses || 0}</div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    +5% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-amber-200 dark:border-amber-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200">إجمالي الإعلانات</CardTitle>
                  <Package className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats?.totalListings || 0}</div>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    +8% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">الأخطاء النشطة</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{logs.filter(log => log.level === 'error' && !log.resolved).length}</div>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    تحتاج إلى معالجة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Activity className="h-5 w-5" />
                    <span>النشاط الأخير</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          {log.level === 'error' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : log.level === 'warning' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{log.message}</p>
                            <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString('ar-SA')}</p>
                          </div>
                        </div>
                        <Badge className={log.resolved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                          {log.resolved ? "محلول" : "قيد المعالجة"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <TrendingUp className="h-5 w-5" />
                    <span>إحصائيات المستخدمين</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.usersByRole && Object.entries(stats.usersByRole).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">
                            {role === 'admin' ? 'مديرين' : 
                             role === 'developer' ? 'مطورين' :
                             role === 'manager' ? 'مدراء' :
                             role === 'business' ? 'أصحاب أعمال' : 'مستخدمين'}
                          </span>
                        </div>
                        <span className="text-sm font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المستخدمين</h2>
                <p className="text-gray-600 dark:text-gray-400">عرض وإدارة جميع مستخدمي التطبيق</p>
              </div>
              <div className="flex gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="تصفية حسب النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="admin">مديرين</SelectItem>
                    <SelectItem value="developer">مطورين</SelectItem>
                    <SelectItem value="manager">مدراء</SelectItem>
                    <SelectItem value="business">أصحاب أعمال</SelectItem>
                    <SelectItem value="user">مستخدمين</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المستخدم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">النوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاريخ التسجيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                              {user.email && <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getRoleBadgeColor(user.userType || 'user')}>
                              {user.userType === 'admin' ? 'مدير' : 
                               user.userType === 'developer' ? 'مطور' :
                               user.userType === 'manager' ? 'مدير' :
                               user.userType === 'business' ? 'صاحب عمل' : 'مستخدم'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadgeColor(user.isActive || false)}>
                              {user.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.isActive ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deactivateUserMutation.mutate(user.id)}
                                  disabled={deactivateUserMutation.isPending}
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => activateUserMutation.mutate(user.id)}
                                  disabled={activateUserMutation.isPending}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المحتوى</h2>
              <p className="text-gray-600 dark:text-gray-400">مراجعة والموافقة على المحتوى المقدم من المستخدمين</p>
            </div>

            <Tabs defaultValue="products" className="space-y-4">
              <TabsList>
                <TabsTrigger value="products">المنتجات ({products.length})</TabsTrigger>
                <TabsTrigger value="services">الخدمات ({services.length})</TabsTrigger>
                <TabsTrigger value="jobs">الوظائف ({jobs.length})</TabsTrigger>
                <TabsTrigger value="announcements">الإعلانات ({announcements.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المنتج</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">السعر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الفئة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                  {product.imageUrl && (
                                    <img className="h-10 w-10 rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{product.description?.substring(0, 50)}...</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {product.price} د.ك
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{product.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                  <Badge className={getStatusBadgeColor(product.isActive || false)}>
                                    {product.isActive ? 'نشط' : 'غير نشط'}
                                  </Badge>
                                  {getApprovalBadge(product.isApproved)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveProductMutation.mutate(product.id)}
                                    disabled={approveProductMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectProductMutation.mutate(product.id)}
                                    disabled={rejectProductMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                        deleteProductMutation.mutate(product.id);
                                      }
                                    }}
                                    disabled={deleteProductMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الخدمة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الفئة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">التقييم</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{service.description?.substring(0, 50)}...</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{service.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                ⭐ {service.rating || '0.0'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                  <Badge className={getStatusBadgeColor(service.isActive || false)}>
                                    {service.isActive ? 'نشط' : 'غير نشط'}
                                  </Badge>
                                  {getApprovalBadge(service.isApproved)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveServiceMutation.mutate(service.id)}
                                    disabled={approveServiceMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectServiceMutation.mutate(service.id)}
                                    disabled={rejectServiceMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
                                        deleteServiceMutation.mutate(service.id);
                                      }
                                    }}
                                    disabled={deleteServiceMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الوظيفة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الشركة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">النوع</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{job.description.substring(0, 50)}...</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {job.company}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{job.type}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                  <Badge className={getStatusBadgeColor(job.isActive || false)}>
                                    {job.isActive ? 'نشط' : 'غير نشط'}
                                  </Badge>
                                  {getApprovalBadge(job.isApproved)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveJobMutation.mutate(job.id)}
                                    disabled={approveJobMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectJobMutation.mutate(job.id)}
                                    disabled={rejectJobMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) {
                                        deleteJobMutation.mutate(job.id);
                                      }
                                    }}
                                    disabled={deleteJobMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإعلان</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الفئة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">السعر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                          {announcements.map((announcement) => (
                            <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{announcement.title}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{announcement.description.substring(0, 50)}...</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{announcement.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {announcement.price ? `${announcement.price} د.ك` : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                  <Badge className={getStatusBadgeColor(announcement.isActive || false)}>
                                    {announcement.isActive ? 'نشط' : 'غير نشط'}
                                  </Badge>
                                  {getApprovalBadge(announcement.isApproved)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveAnnouncementMutation.mutate(announcement.id)}
                                    disabled={approveAnnouncementMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => rejectAnnouncementMutation.mutate(announcement.id)}
                                    disabled={rejectAnnouncementMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
                                        deleteAnnouncementMutation.mutate(announcement.id);
                                      }
                                    }}
                                    disabled={deleteAnnouncementMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التحليلات والتقارير</h2>
              <p className="text-gray-600 dark:text-gray-400">مراقبة أداء التطبيق والإحصائيات المتقدمة</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <BarChart3 className="h-5 w-5" />
                    <span>نمو المستخدمين</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">الرسم البياني قيد التطوير</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <TrendingUp className="h-5 w-5" />
                    <span>توزيع المحتوى</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>المنتجات</span>
                      <span className="font-bold">{products.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الخدمات</span>
                      <span className="font-bold">{services.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الوظائف</span>
                      <span className="font-bold">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الإعلانات</span>
                      <span className="font-bold">{announcements.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">سجلات النظام</h2>
                <p className="text-gray-600 dark:text-gray-400">مراقبة الأخطاء والتحذيرات والأنشطة</p>
              </div>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {logs.filter(log => !log.resolved).length} قضية نشطة
              </Badge>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">المستوى</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الرسالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">التوقيت</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              log.level === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              log.level === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }>
                              {log.level === 'error' ? 'خطأ' : log.level === 'warning' ? 'تحذير' : 'معلومات'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{log.message}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={log.resolved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                              {log.resolved ? 'محلول' : 'قيد المعالجة'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!log.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => resolveLogMutation.mutate(log.id)}
                                disabled={resolveLogMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 ml-1" />
                                حل المشكلة
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backups" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">النسخ الاحتياطية</h2>
                <p className="text-gray-600 dark:text-gray-400">إدارة النسخ الاحتياطية للبيانات</p>
              </div>
              <Button 
                onClick={() => createBackupMutation.mutate()}
                disabled={createBackupMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Database className="h-4 w-4 ml-2" />
                إنشاء نسخة احتياطية
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">التاريخ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">النوع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحجم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {backups.map((backup) => (
                        <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(backup.timestamp).toLocaleString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">
                              {backup.type === 'full' ? 'كاملة' : 'جزئية'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {backup.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                              backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {backup.status === 'completed' ? 'مكتملة' :
                               backup.status === 'failed' ? 'فشلت' : 'قيد التنفيذ'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {backup.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 ml-1" />
                                تحميل
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Developer System Tab */}
          {currentUser.userType === "developer" && (
            <TabsContent value="system" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة النظام</h2>
                <p className="text-gray-600 dark:text-gray-400">إعدادات النظام والأدوات المتقدمة للمطورين</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات النظام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>إصدار التطبيق</span>
                        <span className="font-mono">v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>قاعدة البيانات</span>
                        <span>PostgreSQL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>وقت التشغيل</span>
                        <span>24h 15m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>استخدام الذاكرة</span>
                        <span>145 MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>أدوات النظام</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="h-4 w-4 ml-2" />
                        إدارة قاعدة البيانات
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="h-4 w-4 ml-2" />
                        رفع التحديثات
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 ml-2" />
                        إعدادات الخادم
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="h-4 w-4 ml-2" />
                        مراقبة الأداء
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Developer Settings Tab */}
          {currentUser.userType === "developer" && (
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات التطبيق</h2>
                <p className="text-gray-600 dark:text-gray-400">تكوين إعدادات التطبيق العامة</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الإعدادات العامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance">وضع الصيانة</Label>
                      <Switch id="maintenance" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="registration">السماح بالتسجيل</Label>
                      <Switch id="registration" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">الإشعارات</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات المحتوى</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-approve">الموافقة التلقائية</Label>
                      <Switch id="auto-approve" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content-filter">تصفية المحتوى</Label>
                      <Switch id="content-filter" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="image-compression">ضغط الصور</Label>
                      <Switch id="image-compression" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات متقدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-upload">حد رفع الملفات (MB)</Label>
                      <Input id="max-upload" type="number" defaultValue="10" />
                    </div>
                    <div>
                      <Label htmlFor="session-timeout">انتهاء الجلسة (دقائق)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                    <div>
                      <Label htmlFor="email-server">خادم الإيميل</Label>
                      <Input id="email-server" placeholder="smtp.example.com" />
                    </div>
                    <div>
                      <Label htmlFor="api-rate-limit">حد استخدام API</Label>
                      <Input id="api-rate-limit" type="number" defaultValue="100" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button className="bg-green-600 hover:bg-green-700">
                      حفظ الإعدادات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>
              تعديل معلومات المستخدم المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">الاسم الكامل</Label>
                <Input id="edit-name" defaultValue={selectedUser.fullName} />
              </div>
              <div>
                <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                <Input id="edit-email" type="email" defaultValue={selectedUser.email || ''} />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input id="edit-phone" defaultValue={selectedUser.phone || ''} />
              </div>
              <div>
                <Label htmlFor="edit-role">نوع المستخدم</Label>
                <Select defaultValue={selectedUser.userType || 'user'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="business">صاحب عمل</SelectItem>
                    <SelectItem value="manager">مدير</SelectItem>
                    <SelectItem value="admin">مدير عام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}