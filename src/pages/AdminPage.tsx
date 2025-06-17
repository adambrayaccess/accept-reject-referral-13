
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Referral } from '@/types/referral';
import { loadDashboardReferrals } from '@/services/dashboard/dashboardDataService';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';
import { useToast } from '@/hooks/use-toast';
import OverallStatsCards from '@/components/admin/OverallStatsCards';
import SpecialtyBreakdown from '@/components/admin/SpecialtyBreakdown';
import AdminSpecialtySelector from '@/components/admin/AdminSpecialtySelector';
import AllocationView from '@/components/allocation/AllocationView';
import AdminPageSkeleton from '@/components/admin/AdminPageSkeleton';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const AdminPage = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const specialties = [
    'Cardiology',
    'Dermatology', 
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Psychiatry',
    'Pulmonology',
    'Rheumatology',
    'Mental Health'
  ];

  // Get filtered referrals based on current specialty
  const filteredReferrals = currentSpecialty 
    ? referrals.filter(r => r.specialty === currentSpecialty)
    : referrals;

  // Calculate statistics from filtered referrals
  const { specialtyStats, overallStats } = useAdminStatistics(filteredReferrals);

  // Load referrals data
  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const data = await loadDashboardReferrals([]);
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

  // Load data on mount and restore specialty selection
  useEffect(() => {
    loadReferrals();
    
    // Restore specialty selection from localStorage
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    if (storedSpecialty && specialties.includes(storedSpecialty)) {
      setCurrentSpecialty(storedSpecialty);
    }
  }, []);

  const handleSpecialtySelect = (specialty: string) => {
    setCurrentSpecialty(specialty);
    localStorage.setItem('selectedSpecialty', specialty);
  };

  const handleShowAll = () => {
    setCurrentSpecialty(null);
    localStorage.removeItem('selectedSpecialty');
  };

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Data has been updated',
    });
  };

  const handleReturnToSpecialtySelection = () => {
    navigate('/select-specialty');
  };

  // Show loading skeleton
  if (isLoading) {
    return <AdminPageSkeleton onBack={handleReturnToSpecialtySelection} />;
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
              {currentSpecialty 
                ? `Overview of ${currentSpecialty} referrals` 
                : 'Overview of all referrals across specialties'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReturnToSpecialtySelection} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change Specialty
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Specialty Selector */}
        <AdminSpecialtySelector
          specialties={specialties}
          currentSpecialty={currentSpecialty}
          onSpecialtySelect={handleSpecialtySelect}
          onShowAll={handleShowAll}
        />

        {/* Tabs */}
        <EnhancedTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-3">
            <div className="w-full max-w-2xl">
              <EnhancedTabsList variant="grid" size="md">
                <EnhancedTabsTrigger value="overview" variant="grid" size="md">
                  Overview
                </EnhancedTabsTrigger>
                <EnhancedTabsTrigger 
                  value="allocation" 
                  variant="grid" 
                  size="md"
                  disabled={!currentSpecialty}
                >
                  Allocation {currentSpecialty ? `(${currentSpecialty})` : '(Select Specialty)'}
                </EnhancedTabsTrigger>
              </EnhancedTabsList>
            </div>
          </div>

          <EnhancedTabsContent value="overview" className="space-y-6">
            <OverallStatsCards stats={overallStats} />
            <SpecialtyBreakdown 
              specialtyStats={specialtyStats} 
              currentSpecialty={currentSpecialty} 
            />
          </EnhancedTabsContent>

          <EnhancedTabsContent value="allocation">
            {currentSpecialty ? (
              <AllocationView 
                specialty={currentSpecialty} 
                referrals={filteredReferrals.filter(r => r.specialty === currentSpecialty)} 
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Please select a specialty to view allocation details.
                </p>
              </div>
            )}
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </div>
  );
};

export default AdminPage;
