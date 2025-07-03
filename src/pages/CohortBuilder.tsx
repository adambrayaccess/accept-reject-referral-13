
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import CohortBuilderHeader from '@/components/cohort/CohortBuilderHeader';
import WaitingListTab from '@/components/cohort/WaitingListTab';
import WaitingListStatsTab from '@/components/cohort/WaitingListStatsTab';
import TaggedPatientsTab from '@/components/cohort/TaggedPatientsTab';
import { useWaitingListData } from '@/hooks/useWaitingListData';
import PageHeader from '@/components/PageHeader';

const CohortBuilder = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Use waiting list data for all tabs (including tagged patients)
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
    selectedCount,
    toggleReferralSelection: toggleWaitingListSelection,
    clearSelection: clearWaitingListSelection,
    selectAll: selectAllWaitingList,
    isAllSelected,
    isIndeterminate,
    handleRefresh: refreshWaitingList,
    reorderReferrals
  } = useWaitingListData(selectedSpecialties);

  useEffect(() => {
    // Check if specialties are selected
    const storedSpecialties = localStorage.getItem('selectedSpecialties');
    if (storedSpecialties) {
      try {
        const parsed = JSON.parse(storedSpecialties);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedSpecialties(parsed);
        } else {
          navigate('/select-specialty');
        }
      } catch {
        navigate('/select-specialty');
      }
    } else {
      // Redirect to specialty selection if none selected
      navigate('/select-specialty');
    }
  }, [navigate]);

  const handleSpecialtyChange = (newSpecialties: string[]) => {
    setSelectedSpecialties(newSpecialties);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader showSearch={false} />
      
      <div className="px-6 py-6 space-y-6">
        <CohortBuilderHeader 
          selectedSpecialties={selectedSpecialties}
          onSpecialtyChange={handleSpecialtyChange}
        />

        <EnhancedTabs defaultValue="waitingList" className="w-full">
          <div className="flex justify-center mb-3">
            <div className="w-full max-w-2xl">
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
            </div>
          </div>
          
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
              selectedCount={selectedCount}
              toggleReferralSelection={toggleWaitingListSelection}
              clearSelection={clearWaitingListSelection}
              selectAll={selectAllWaitingList}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              handleRefresh={refreshWaitingList}
              reorderReferrals={reorderReferrals}
              selectedSpecialties={selectedSpecialties}
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
              referrals={waitingListReferrals}
              isLoading={waitingListLoading}
              selectedReferrals={waitingListSelected}
              toggleReferralSelection={toggleWaitingListSelection}
            />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </div>
  );
};

export default CohortBuilder;
