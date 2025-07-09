import { Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequiredFieldsGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          دليل الحقول المطلوبة
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          تعرف على جميع الحقول المطلوبة لإضافة منتج أو خدمة جديدة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Fields */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800 dark:text-green-200">
              <Check className="w-5 h-5" />
              <span>إضافة منتج جديد</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">اسم المنتج</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                أدخل اسم المنتج بوضوح (مثال: كيس أرز بسمتي)
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">وصف المنتج</span>
                <Badge variant="secondary">اختياري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                وصف تفصيلي للمنتج وخصائصه
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">السعر</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                أدخل السعر بالدينار الكويتي (مثال: 2.5)
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">فئة المنتج</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اختر الفئة المناسبة من القائمة المنسدلة
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">رقم الواتساب للطلب</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                رقم الواتساب للتواصل مع المشتري (8 أرقام على الأقل)
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">رابط صورة المنتج</span>
                <Badge variant="secondary">اختياري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                رابط لصورة المنتج (اختياري)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Fields */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-blue-800 dark:text-blue-200">
              <Check className="w-5 h-5" />
              <span>إضافة خدمة جديدة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">اسم الخدمة</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                أدخل اسم الخدمة بوضوح (مثال: عيادة طبيب أسنان)
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">وصف الخدمة</span>
                <Badge variant="secondary">اختياري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                وصف تفصيلي للخدمة المقدمة
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">فئة الخدمة</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اختر الفئة المناسبة من القائمة المنسدلة
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">رقم الهاتف</span>
                <Badge variant="destructive">مطلوب</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                رقم الهاتف للتواصل (8 أرقام على الأقل)
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">العنوان</span>
                <Badge variant="secondary">اختياري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                عنوان الخدمة أو مكان تقديمها
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">رابط صورة الخدمة</span>
                <Badge variant="secondary">اختياري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                رابط لصورة الخدمة (اختياري)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Issues */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <span>مشاكل شائعة وحلولها</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                "حدث خطأ في التحقق من البيانات"
              </h3>
              <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• تأكد من ملء جميع الحقول المطلوبة (المميزة باللون الأحمر)</li>
                <li>• تأكد من أن رقم الواتساب/الهاتف يحتوي على 8 أرقام على الأقل</li>
                <li>• تأكد من أن السعر رقم صحيح (مثال: 2.5 وليس "درهمين ونص")</li>
                <li>• تأكد من اختيار فئة من القائمة المنسدلة</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                "فشل في إرسال البيانات"
              </h3>
              <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>• تأكد من اتصالك بالإنترنت</li>
                <li>• حاول إعادة تسجيل الدخول</li>
                <li>• تأكد من أن جميع الحقول مملوءة بشكل صحيح</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800 dark:text-green-200">
            <Check className="w-5 h-5" />
            <span>نصائح للنجاح</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">للمنتجات:</h4>
              <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                <li>• استخدم أسماء واضحة ومميزة</li>
                <li>• أضف وصف مفصل يشرح المنتج</li>
                <li>• تأكد من دقة السعر</li>
                <li>• استخدم صور عالية الجودة</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">للخدمات:</h4>
              <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                <li>• اكتب اسم الخدمة بوضوح</li>
                <li>• أضف وصف شامل للخدمة</li>
                <li>• تأكد من صحة رقم الهاتف</li>
                <li>• أضف عنوان واضح ومحدد</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}