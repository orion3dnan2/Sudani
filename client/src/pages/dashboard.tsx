import { useLocation } from "wouter";
import { ShoppingBasket, Building, Briefcase, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import type { Product, Service, Job, Announcement } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();

  // Fetch statistics
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products').then(res => res.json()) as Promise<Product[]>
  });

  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
    queryFn: () => fetch('/api/services').then(res => res.json()) as Promise<Service[]>
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()) as Promise<Job[]>
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: () => fetch('/api/announcements').then(res => res.json()) as Promise<Announcement[]>
  });

  const mainSections = [
    {
      title: "السوق السوداني",
      description: "منتجات وأطعمة سودانية أصيلة",
      icon: ShoppingBasket,
      path: "/market",
      color: "sudan-red",
      bgColor: "bg-red-50",
    },
    {
      title: "دليل الخدمات",
      description: "شركات ومطاعم وصالونات",
      icon: Building,
      path: "/services",
      color: "sudan-green",
      bgColor: "bg-green-50",
    },
    {
      title: "الوظائف",
      description: "فرص عمل ووظائف شاغرة",
      icon: Briefcase,
      path: "/jobs",
      color: "sudan-yellow",
      bgColor: "bg-yellow-50",
    },
    {
      title: "الإعلانات",
      description: "مناسبات وإعلانات مبوبة",
      icon: Megaphone,
      path: "/announcements",
      color: "sudan-black",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="sudan-heritage-bg rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="traditional-pattern absolute inset-0 opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">أهلاً وسهلاً بك في البيت السوداني</h2>
            <p className="text-sm opacity-90">اكتشف الخدمات والمنتجات السودانية الأصيلة في الكويت</p>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {mainSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.path}
                onClick={() => setLocation(section.path)}
                className="sudanese-card rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-sudan-copper hover:shadow-lg group"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br from-sudan-sand to-sudan-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-sudan-gold group-hover:to-sudan-copper transition-all duration-300`}>
                    <Icon className="h-8 w-8 text-sudan-red group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-sudan-black dark:text-sudan-sand mb-2">{section.title}</h3>
                  <p className="text-xs text-sudan-earth dark:text-sudan-sand">{section.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">إحصائيات سريعة</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-sudan-red">{products.length}</div>
              <div className="text-xs text-gray-600">منتج متاح</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sudan-green">{services.length}</div>
              <div className="text-xs text-gray-600">خدمة مسجلة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sudan-yellow">{jobs.length}</div>
              <div className="text-xs text-gray-600">وظيفة جديدة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sudan-black">{announcements.length}</div>
              <div className="text-xs text-gray-600">إعلان</div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
