import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import RequiredFieldsGuide from "@/components/required-fields-guide";

export default function FieldsGuidePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 space-x-reverse mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/add-product")}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لإضافة منتج</span>
          </Button>
        </div>
        
        <RequiredFieldsGuide />
      </div>
    </div>
  );
}