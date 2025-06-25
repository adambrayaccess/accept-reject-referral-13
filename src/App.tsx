
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Titlebar from "@/components/Titlebar";
import Index from "./pages/Index";
import ReferralView from "./pages/ReferralView";
import NotFound from "./pages/NotFound";
import SpecialtySelection from "./pages/SpecialtySelection";
import CohortBuilder from "./pages/CohortBuilder";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      {user ? (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/referral/:id" element={<ReferralView />} />
          <Route path="/select-specialty" element={<SpecialtySelection />} />
          <Route path="/cohort-builder" element={<CohortBuilder />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Referral System</h1>
            <p className="text-gray-600 mb-4">Please login to access the application</p>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
