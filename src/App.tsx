
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import ReferralView from "./pages/ReferralView";
import NotFound from "./pages/NotFound";
import SpecialtySelection from "./pages/SpecialtySelection";
import CohortBuilder from "./pages/CohortBuilder";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/referral/:id" element={<ReferralView />} />
              <Route path="/select-specialty" element={<SpecialtySelection />} />
              <Route path="/cohort-builder" element={<CohortBuilder />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
