
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
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { referrals, isLoading, handleRefresh } = useDashboardData(currentSpecialty);
  const navigate = useNavigate();
  const { specialtyStats, overallStats } = useAdminStatistics(referrals);

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

  useEffect(() => {
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    if (storedSpecialty) {
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

  const handleReturnToSpecialtySelection = () => {
    navigate('/select-specialty');
  };

  if (isLoading) {
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
          <EnhancedTabsList variant="default" size="md" className="grid w-full grid-cols-2">
            <EnhancedTabsTrigger value="overview" variant="default" size="md">
              Overview
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger 
              value="allocation" 
              variant="default" 
              size="md"
              disabled={!currentSpecialty}
            >
              Allocation {currentSpecialty ? `(${currentSpecialty})` : '(Select Specialty)'}
            </EnhancedTabsTrigger>
          </EnhancedTabsList>

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
