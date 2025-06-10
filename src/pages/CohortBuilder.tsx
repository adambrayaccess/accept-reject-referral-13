
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import CohortFilters from '@/components/cohort/CohortFilters';
import CohortGrid from '@/components/cohort/CohortGrid';
import WaitingListTable from '@/components/cohort/WaitingListTable';
import WaitingListControls from '@/components/cohort/WaitingListControls';
import WaitingListCharts from '@/components/cohort/WaitingListCharts';
import { useCohortData } from '@/hooks/useCohortData';
import { useWaitingListData } from '@/hooks/useWaitingListData';
import TagManager from '@/components/cohort/TagManager';

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
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={handleBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Waiting List Manager</h1>
        {currentSpecialty && (
          <p className="text-muted-foreground">
            Managing waiting list for: <span className="font-medium text-foreground">{currentSpecialty}</span>
          </p>
        )}
      </div>

      <Tabs defaultValue="waitingList" className="w-full">
        <TabsList>
          <TabsTrigger value="waitingList">Waiting List</TabsTrigger>
          <TabsTrigger value="cohortBuilder">Waiting List Management</TabsTrigger>
          <TabsTrigger value="tagged">Tagged Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="waitingList" className="space-y-6">
          <WaitingListCharts referrals={waitingListReferrals} />
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">{waitingListReferrals.length} patients on waiting list</span>
              {waitingListSelected.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({waitingListSelected.length} selected)
                </span>
              )}
            </div>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={refreshWaitingList} className="ml-2">
                Refresh List
              </Button>
              {waitingListSelected.length > 0 ? (
                <Button variant="outline" size="sm" onClick={clearWaitingListSelection}>
                  Clear Selection
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => selectAllWaitingList(waitingListReferrals)}>
                  Select All
                </Button>
              )}
            </div>
          </div>

          <WaitingListControls
            searchTerm={waitingListFilters.search}
            onSearchChange={(value) => updateWaitingListFilters({ search: value })}
            sortField={sortField}
            onSortFieldChange={setSortField}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            priorityFilter={waitingListFilters.priority}
            onPriorityFilterChange={(priority) => updateWaitingListFilters({ priority })}
            locationFilter={waitingListFilters.location}
            onLocationFilterChange={(location) => updateWaitingListFilters({ location })}
            ageFilter={waitingListFilters.ageRange}
            onAgeFilterChange={(ageRange) => updateWaitingListFilters({ ageRange })}
            onClearFilters={clearWaitingListFilters}
          />
          
          {waitingListSelected.length > 0 && (
            <TagManager selectedReferrals={waitingListSelected} onTagged={clearWaitingListSelection} />
          )}
          
          <WaitingListTable 
            referrals={waitingListReferrals}
            isLoading={waitingListLoading}
            selectedReferrals={waitingListSelected}
            onSelectReferral={toggleWaitingListSelection}
            onReorderReferrals={reorderReferrals}
          />
        </TabsContent>
        
        <TabsContent value="cohortBuilder" className="space-y-4">
          <CohortFilters filters={filters} setFilters={setFilters} />
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">{cohortReferrals.length} patients in cohort</span>
              {cohortSelected.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({cohortSelected.length} selected)
                </span>
              )}
            </div>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={refreshCohort} className="ml-2">
                Refresh List
              </Button>
              {cohortSelected.length > 0 ? (
                <Button variant="outline" size="sm" onClick={clearCohortSelection}>
                  Clear Selection
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => selectAllCohort(cohortReferrals)}>
                  Select All
                </Button>
              )}
            </div>
          </div>
          
          {cohortSelected.length > 0 && (
            <TagManager selectedReferrals={cohortSelected} onTagged={clearCohortSelection} />
          )}
          
          <CohortGrid 
            referrals={cohortReferrals}
            isLoading={cohortLoading}
            selectedReferrals={cohortSelected}
            onSelectReferral={toggleCohortSelection}
          />
        </TabsContent>
        
        <TabsContent value="tagged">
          <CohortGrid 
            referrals={cohortReferrals.filter(ref => ref.tags && ref.tags.length > 0)}
            isLoading={cohortLoading}
            selectedReferrals={cohortSelected}
            onSelectReferral={toggleCohortSelection}
            showTagsOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CohortBuilder;
