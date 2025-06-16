
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ReferralView from "./pages/ReferralView";
import NotFound from "./pages/NotFound";
import SpecialtySelection from "./pages/SpecialtySelection";
import CohortBuilder from "./pages/CohortBuilder";
import AdminPage from "./pages/AdminPage";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import FloatingMenu from "./components/FloatingMenu";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <FloatingMenu />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/referral/:id" element={<ReferralView />} />
            <Route path="/select-specialty" element={<SpecialtySelection />} />
            <Route path="/cohort-builder" element={<CohortBuilder />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
