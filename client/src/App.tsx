import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/pages/welcome";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import BusinessDashboardPage from "@/pages/business-dashboard";
import AddProductPage from "@/pages/add-product";
import MarketPage from "@/pages/market";
import StoresPage from "@/pages/stores";
import ServicesPage from "@/pages/services";
import JobsPage from "@/pages/jobs";
import AnnouncementsPage from "@/pages/announcements";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminDashboardNew from "@/pages/admin-dashboard-new";
import AdminDashboardEnhanced from "@/pages/admin-dashboard-enhanced";
import StoreSettingsPage from "@/pages/store-settings";
import FieldsGuidePage from "@/pages/fields-guide";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/business-dashboard" component={BusinessDashboardPage} />
      <Route path="/add-product" component={AddProductPage} />
      <Route path="/market" component={MarketPage} />
      <Route path="/stores" component={StoresPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/announcements" component={AnnouncementsPage} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin-dashboard-new" component={AdminDashboardNew} />
      <Route path="/admin-dashboard-enhanced" component={AdminDashboardEnhanced} />
      <Route path="/store-settings" component={StoreSettingsPage} />
      <Route path="/fields-guide" component={FieldsGuidePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
