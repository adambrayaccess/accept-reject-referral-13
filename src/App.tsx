
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
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useReferralNotifications } from "./hooks/useReferralNotifications";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  useReferralNotifications();

  return (
    <TooltipProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/referral/:id" element={
          <ProtectedRoute>
            <ReferralView />
          </ProtectedRoute>
        } />
        <Route path="/waiting-list/referral/:id" element={
          <ProtectedRoute>
            <WaitingListView />
          </ProtectedRoute>
        } />
        <Route path="/select-specialty" element={
          <ProtectedRoute>
            <SpecialtySelection />
          </ProtectedRoute>
        } />
        <Route path="/cohort-builder" element={
          <ProtectedRoute>
            <CohortBuilder />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
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
