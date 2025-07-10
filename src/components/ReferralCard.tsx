import { Referral } from '@/types/referral';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Phone, User, Building, CircleDot, ExternalLink, LayoutList, Tag } from 'lucide-react';
import TriageStatusBadge from '@/components/triage/TriageStatusBadge';
import { format, differenceInYears } from 'date-fns';
import { Link } from 'react-router-dom';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import ReferralTypeBadge from '@/components/dashboard/ReferralTypeBadge';
import ReferralSourceBadge from '@/components/dashboard/ReferralSourceBadge';
import PinButton from '@/components/ui/pin-button';
import { usePinning } from '@/hooks/usePinning';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ClinicalTagsPopover from '@/components/referral-tagging/ClinicalTagsPopover';
import SubReferralsListTable from '@/components/sub-referrals/SubReferralsListTable';
import ParentReferralInfoTable from '@/components/sub-referrals/ParentReferralInfoTable';
import PatientDetailsPopover from '@/components/PatientDetailsPopover';
import { getTagStyle } from '@/utils/tagCategoryUtils';
interface ReferralCardProps {
  referral: Referral;
  onTagsUpdated?: () => void;
}

// Helper functions for status display
const getStatusText = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'Pre-Assess';
      case 'assessed':
        return 'Assessed';
      case 'waiting-list':
        return 'Waiting List';
      case 'refer-to-another-specialty':
        return 'Refer on';
      default:
        return referral.triageStatus;
    }
  }
  switch (referral.status) {
    case 'new':
      return 'New';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    default:
      return referral.status.charAt(0).toUpperCase() + referral.status.slice(1);
  }
};
const getDotColor = (referral: Referral) => {
  if (referral.status === 'accepted' && referral.triageStatus) {
    switch (referral.triageStatus) {
      case 'pre-assessment':
        return 'text-blue-800';
      case 'assessed':
        return 'text-green-800';
      case 'waiting-list':
        return 'text-purple-800';
      case 'refer-to-another-specialty':
        return 'text-orange-800';
      case 'discharged':
        return 'text-gray-800';
      default:
        return 'text-gray-800';
    }
  }
  switch (referral.status) {
    case 'new':
      return 'text-blue-800';
    case 'accepted':
      return 'text-green-800';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-800';
  }
};
const ReferralCard = ({
  referral,
  onTagsUpdated = () => {}
}: ReferralCardProps) => {
  const formattedDate = format(new Date(referral.created), 'dd MMM yyyy');
  const formattedTime = format(new Date(referral.created), 'HH:mm');
  const patientAge = differenceInYears(new Date(), new Date(referral.patient.birthDate));
  const tags = referral.tags || [];
  const {
    isPinned,
    togglePin
  } = usePinning();

  // Debug logs for sub-referral data
  console.log('ReferralCard Debug:', {
    referralId: referral.id,
    isSubReferral: referral.isSubReferral,
    parentReferralId: referral.parentReferralId,
    childReferralIds: referral.childReferralIds,
    hasChildReferrals: referral.childReferralIds && referral.childReferralIds.length > 0,
    showAccordion: referral.isSubReferral || referral.childReferralIds && referral.childReferralIds.length > 0
  });

  // Clinical Tags Component
  const ClinicalTagsButton = () => {
    return <HoverCard>
        <HoverCardTrigger asChild>
          <div>
            <ClinicalTagsPopover referral={referral} onTagsUpdated={onTagsUpdated} />
          </div>
        </HoverCardTrigger>
        {tags.length > 0 && <HoverCardContent className="w-80 p-4" side="bottom">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Clinical Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => <Badge key={tag} variant="outline" className={`text-xs ${getTagStyle(tag)}`}>
                    {tag}
                  </Badge>)}
              </div>
            </div>
          </HoverCardContent>}
      </HoverCard>;
  };
  return <Card className="hover:border-primary hover:shadow-md transition-all self-start">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              <PatientDetailsPopover patient={referral.patient}>
                <CardTitle className="text-lg mb-1 cursor-pointer hover:text-primary transition-colors">
                  {referral.patient.name}
                </CardTitle>
              </PatientDetailsPopover>
              <div className="text-sm text-muted-foreground mb-3">
                NHS No: {referral.patient.nhsNumber}
              </div>
              <div className="text-sm mt-4">
                <div>
                  <div className="font-bold text-muted-foreground">Gender</div>
                  <div>{referral.patient.gender || "Not specified"}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <PinButton isPinned={isPinned(referral.id)} onTogglePin={() => togglePin(referral.id)} size="sm" variant="ghost" />
                <div>
                  <ReferralPriorityBadge priority={referral.priority} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Specialty</div>
                <div className="font-bold text-primary">{referral.specialty}</div>
              </div>
            </div>
          </div>
          
          {/* Emphasized Key Fields */}
          <div className="grid grid-cols-1 gap-3 p-3 rounded-md bg-zinc-50">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reason for Referral</div>
              <div className="text-sm font-medium">{referral.clinicalInfo.reason}</div>
            </div>
          </div>
            <div className="h-4" />
          <div className="grid grid-cols-1 gap-2 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Referrer</div>
                <div className="text-sm font-medium">{referral.referrer.name}</div>
                <div className="text-xs text-black">{referral.referrer.organization}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Source</div>
                <ReferralSourceBadge referral={referral} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Referral Type</div>
              <div className="text-sm font-medium">{referral.referralType || 'External Referral'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">UBRN</div>
              <div className="text-sm font-medium font-mono truncate" title={referral.ubrn}>{referral.ubrn}</div>
            </div>
            
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Triage Status</div>
              <TriageStatusBadge status={referral.triageStatus} />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Referral Date</div>
              <div className="text-sm font-medium">{formattedDate} at {formattedTime}</div>
            </div>
          </div>

          {/* View Full Referral Details and Tags */}
          <div className="mt-4 pt-3 border-t flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/referral/${referral.id}`}>
                <FileText className="h-4 w-4" />
                Open Referral
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <ClinicalTagsButton />
          </div>
          
          {/* Sub-Referral Accordion */}
          {(referral.isSubReferral || referral.childReferralIds && referral.childReferralIds.length > 0) && <div className="mt-3 -mx-4 -mb-2" onClick={e => e.stopPropagation()}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-referrals" className="border-0 border-t">
                  <AccordionTrigger className="px-4 py-2 text-sm font-bold text-muted-foreground hover:no-underline uppercase tracking-wide" onClick={e => e.stopPropagation()}>
                     <div className="flex items-center gap-2" style={{
                color: '#79264D'
              }}>
                      <LayoutList className="h-4 w-4" />
                      {referral.isSubReferral ? 'Parent Referral' : `Sub-Referrals (${referral.childReferralIds?.length || 0})`}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0" onClick={e => e.stopPropagation()}>
                     {referral.isSubReferral ? (/* Sub-Referral: Show Parent Referral Details */
              <ParentReferralInfoTable childReferralId={referral.id} />) : (/* Parent Referral: Show Sub-Referrals */
              <SubReferralsListTable parentReferralId={referral.id} />)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>}
        </CardContent>
      </Card>;
};
export default ReferralCard;