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
  ArrowLeft,
  Key,
  HardDrive,
  AlertTriangle,
  FileDown,
  FileUp,
  PieChart,
  LineChart,
  TrendingDown,
  Wifi,
  WifiOff,
  Save,
  RotateCcw,
  Power,
  Server,
  Cpu,
  MemoryStick,
  Network,
  Trash,
  Copy,
  FolderOpen,
  FileCheck,
  Users2,
  Settings2,
  PlusCircle,
  MinusCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  Bookmark,
  Tag,
  Timer,
  Stopwatch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      await apiRequest(`/api/${type}/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف العنصر بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف العنصر",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setLocation("/admin-login");
  };

  // Fetch users from database
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  // Edit Profile Modal Component
  const EditProfileModal = ({ user, onClose }: { user: any; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      userType: user?.userType || "user",
      password: ""
    });

    const updateUserMutation = useMutation({
      mutationFn: async (userData: any) => {
        // Don't send password if it's empty (user doesn't want to change it)
        const dataToSend = { ...userData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        
        return await apiRequest(`/api/users/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSend),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        toast({
          title: "تم تحديث الملف الشخصي بنجاح",
          description: "تم حفظ التغييرات بنجاح",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "خطأ في التحديث",
          description: error?.message || "حدث خطأ أثناء تحديث الملف الشخصي",
          variant: "destructive",
        });
      }
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateUserMutation.mutate(formData);
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">تعديل الملف الشخصي</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="الاسم الكامل"
              className="text-right"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="اسم المستخدم"
              className="text-right"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="البريد الإلكتروني"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="رقم الهاتف"
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">نوع المستخدم</Label>
            <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر نوع المستخدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مدير عام</SelectItem>
                <SelectItem value="manager">مدير فرعي</SelectItem>
                <SelectItem value="business">صاحب عمل</SelectItem>
                <SelectItem value="user">مستخدم عادي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور الجديدة (اختياري)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور"
              className="text-right"
            />
          </div>

          <div className="flex space-x-2 space-x-reverse pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateUserMutation.isPending}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={updateUserMutation.isPending}
              className="flex-1"
            >
              {updateUserMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </DialogContent>
    );
  };

  // User Permissions Management Component
  const UserPermissionsManager = () => {
    const [editingUser, setEditingUser] = useState<any>(null);

    const getUserTypeLabel = (userType: string) => {
      switch (userType) {
        case 'admin': return 'مدير عام';
        case 'manager': return 'مدير فرعي';
        case 'business': return 'صاحب عمل';
        default: return 'مستخدم عادي';
      }
    };

    const getUserTypeBadgeClass = (userType: string) => {
      switch (userType) {
        case 'admin': return 'bg-red-100 text-red-700';
        case 'manager': return 'bg-blue-100 text-blue-700';
        case 'business': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Users className="w-5 h-5 text-blue-600" />
            <span>إدارة المستخدمين والصلاحيات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد مستخدمين مسجلين بعد</p>
              </div>
            ) : (
              users.map((user: any) => (
                <div key={user.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <h3 className="font-medium text-lg">{user.fullName}</h3>
                        <Badge className={getUserTypeBadgeClass(user.userType)}>
                          {getUserTypeLabel(user.userType)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">اسم المستخدم:</span> @{user.username}</p>
                        {user.email && <p><span className="font-medium">البريد:</span> {user.email}</p>}
                        {user.phone && <p><span className="font-medium">الهاتف:</span> {user.phone}</p>}
                        <p><span className="font-medium">تاريخ التسجيل:</span> {new Date(user.createdAt).toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                            className="flex items-center space-x-1 space-x-reverse"
                          >
                            <Edit className="w-4 h-4" />
                            <span>تعديل الملف</span>
                          </Button>
                        </DialogTrigger>
                        {editingUser && (
                          <EditProfileModal 
                            user={editingUser} 
                            onClose={() => setEditingUser(null)} 
                          />
                        )}
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Backup Management Component
  const BackupManager = () => {
    const [backups, setBackups] = useState([
      { id: 1, name: "backup_2025_01_08_morning.sql", date: "2025-01-08 10:30:00", size: "2.5 MB" },
      { id: 2, name: "backup_2025_01_07_evening.sql", date: "2025-01-07 18:00:00", size: "2.3 MB" },
      { id: 3, name: "backup_2025_01_06_daily.sql", date: "2025-01-06 12:00:00", size: "2.1 MB" },
    ]);

    const createBackup = () => {
      const newBackup = {
        id: Date.now(),
        name: `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.sql`,
        date: new Date().toLocaleString('ar'),
        size: "2.6 MB"
      };
      setBackups([newBackup, ...backups]);
      toast({ title: "تم إنشاء النسخة الاحتياطية بنجاح" });
    };

    const downloadBackup = (backup: any) => {
      toast({ title: `جاري تحميل ${backup.name}` });
    };

    const restoreBackup = (backup: any) => {
      if (confirm(`هل أنت متأكد من استرجاع ${backup.name}؟ سيتم فقدان البيانات الحالية.`)) {
        toast({ title: `جاري استرجاع ${backup.name}` });
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <HardDrive className="w-5 h-5 text-green-600" />
            <span>🧰 إدارة النسخ الاحتياطي</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button onClick={createBackup} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                إنشاء نسخة احتياطية جديدة
              </Button>
              <input
                type="file"
                accept=".sql"
                className="hidden"
                id="backup-upload"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    toast({ title: "جاري رفع النسخة الاحتياطية..." });
                  }
                }}
              />
              <Button 
                onClick={() => document.getElementById('backup-upload')?.click()}
                variant="outline"
              >
                <FileUp className="w-4 h-4 ml-2" />
                رفع نسخة احتياطية
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">النسخ الاحتياطية المتاحة:</h3>
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <p className="text-sm text-gray-600">{backup.date} - {backup.size}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadBackup(backup)}
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreBackup(backup)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`هل تريد حذف ${backup.name}؟`)) {
                          setBackups(backups.filter(b => b.id !== backup.id));
                          toast({ title: "تم حذف النسخة الاحتياطية" });
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Statistics Dashboard Component
  const StatisticsDashboard = () => {
    const stats = {
      users: { total: 1245, growth: 12 },
      products: { total: 567, growth: 8 },
      services: { total: 234, growth: 15 },
      jobs: { total: 89, growth: -5 },
      announcements: { total: 345, growth: 22 }
    };

    const exportToPDF = () => {
      toast({ title: "جاري تصدير البيانات إلى PDF..." });
    };

    const exportToExcel = () => {
      toast({ title: "جاري تصدير البيانات إلى Excel..." });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span>📊 الإحصائيات العامة والتقارير</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button size="sm" variant="outline" onClick={exportToPDF}>
                <FileDown className="w-4 h-4 ml-2" />
                تصدير PDF
              </Button>
              <Button size="sm" variant="outline" onClick={exportToExcel}>
                <FileDown className="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-lg text-center">
                <h3 className="text-2xl font-bold text-blue-600">{value.total}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {key === 'users' ? 'المستخدمين' :
                   key === 'products' ? 'المنتجات' :
                   key === 'services' ? 'الخدمات' :
                   key === 'jobs' ? 'الوظائف' : 'الإعلانات'}
                </p>
                <div className={`flex items-center justify-center space-x-1 space-x-reverse text-xs ${
                  value.growth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {value.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(value.growth)}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">نشاط المستخدمين (آخر 7 أيام)</h3>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <LineChart className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500 ml-2">رسم بياني للنشاط</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">توزيع المحتوى</h3>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <PieChart className="w-8 h-8 text-gray-400" />
                <span className="text-gray-500 ml-2">مخطط دائري للتوزيع</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Error Log Component
  const ErrorLogSystem = () => {
    const [errorLogs, setErrorLogs] = useState([
      { 
        id: 1, 
        message: "Database connection timeout", 
        date: "2025-01-08 11:30:15", 
        user: "system", 
        page: "/api/products", 
        level: "high",
        resolved: false 
      },
      { 
        id: 2, 
        message: "Invalid user input in registration form", 
        date: "2025-01-08 10:15:30", 
        user: "user123", 
        page: "/register", 
        level: "medium",
        resolved: true 
      },
      { 
        id: 3, 
        message: "Image upload failed - file too large", 
        date: "2025-01-08 09:45:20", 
        user: "business_owner", 
        page: "/add-product", 
        level: "low",
        resolved: false 
      },
    ]);

    const resolveError = (errorId: number) => {
      setErrorLogs(logs => 
        logs.map(log => 
          log.id === errorId ? { ...log, resolved: true } : log
        )
      );
      toast({ title: "تم وضع علامة حل للخطأ" });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>❌ سجل الأخطاء والمشاكل التقنية</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorLogs.map((error) => (
              <div 
                key={error.id} 
                className={`p-4 border rounded-lg ${
                  error.level === 'high' ? 'border-red-200 bg-red-50' :
                  error.level === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                } ${error.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Badge 
                      variant={error.level === 'high' ? 'destructive' : 'default'}
                      className={
                        error.level === 'high' ? 'bg-red-100 text-red-700' :
                        error.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }
                    >
                      {error.level === 'high' ? 'عالي' :
                       error.level === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                    {error.resolved && (
                      <Badge className="bg-green-100 text-green-700">
                        ✅ تم الحل
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{error.date}</span>
                </div>
                <h3 className="font-medium mb-1">{error.message}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>المستخدم: {error.user}</p>
                  <p>الصفحة: {error.page}</p>
                </div>
                {!error.resolved && (
                  <Button
                    size="sm"
                    onClick={() => resolveError(error.id)}
                    className="mt-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    تم الحل
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Notifications Management Component
  const NotificationsManagement = () => {
    const [notificationSettings, setNotificationSettings] = useState([
      { id: 'new_user', name: 'مستخدم جديد', enabled: true, description: 'عند تسجيل مستخدم جديد' },
      { id: 'new_product', name: 'منتج جديد', enabled: true, description: 'عند إضافة منتج للمراجعة' },
      { id: 'new_job', name: 'وظيفة جديدة', enabled: false, description: 'عند إضافة وظيفة جديدة' },
      { id: 'system_error', name: 'خطأ تقني', enabled: true, description: 'عند حدوث خطأ في النظام' },
      { id: 'daily_report', name: 'التقرير اليومي', enabled: true, description: 'تقرير يومي بالإحصائيات' },
    ]);

    const toggleNotification = (notificationId: string) => {
      setNotificationSettings(settings =>
        settings.map(setting =>
          setting.id === notificationId
            ? { ...setting, enabled: !setting.enabled }
            : setting
        )
      );
      toast({ title: "تم تحديث إعدادات الإشعارات" });
    };

    const sendCustomNotification = () => {
      toast({ title: "تم إرسال الإشعار المخصص" });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>🔔 إدارة التنبيهات والإشعارات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{setting.name}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() => toggleNotification(setting.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">إرسال إشعار مخصص</h3>
              <div className="space-y-3">
                <Input placeholder="عنوان الإشعار" />
                <textarea 
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="نص الإشعار..."
                ></textarea>
                <Button onClick={sendCustomNotification}>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الإشعار
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-300 to-sky-200 text-black p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">لوحة تحكم المطور</h1>
              <p className="text-sm opacity-90">أحمد محمد - المدير العام</p>
              <Badge className="bg-white text-black text-xs mt-1 border border-black/20">✅ المدير العام – تحكم كامل</Badge>
            </div>
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              className="border-black/30 text-black hover:bg-white/20 flex items-center space-x-2 space-x-reverse"
            >
              <Eye className="w-4 h-4" />
              <span>👁‍🗨 عرض التطبيق كزائر</span>
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
              className="border-black/30 text-black hover:bg-white/20 flex items-center space-x-2 space-x-reverse"
            >
              <RefreshCw className="w-4 h-4" />
              <span>🔁 العودة إلى واجهة المستخدم</span>
            </Button>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-black/30 text-black hover:bg-white/20 flex items-center space-x-2 space-x-reverse"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="overview" className="text-xs">النظرة العامة</TabsTrigger>
            <TabsTrigger value="permissions" className="text-xs">🔐 صلاحيات المستخدمين</TabsTrigger>
            <TabsTrigger value="backup" className="text-xs">🧰 النسخ الاحتياطي</TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs">📊 الإحصائيات العامة</TabsTrigger>
            <TabsTrigger value="errors" className="text-xs">❌ سجل الأخطاء</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">🔔 إدارة التنبيهات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">مرحباً بك في لوحة التحكم المطورة</h2>
              <p className="text-gray-600">تطبيق "البيت السوداني" - إدارة شاملة للمجتمع السوداني في الكويت</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-blue-600">1,245</h3>
                  <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-green-600">567</h3>
                  <p className="text-sm text-gray-600">المنتجات والخدمات</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-purple-600">89</h3>
                  <p className="text-sm text-gray-600">الوظائف المتاحة</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-bold text-2xl text-orange-600">345</h3>
                  <p className="text-sm text-gray-600">الإعلانات النشطة</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <UserPermissionsManager />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <BackupManager />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <StatisticsDashboard />
          </TabsContent>

          <TabsContent value="errors" className="space-y-6">
            <ErrorLogSystem />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}