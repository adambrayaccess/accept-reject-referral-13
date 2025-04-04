
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SearchBar from './dashboard/SearchBar';
import FilterBar from './dashboard/FilterBar';
import ReferralGrid from './dashboard/ReferralGrid';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const {
    filteredReferrals,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    specialtyFilter,
    setSpecialtyFilter,
    specialties,
    handleRefresh,
    referrals
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Referral Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          specialtyFilter={specialtyFilter}
          setSpecialtyFilter={setSpecialtyFilter}
          specialties={specialties}
        />
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
    </div>
  );
};

export default Dashboard;
