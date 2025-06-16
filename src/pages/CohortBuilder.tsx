
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CohortBuilderHeader from '@/components/cohort/CohortBuilderHeader';
import WaitingListTab from '@/components/cohort/WaitingListTab';
import CohortBuilderTab from '@/components/cohort/CohortBuilderTab';
import TaggedPatientsTab from '@/components/cohort/TaggedPatientsTab';
import { useCohortData } from '@/hooks/useCohortData';
import { useWaitingListData } from '@/hooks/useWaitingListData';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const CohortBuilder = () => {
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Cohort builder data (for cohort builder and tagged tabs)
  const {
    cohortReferrals,
    isLoading: cohortLoading,
    filters,
    setFilters,
    handleRefresh: refreshCohort,
    selectedReferrals: cohortSelected,
    toggleReferralSelection: toggleCohortSelection,
    clearSelection: clearCohortSelection,
    selectAll: selectAllCohort,
  } = useCohortData(currentSpecialty);

  // Waiting list data (for waiting list tab)
  const {
    referrals: waitingListReferrals,
    isLoading: waitingListLoading,
    filters: waitingListFilters,
    updateFilters: updateWaitingListFilters,
    clearFilters: clearWaitingListFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    selectedReferrals: waitingListSelected,
    toggleReferralSelection: toggleWaitingListSelection,
    clearSelection: clearWaitingListSelection,
    selectAll: selectAllWaitingList,
    handleRefresh: refreshWaitingList,
    reorderReferrals
  } = useWaitingListData(currentSpecialty);

  useEffect(() => {
    // Check if specialty is selected
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    if (storedSpecialty) {
      setCurrentSpecialty(storedSpecialty);
    } else {
      // Redirect to specialty selection if none selected
      navigate('/select-specialty');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
        <CohortBuilderHeader 
          currentSpecialty={currentSpecialty}
          onBack={handleBack}
        />

        <Tabs defaultValue="waitingList" className="w-full">
          <TabsList>
            <TabsTrigger value="waitingList">Waiting List</TabsTrigger>
            <TabsTrigger value="cohortBuilder">Waiting List Management</TabsTrigger>
            <TabsTrigger value="tagged">Tagged Patients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="waitingList" className="space-y-6">
            <WaitingListTab
              referrals={waitingListReferrals}
              isLoading={waitingListLoading}
              filters={waitingListFilters}
              updateFilters={updateWaitingListFilters}
              clearFilters={clearWaitingListFilters}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              selectedReferrals={waitingListSelected}
              toggleReferralSelection={toggleWaitingListSelection}
              clearSelection={clearWaitingListSelection}
              selectAll={selectAllWaitingList}
              handleRefresh={refreshWaitingList}
              reorderReferrals={reorderReferrals}
            />
          </TabsContent>
          
          <TabsContent value="cohortBuilder" className="space-y-4">
            <CohortBuilderTab
              referrals={cohortReferrals}
              isLoading={cohortLoading}
              filters={filters}
              setFilters={setFilters}
              selectedReferrals={cohortSelected}
              toggleReferralSelection={toggleCohortSelection}
              clearSelection={clearCohortSelection}
              selectAll={selectAllCohort}
              handleRefresh={refreshCohort}
            />
          </TabsContent>
          
          <TabsContent value="tagged">
            <TaggedPatientsTab
              referrals={cohortReferrals}
              isLoading={cohortLoading}
              selectedReferrals={cohortSelected}
              toggleReferralSelection={toggleCohortSelection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CohortBuilder;
