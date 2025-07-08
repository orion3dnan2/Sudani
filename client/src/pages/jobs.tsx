import { ArrowRight, MapPin, Clock, DollarSign, User, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJobSchema, type InsertJob } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import type { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function JobsPage() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("الكل");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch jobs from database
  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: () => fetch('/api/jobs').then(res => res.json()) as Promise<Job[]>
  });

  // Filter jobs based on search and type
  const filteredJobs = allJobs
    .filter(job => selectedType === "الكل" || job.type === selectedType)
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const jobTypes = [
    { name: "الكل", count: allJobs.length },
    { name: "دوام كامل", count: allJobs.filter(j => j.type === "دوام كامل").length },
    { name: "دوام جزئي", count: allJobs.filter(j => j.type === "دوام جزئي").length },
    { name: "عن بعد", count: allJobs.filter(j => j.type === "عن بعد").length },
    { name: "تدريب", count: allJobs.filter(j => j.type === "تدريب").length },
  ];

  // Form for adding new jobs
  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      description: "",
      company: "",
      location: "",
      type: "",
      salary: "",

    }
  });

  // Mutation for adding new job
  const addJobMutation = useMutation({
    mutationFn: (data: InsertJob) => apiRequest('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "تم إضافة الوظيفة بنجاح",
        description: "تم إضافة الوظيفة الجديدة إلى قائمة الوظائف",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إضافة الوظيفة",
        description: "حدث خطأ أثناء إضافة الوظيفة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertJob) => {
    addJobMutation.mutate(data);
  };

  // Handle job application (for demo - could integrate with email or external system)
  const handleApplyJob = (job: Job) => {
    toast({
      title: "تم تسجيل الاهتمام",
      description: `تم تسجيل اهتمامك بوظيفة ${job.title}. سيتم التواصل معك قريباً.`,
    });
  };

  // Handle save job for later
  const handleSaveJob = (job: Job) => {
    toast({
      title: "تم حفظ الوظيفة",
      description: `تم حفظ وظيفة ${job.title} في قائمة الوظائف المحفوظة.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-sudan-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الوظائف...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">الوظائف</h2>
              <p className="text-sm text-gray-600">فرص عمل للجالية السودانية</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-sudan-yellow text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن وظيفة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white rounded-2xl px-4 py-3 text-sm border-2 border-gray-100 focus:border-sudan-yellow focus:outline-none"
            />
          </div>
        </div>

        {/* Job Types Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
            {jobTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
                  selectedType === type.name
                    ? "bg-sudan-yellow text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                {type.name} ({type.count})
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{job.title}</h3>
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <DollarSign className="w-4 h-4 text-sudan-green" />
                    <span className="text-sm font-bold text-sudan-green">{job.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 space-x-reverse">
                <button 
                  onClick={() => handleApplyJob(job)}
                  className="flex-1 bg-sudan-yellow text-white py-3 rounded-full font-bold text-sm"
                >
                  التقدم للوظيفة
                </button>
                <button 
                  onClick={() => handleSaveJob(job)}
                  className="px-4 py-3 border-2 border-sudan-yellow text-sudan-yellow rounded-full font-bold text-sm hover:bg-sudan-yellow hover:text-white transition-colors"
                >
                  حفظ
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد وظائف متاحة</h3>
            <p className="text-sm text-gray-600 mb-6">
              سيتم عرض الوظائف المتاحة هنا عند إضافتها
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-sudan-yellow text-white px-6 py-3 rounded-full font-bold text-sm"
            >
              إضافة وظيفة جديدة
            </button>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة وظيفة جديدة</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مسمى الوظيفة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: مطور تطبيقات موبايل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف الوظيفة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب وصف مفصل للوظيفة والمهام المطلوبة..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الشركة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: شركة التكنولوجيا السودانية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموقع</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: مدينة الكويت - السالمية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الوظيفة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الوظيفة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="بدوام كامل">بدوام كامل</SelectItem>
                          <SelectItem value="بدوام جزئي">بدوام جزئي</SelectItem>
                          <SelectItem value="عن بُعد">عن بُعد</SelectItem>
                          <SelectItem value="مؤقت">مؤقت</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الراتب</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: 500 - 700 د.ك شهرياً" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-3 space-x-reverse pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={addJobMutation.isPending}
                    className="flex-1 bg-sudan-yellow hover:bg-yellow-600"
                  >
                    {addJobMutation.isPending ? "جاري الإضافة..." : "إضافة الوظيفة"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}