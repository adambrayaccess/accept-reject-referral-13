
import CohortGrid from './CohortGrid';
import TaggedPatientsStatistics from './TaggedPatientsStatistics';
import TagInsightsDashboard from './TagInsightsDashboard';
import TaggedPatientsSelectionControls from './TaggedPatientsSelectionControls';
import AICopilotActionsPanel from '@/components/ai-copilot/AICopilotActionsPanel';
import { Referral } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaggedPatientsTabProps {
  referrals: Referral[];
  isLoading: boolean;
  selectedReferrals: Referral[];
  toggleReferralSelection: (referral: Referral) => void;
}

const TaggedPatientsTab = ({
  referrals,
  isLoading,
  selectedReferrals,
  toggleReferralSelection
}: TaggedPatientsTabProps) => {
  // Filter referrals that have tags (either tags array with length > 0 or non-empty tags)
  const taggedReferrals = referrals.filter(ref => {
    const hasTags = ref.tags && Array.isArray(ref.tags) && ref.tags.length > 0;
    console.log(`Referral ${ref.id}: tags = ${JSON.stringify(ref.tags)}, hasTags = ${hasTags}`);
    return hasTags;
  });

  console.log(`Tagged Patients Tab - Total referrals: ${referrals.length}, Tagged referrals: ${taggedReferrals.length}`);
  console.log('Sample referral data:', referrals.slice(0, 2).map(ref => ({
    id: ref.id,
    patient: ref.patient.name,
    tags: ref.tags,
    specialty: ref.specialty
  })));

  // Selection handlers
  const handleSelectAll = () => {
    taggedReferrals.forEach(referral => {
      if (!selectedReferrals.some(r => r.id === referral.id)) {
        toggleReferralSelection(referral);
      }
    });
  };

  const handleClearSelection = () => {
    selectedReferrals.forEach(referral => {
      if (taggedReferrals.some(r => r.id === referral.id)) {
        toggleReferralSelection(referral);
      }
    });
  };

  const isAllSelected = taggedReferrals.length > 0 && 
    taggedReferrals.every(referral => selectedReferrals.some(r => r.id === referral.id));

  const isIndeterminate = selectedReferrals.some(referral => 
    taggedReferrals.some(r => r.id === referral.id)
  ) && !isAllSelected;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 rounded-lg border border-border bg-card animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-lg border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tag-specific statistics */}
      <TaggedPatientsStatistics referrals={taggedReferrals} />
      
      {/* Tag insights dashboard */}
      {taggedReferrals.length > 0 && (
        <TagInsightsDashboard referrals={taggedReferrals} />
      )}
      
      {/* AI Copilot Actions Panel - always shown */}
      <AICopilotActionsPanel
        selectedReferrals={selectedReferrals.filter(ref => 
          taggedReferrals.some(tagged => tagged.id === ref.id)
        )}
        onSuggestionApplied={() => {
          // Trigger a refresh or update as needed
          console.log('AI Copilot action applied, refreshing data...');
        }}
      />
      
      {/* Tagged patients grid */}
      {taggedReferrals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tagged Patients ({taggedReferrals.length})</span>
              <span className="text-sm font-normal text-muted-foreground">
                {selectedReferrals.filter(ref => 
                  taggedReferrals.some(tagged => tagged.id === ref.id)
                ).length} selected
              </span>
            </CardTitle>
          </CardHeader>
          
          {/* Selection controls */}
          <TaggedPatientsSelectionControls
            taggedReferrals={taggedReferrals}
            selectedReferrals={selectedReferrals.filter(ref => 
              taggedReferrals.some(tagged => tagged.id === ref.id)
            )}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
          
          <CardContent className="p-0">
            <CohortGrid 
              referrals={taggedReferrals}
              isLoading={false}
              selectedReferrals={selectedReferrals}
              onSelectReferral={toggleReferralSelection}
              showTagsOnly
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tagged patients found in the current selection.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tags can be added to patients from the Waiting List tab.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaggedPatientsTab;
