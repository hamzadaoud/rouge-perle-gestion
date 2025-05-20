
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import TimeTrackingPage from "./pages/TimeTrackingPage";
import AgentsPage from "./pages/AgentsPage";
import InvoicesPage from "./pages/InvoicesPage";
import RevenuePage from "./pages/RevenuePage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
