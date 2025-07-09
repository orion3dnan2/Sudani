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
  RefreshCw
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type User, type Product, type Service, type Job, type Announcement } from "@shared/schema";

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

export default function AdminDashboardNew() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('/api/admin/stats'),
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
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
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
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

  // Backup creation mutation
  const createBackupMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/backup', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      toast({ title: "تم إنشاء النسخة الاحتياطية بنجاح" });
    },
  });

  // System log resolution mutation
  const resolveLogMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/logs/${id}/resolve`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/logs'] });
      toast({ title: "تم حل المشكلة بنجاح" });
    },
  });

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.userType === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'business': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">لوحة التحكم الإدارية</h1>
              <p className="text-gray-600 dark:text-gray-400">إدارة شاملة لمنصة البيت السوداني</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button
              onClick={() => queryClient.invalidateQueries()}
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث البيانات
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="analytics">التقارير والتحليلات</TabsTrigger>
            <TabsTrigger value="logs">سجلات النظام</TabsTrigger>
            <TabsTrigger value="backup">النسخ الاحتياطية</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Settings className="w-5 h-5" />
                  <span>الإجراءات السريعة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab("users")}
                    className="h-20 flex-col space-y-2"
                    variant="outline"
                  >
                    <Users className="w-6 h-6" />
                    <span>إدارة المستخدمين</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("content")}
                    className="h-20 flex-col space-y-2"
                    variant="outline"
                  >
                    <FileText className="w-6 h-6" />
                    <span>إدارة المحتوى</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("analytics")}
                    className="h-20 flex-col space-y-2"
                    variant="outline"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>التقارير</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("backup")}
                    className="h-20 flex-col space-y-2"
                    variant="outline"
                  >
                    <Database className="w-6 h-6" />
                    <span>النسخ الاحتياطية</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
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
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    إجمالي المستخدمين: {filteredUsers.length}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            {user.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{user.username}
                          </p>
                        </div>
                        <Badge className={getRoleBadgeColor(user.userType || 'user')}>
                          {user.userType === 'admin' ? 'مدير' : 
                           user.userType === 'manager' ? 'مدير فرعي' :
                           user.userType === 'business' ? 'صاحب عمل' : 'مستخدم'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
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
                  ))}
                </div>
              </CardContent>
            </Card>

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
                      <Button
                        variant="outline"
                        onClick={() => setEditingUser(null)}
                      >
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
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Products */}
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{service.category}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => deleteServiceMutation.mutate(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Jobs */}
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => deleteJobMutation.mutate(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Announcements */}
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-700">
                        <div>
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{announcement.category}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>تحليلات المنصة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    قريباً: رسوم بيانية تفاعلية للنشاط والنمو
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>سجلات النظام</CardTitle>
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
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}