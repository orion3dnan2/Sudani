import { ArrowRight, Plus, MapPin, Clock, DollarSign, Bookmark } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function JobsPage() {
  const [, setLocation] = useLocation();

  const jobFilters = ["الكل", "بدوام كامل", "بدوام جزئي", "عن بُعد"];
  
  const jobs = [
    {
      id: 1,
      title: "مطور تطبيقات موبايل",
      company: "شركة التكنولوجيا السودانية",
      location: "مدينة الكويت - السالمية",
      type: "بدوام كامل",
      salary: "٨٠٠ - ١٢٠٠ د.ك شهرياً",
      description: "نبحث عن مطور تطبيقات موبايل خبير في Flutter وReact Native للانضمام لفريقنا المتنامي...",
      isNew: true,
      postedTime: "جديد",
    },
    {
      id: 2,
      title: "مدير مطعم",
      company: "مطعم النيل الأزرق",
      location: "حولي - بيان",
      type: "بدوام كامل",
      salary: "٦٠٠ - ٩٠٠ د.ك شهرياً",
      description: "مطلوب مدير مطعم ذو خبرة في إدارة المطاعم السودانية والعربية...",
      isNew: false,
      postedTime: "٣ أيام",
    },
    {
      id: 3,
      title: "مترجم عربي-إنجليزي",
      company: "مكتب الخرطوم للترجمة",
      location: "عن بُعد / مدينة الكويت",
      type: "بدوام جزئي",
      salary: "٤٠٠ - ٦٠٠ د.ك شهرياً",
      description: "نبحث عن مترجم محترف للعمل على ترجمة المستندات والمراسلات...",
      isNew: false,
      postedTime: "أسبوع",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">الوظائف</h2>
              <p className="text-sm text-gray-600">فرص عمل متاحة</p>
            </div>
          </div>
          <button className="bg-sudan-yellow text-gray-800 px-4 py-2 rounded-full text-sm font-bold">
            <Plus className="h-3 w-3 ml-1" />
            إضافة وظيفة
          </button>
        </div>

        {/* Job Filters */}
        <div className="flex space-x-2 space-x-reverse mb-6 overflow-x-auto pb-2">
          {jobFilters.map((filter, index) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-bold ${
                index === 0
                  ? "bg-sudan-yellow text-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`bg-white rounded-2xl p-5 shadow-lg ${
                job.isNew ? "border-r-4 border-sudan-yellow" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{job.title}</h3>
                  <p className="text-sudan-green font-medium">{job.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.isNew 
                    ? "bg-sudan-yellow text-gray-800"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {job.postedTime}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 ml-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 ml-2" />
                  <span>{job.salary}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">{job.description}</p>
              
              <div className="flex space-x-2 space-x-reverse">
                <button className="bg-sudan-yellow text-gray-800 px-4 py-2 rounded-full text-sm font-bold flex-1">
                  تقدم الآن
                </button>
                <button className="bg-gray-100 text-gray-700 p-2 rounded-full">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
