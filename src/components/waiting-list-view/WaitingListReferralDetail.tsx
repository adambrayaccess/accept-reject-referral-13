import { Referral } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Badge } from '@/components/ui/badge';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import WaitingListRTTPathwayTabContent from './WaitingListRTTPathwayTabContent';
import PatientTabContent from '@/components/referral-detail/PatientTabContent';
import ClinicalTabContent from '@/components/referral-detail/ClinicalTabContent';
import ReferrerTabContent from '@/components/referral-detail/ReferrerTabContent';

interface WaitingListReferralDetailProps {
  referral: Referral;
  relatedReferrals: {
    serviceTotal: number;
    activeTotal: number;
    activeSpecialties: string[];
  };
}

const WaitingListReferralDetail = ({ referral, relatedReferrals }: WaitingListReferralDetailProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
          <CardTitle className="text-lg">Referral Details</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <ReferralPriorityBadge priority={referral.priority} size="sm" />
            <Badge variant="outline" className="text-xs">
              {`Ref: ${referral.id}`}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              {`UBRN: ${referral.ubrn}`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <EnhancedTabs defaultValue="rtt-pathway">
          <div className="mb-3">
            <EnhancedTabsList variant="grid" size="md">
              <EnhancedTabsTrigger value="rtt-pathway" variant="grid" size="md">
                RTT/Pathway
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="patient" variant="grid" size="md">
                Patient
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="clinical" variant="grid" size="md">
                Clinical
              </EnhancedTabsTrigger>
              <EnhancedTabsTrigger value="referrer" variant="grid" size="md">
                Referrer
              </EnhancedTabsTrigger>
            </EnhancedTabsList>
          </div>
          
          <EnhancedTabsContent value="rtt-pathway" className="space-y-3">
            <WaitingListRTTPathwayTabContent referral={referral} />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="patient" className="space-y-3">
            <PatientTabContent referral={referral} relatedReferrals={relatedReferrals} />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="clinical" className="space-y-3">
            <ClinicalTabContent referral={referral} />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="referrer" className="space-y-3">
            <ReferrerTabContent referral={referral} />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </CardContent>
    </Card>
  );
};

export default WaitingListReferralDetail;