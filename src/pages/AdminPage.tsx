
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Referral } from '@/types/referral';
import { loadAllAdminReferrals } from '@/services/admin/adminDataService';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';
import { useToast } from '@/hooks/use-toast';
import OverallStatsCards from '@/components/admin/OverallStatsCards';
import SpecialtyBreakdown from '@/components/admin/SpecialtyBreakdown';
import AdminPageSkeleton from '@/components/admin/AdminPageSkeleton';
import AdminAICopilot from '@/components/admin/AdminAICopilot';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';
import ServiceBreakdown from '@/components/admin/ServiceBreakdown';

const AdminPage = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Calculate statistics from all referrals (no filtering)
  const { serviceStats, overallStats } = useAdminStatistics(referrals);

  // Load all referrals data for comprehensive admin view
  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const data = await loadAllAdminReferrals();
      setReferrals(data);
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referrals data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadReferrals();
  }, []);

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Data has been updated',
    });
  };

  // Show loading skeleton
  if (isLoading) {
    return <AdminPageSkeleton onBack={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">Super User Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive overview of all referrals across all specialties and statuses
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              Displaying {referrals.length} total referrals including dashboard and waiting list data
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* AI Copilot */}
        <AdminAICopilot 
          referrals={referrals}
          overallStats={overallStats}
          specialtyStats={serviceStats}
        />

        {/* Overall Statistics */}
        <OverallStatsCards stats={overallStats} />

        {/* Specialty Breakdown */}
        <SpecialtyBreakdown 
          serviceStats={serviceStats} 
          currentService={null}
        />

        {/* Service Breakdown */}
        <ServiceBreakdown 
          serviceStats={serviceStats} 
          currentService={null}
        />
      </div>
    </div>
  );
};

export default AdminPage;
