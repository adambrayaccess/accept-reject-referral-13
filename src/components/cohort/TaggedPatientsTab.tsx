
import CohortGrid from './CohortGrid';
import TaggedPatientsStatistics from './TaggedPatientsStatistics';
import TagInsightsDashboard from './TagInsightsDashboard';
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
      {/* Debug info card - remove this after testing */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-sm space-y-1">
            <p><strong>Debug Info:</strong></p>
            <p>Total referrals loaded: {referrals.length}</p>
            <p>Tagged referrals found: {taggedReferrals.length}</p>
            <p>Sample tags: {JSON.stringify(referrals.slice(0, 3).map(r => r.tags))}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tag-specific statistics */}
      <TaggedPatientsStatistics referrals={taggedReferrals} />
      
      {/* Tag insights dashboard */}
      {taggedReferrals.length > 0 && (
        <TagInsightsDashboard referrals={taggedReferrals} />
      )}
      
      {/* Tagged patients grid */}
      {taggedReferrals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tagged Patients ({taggedReferrals.length})</span>
              <span className="text-sm font-normal text-muted-foreground">
                {selectedReferrals.length} selected
              </span>
            </CardTitle>
          </CardHeader>
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
