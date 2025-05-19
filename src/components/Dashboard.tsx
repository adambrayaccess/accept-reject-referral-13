
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FilePlus, RefreshCw } from 'lucide-react';
import SearchBar from './dashboard/SearchBar';
import FilterBar from './dashboard/FilterBar';
import SortControls from './dashboard/SortControls';
import ReferralGrid from './dashboard/ReferralGrid';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useState, useEffect } from 'react';
import CreateReferralModal from './CreateReferralModal';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  
  // Pass the currentSpecialty to the useDashboardData hook
  const {
    filteredReferrals,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    handleRefresh,
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
    toast({
      title: "Referral Created",
      description: `Manual referral ${newReferral.id} has been created`,
    });
    handleRefresh();
  };

  const handleChangeSpecialty = () => {
    navigate('/select-specialty');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Referral Dashboard</h1>
          {currentSpecialty && (
            <div className="flex items-center mt-1">
              <span className="text-sm text-muted-foreground mr-2">
                Triaging for: <span className="font-medium text-foreground">{currentSpecialty}</span>
              </span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleChangeSpecialty}>
                Change
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="flex-1 sm:flex-initial">
            <FilePlus className="mr-2 h-4 w-4" />
            Create Referral
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="flex-1 sm:flex-initial">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:flex-1">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
          <SortControls
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All Referrals</TabsTrigger>
          <TabsTrigger value="new">Pending ({referrals.filter(r => r.status === 'new').length})</TabsTrigger>
          <TabsTrigger value="processed">Processed ({referrals.filter(r => r.status !== 'new').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ReferralGrid referrals={filteredReferrals} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="new">
          <ReferralGrid 
            referrals={filteredReferrals} 
            isLoading={isLoading} 
            filter={(r) => r.status === 'new'} 
          />
        </TabsContent>

        <TabsContent value="processed">
          <ReferralGrid 
            referrals={filteredReferrals} 
            isLoading={isLoading} 
            filter={(r) => r.status !== 'new'} 
          />
        </TabsContent>
      </Tabs>

      <CreateReferralModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReferral}
      />
    </div>
  );
};

export default Dashboard;
