
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ReferralView from "./pages/ReferralView";
import WaitingListView from "./pages/WaitingListView";
import NotFound from "./pages/NotFound";
import SpecialtySelection from "./pages/SpecialtySelection";
import CohortBuilder from "./pages/CohortBuilder";
import AdminPage from "./pages/AdminPage";
import { useReferralNotifications } from "./hooks/useReferralNotifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  useReferralNotifications();

  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/referral/:id" element={<ReferralView />} />
        <Route path="/waiting-list/referral/:id" element={<WaitingListView />} />
        <Route path="/select-specialty" element={<SpecialtySelection />} />
        <Route path="/cohort-builder" element={<CohortBuilder />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
