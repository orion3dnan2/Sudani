import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomePage from "@/pages/welcome";
import DashboardPage from "@/pages/dashboard";
import MarketPage from "@/pages/market";
import ServicesPage from "@/pages/services";
import JobsPage from "@/pages/jobs";
import AnnouncementsPage from "@/pages/announcements";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/market" component={MarketPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/announcements" component={AnnouncementsPage} />
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
