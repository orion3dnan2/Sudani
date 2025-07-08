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
        <div className="bg-gradient-to-r from-sudan-red to-sudan-green rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-2">أهلاً وسهلاً بك</h2>
          <p className="text-sm opacity-90">اكتشف الخدمات والمنتجات السودانية في الكويت</p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {mainSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.path}
                onClick={() => setLocation(section.path)}
                className={`card-hover bg-white rounded-2xl p-6 shadow-lg cursor-pointer border-2 border-transparent hover:border-${section.color} transition-all`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${section.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 text-${section.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{section.title}</h3>
                  <p className="text-xs text-gray-600">{section.description}</p>
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
