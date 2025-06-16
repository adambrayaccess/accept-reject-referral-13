import { Button } from '@/components/ui/button';
import { Users, Shield, ChevronDown } from 'lucide-react';
import SearchBar from './dashboard/SearchBar';
import SortAndFilterControls from './dashboard/SortAndFilterControls';
import ViewToggle from './dashboard/ViewToggle';
import ReferralGrid from './dashboard/ReferralGrid';
import StatisticsBar from './dashboard/StatisticsBar';
import Titlebar from './Titlebar';
import PageHeader from './PageHeader';
import AIAssistantActions from './dashboard/AIAssistantActions';
import CreateReferralDropdown from './dashboard/CreateReferralDropdown';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { useNavigate } from 'react-router-dom';
import { specialties } from '@/data/specialtyOptions';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';

const Dashboard = () => {
  const [view, setView] = useState<'card' | 'list'>('card');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  
  // Pass the currentSpecialty to the useDashboardData hook
  const {
    filteredReferrals,
    isLoading,
    isReordering,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    handleRefresh,
    handleReorderReferrals,
    referrals,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  } = useDashboardData(currentSpecialty);

  useEffect(() => {
    // Check if specialty is selected
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    if (storedSpecialty) {
      setCurrentSpecialty(storedSpecialty);
    } else {
      // Redirect to specialty selection if none selected
      navigate('/select-specialty');
    }
  }, []);

  const handleCreateReferral = (newReferral: Partial<Referral>) => {
    const referralType = newReferral.aiGenerated ? 'Auto' : 'Manual';
    toast({
      title: "Referral Created",
      description: `${referralType} referral ${newReferral.id} has been created`,
    });
    handleRefresh();
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    if (specialty) {
      setCurrentSpecialty(specialty.name);
      localStorage.setItem('selectedSpecialty', specialty.name);
      toast({
        title: "Specialty Changed",
        description: `Now triaging for ${specialty.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="space-y-6">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Referral Dashboard</h1>
              {currentSpecialty && (
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground mr-2">Triaging for:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 font-medium text-foreground hover:text-foreground/80 flex items-center gap-1"
                      >
                        {currentSpecialty}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {specialties.map((specialty) => (
                        <DropdownMenuItem
                          key={specialty.id}
                          onClick={() => handleSpecialtyChange(specialty.id)}
                          className={currentSpecialty === specialty.name ? "bg-accent" : ""}
                        >
                          {specialty.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <CreateReferralDropdown onReferralCreated={handleCreateReferral} />
            </div>
          </div>
        </div>

        <div className="px-6">
          <StatisticsBar />
        </div>

        <div className="px-6 space-y-6">
          <div className="flex flex-col gap-4">
            {/* Three-column layout: SearchBar | AIAssistantActions | SortAndFilterControls + ViewToggle */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Left column - SearchBar */}
              <div className="w-full lg:flex-1">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              
              {/* Middle column - AIAssistantActions */}
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <AIAssistantActions />
              </div>
              
              {/* Right column - SortAndFilterControls + ViewToggle */}
              <div className="flex gap-2 w-full lg:w-auto items-center lg:flex-shrink-0">
                <SortAndFilterControls
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>
          </div>

          <EnhancedTabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-3">
              <div className="w-full max-w-2xl">
                <EnhancedTabsList variant="grid" size="md">
                  <EnhancedTabsTrigger value="all" variant="grid" size="md">All Referrals</EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="new" variant="grid" size="md">Pending ({referrals.filter(r => r.status === 'new').length})</EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="processed" variant="grid" size="md">Processed ({referrals.filter(r => r.status !== 'new').length})</EnhancedTabsTrigger>
                </EnhancedTabsList>
              </div>
            </div>

            <EnhancedTabsContent value="all">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                view={view} 
                onReorder={handleReorderReferrals}
              />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="new">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                filter={(r) => r.status === 'new'}
                view={view}
                onReorder={handleReorderReferrals}
              />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="processed">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                filter={(r) => r.status !== 'new'}
                view={view}
                onReorder={handleReorderReferrals}
              />
            </EnhancedTabsContent>
          </EnhancedTabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
