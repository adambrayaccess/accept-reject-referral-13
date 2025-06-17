
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';
import OverallStatsCards from '@/components/admin/OverallStatsCards';
import SpecialtyBreakdown from '@/components/admin/SpecialtyBreakdown';
import AdminSpecialtySelector from '@/components/admin/AdminSpecialtySelector';
import AllocationView from '@/components/allocation/AllocationView';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const AdminPage = () => {
  console.log('AdminPage: Component starting to render');
  
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log('AdminPage: State initialized', { currentSpecialty, activeTab });
  
  const navigate = useNavigate();
  console.log('AdminPage: useNavigate hook initialized');
  
  // Move hooks outside of try/catch to prevent render issues
  const { referrals, isLoading, handleRefresh } = useDashboardData(currentSpecialty ? [currentSpecialty] : []);
  const { specialtyStats, overallStats } = useAdminStatistics(referrals || []);

  console.log('AdminPage: Hooks called', { 
    referralsCount: referrals?.length, 
    isLoading,
    specialtyStatsCount: specialtyStats?.length,
    overallStats 
  });

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

  // Load specialty from localStorage only once on mount
  useEffect(() => {
    console.log('AdminPage: useEffect running - loading from localStorage');
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    console.log('AdminPage: Stored specialty from localStorage:', storedSpecialty);
    if (storedSpecialty && !currentSpecialty) {
      setCurrentSpecialty(storedSpecialty);
    }
  }, []); // Empty dependency array to run only once

  const handleSpecialtySelect = (specialty: string) => {
    console.log('AdminPage: Specialty selected:', specialty);
    setCurrentSpecialty(specialty);
    localStorage.setItem('selectedSpecialty', specialty);
  };

  const handleShowAll = () => {
    console.log('AdminPage: Show all selected');
    setCurrentSpecialty(null);
    localStorage.removeItem('selectedSpecialty');
  };

  const handleReturnToSpecialtySelection = () => {
    console.log('AdminPage: Returning to specialty selection');
    navigate('/select-specialty');
  };

  // Show loading state
  if (isLoading) {
    console.log('AdminPage: Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50">
        <Titlebar />
        <PageHeader showSearch={false} />
        <div className="px-6 py-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="h-96 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an issue with data
  if (!referrals) {
    console.log('AdminPage: No referrals data available');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Admin Page</h1>
          <p className="text-gray-600 mb-4">Unable to load referrals data</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  console.log('AdminPage: Rendering main content');
  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
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

        <AdminSpecialtySelector
          specialties={specialties}
          currentSpecialty={currentSpecialty}
          onSpecialtySelect={handleSpecialtySelect}
          onShowAll={handleShowAll}
        />

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
                referrals={referrals.filter(r => r.specialty === currentSpecialty)} 
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Please select a specialty to view allocation details.</p>
              </div>
            )}
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </div>
  );
};

export default AdminPage;
