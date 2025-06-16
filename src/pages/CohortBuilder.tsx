
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import CohortBuilderHeader from '@/components/cohort/CohortBuilderHeader';
import WaitingListTab from '@/components/cohort/WaitingListTab';
import WaitingListStatsTab from '@/components/cohort/WaitingListStatsTab';
import TaggedPatientsTab from '@/components/cohort/TaggedPatientsTab';
import { useCohortData } from '@/hooks/useCohortData';
import { useWaitingListData } from '@/hooks/useWaitingListData';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';

const CohortBuilder = () => {
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Cohort builder data (for tagged tab)
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

  // Waiting list data (for waiting list and stats tabs)
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

        <EnhancedTabs defaultValue="waitingList" className="w-full">
          <EnhancedTabsList variant="grid" size="md">
            <EnhancedTabsTrigger value="waitingList" variant="grid" size="md">
              Waiting List
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="stats" variant="grid" size="md">
              Stats & Reports
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="tagged" variant="grid" size="md">
              Tagged Patients
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          
          <EnhancedTabsContent value="waitingList" className="space-y-6">
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
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="stats" className="space-y-6">
            <WaitingListStatsTab
              referrals={waitingListReferrals}
              isLoading={waitingListLoading}
            />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="tagged">
            <TaggedPatientsTab
              referrals={cohortReferrals}
              isLoading={cohortLoading}
              selectedReferrals={cohortSelected}
              toggleReferralSelection={toggleCohortSelection}
            />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </div>
  );
};

export default CohortBuilder;
