
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import CohortFilters from '@/components/cohort/CohortFilters';
import CohortGrid from '@/components/cohort/CohortGrid';
import { useCohortData } from '@/hooks/useCohortData';
import TagManager from '@/components/cohort/TagManager';

const CohortBuilder = () => {
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    cohortReferrals,
    isLoading,
    filters,
    setFilters,
    handleRefresh,
    selectedReferrals,
    toggleReferralSelection,
    clearSelection,
    selectAll,
  } = useCohortData(currentSpecialty);

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
        <div>
          <Button variant="outline" onClick={handleRefresh} className="ml-2">
            Refresh Cohort
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Patient Cohort Builder</h1>
        {currentSpecialty && (
          <p className="text-muted-foreground">
            Managing waiting list for: <span className="font-medium text-foreground">{currentSpecialty}</span>
          </p>
        )}
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList>
          <TabsTrigger value="builder">Build Cohort</TabsTrigger>
          <TabsTrigger value="tagged">Tagged Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-4">
          <CohortFilters filters={filters} setFilters={setFilters} />
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">{cohortReferrals.length} patients in cohort</span>
              {selectedReferrals.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({selectedReferrals.length} selected)
                </span>
              )}
            </div>
            
            <div className="space-x-2">
              {selectedReferrals.length > 0 ? (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => selectAll(cohortReferrals)}>
                  Select All
                </Button>
              )}
            </div>
          </div>
          
          {selectedReferrals.length > 0 && (
            <TagManager selectedReferrals={selectedReferrals} onTagged={clearSelection} />
          )}
          
          <CohortGrid 
            referrals={cohortReferrals}
            isLoading={isLoading}
            selectedReferrals={selectedReferrals}
            onSelectReferral={toggleReferralSelection}
          />
        </TabsContent>
        
        <TabsContent value="tagged">
          <CohortGrid 
            referrals={cohortReferrals.filter(ref => ref.tags && ref.tags.length > 0)}
            isLoading={isLoading}
            selectedReferrals={selectedReferrals}
            onSelectReferral={toggleReferralSelection}
            showTagsOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CohortBuilder;
