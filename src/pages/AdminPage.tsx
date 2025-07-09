
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
import AdminAICopilotButton from '@/components/admin/AdminAICopilotButton';
import PageHeader from '@/components/PageHeader';
import DischargeAnalyticsChart from '@/components/admin/DischargeAnalyticsChart';
import ReferralSourceChart from '@/components/admin/ReferralSourceChart';
import SpecialtyVolumeChart from '@/components/admin/SpecialtyVolumeChart';
import ReferralTrendAnalysis from '@/components/admin/ReferralTrendAnalysis';
import PerformanceMetrics from '@/components/admin/PerformanceMetrics';

const AdminPage = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Calculate statistics from all referrals (no filtering)
  const { specialtyStats, overallStats } = useAdminStatistics(referrals);

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
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive overview of all referrals across all specialties and statuses
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              Displaying {referrals.length} total referrals including dashboard and waiting list data
            </div>
          </div>
          <div className="flex gap-2">
            <AdminAICopilotButton 
              referrals={referrals}
              overallStats={overallStats}
              specialtyStats={specialtyStats}
            />
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Overall Statistics */}
        <OverallStatsCards stats={overallStats} />

        {/* Performance Metrics */}
        <PerformanceMetrics referrals={referrals} />

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DischargeAnalyticsChart referrals={referrals} />
          <ReferralSourceChart referrals={referrals} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpecialtyVolumeChart referrals={referrals} />
          <div className="lg:col-span-1">
            <ReferralTrendAnalysis referrals={referrals} />
          </div>
        </div>

        {/* Detailed Specialty Breakdown */}
        <SpecialtyBreakdown 
          specialtyStats={specialtyStats} 
          currentSpecialty={null}
        />
      </div>
    </div>
  );
};

export default AdminPage;
