import { Referral } from '@/types/referral';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Phone, User, Building, CircleDot } from 'lucide-react';
import { format, differenceInYears } from 'date-fns';
import { Link } from 'react-router-dom';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import ReferralTypeBadge from '@/components/dashboard/ReferralTypeBadge';
import ReferralSourceBadge from '@/components/dashboard/ReferralSourceBadge';
import PinButton from '@/components/ui/pin-button';
import { usePinning } from '@/hooks/usePinning';
import SubReferralIndicator from '@/components/cohort/SubReferralIndicator';

interface ReferralCardProps {
  referral: Referral;
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
        return 'text-yellow-600';
      case 'assessed':
        return 'text-purple-600';
      case 'waiting-list':
        return 'text-blue-600';
      case 'refer-to-another-specialty':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  }

  switch (referral.status) {
    case 'new':
      return 'text-blue-600';
    case 'accepted':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

const ReferralCard = ({ referral }: ReferralCardProps) => {
  const formattedDate = format(new Date(referral.created), 'dd MMM yyyy');
  const formattedTime = format(new Date(referral.created), 'HH:mm');
  const patientAge = differenceInYears(new Date(), new Date(referral.patient.birthDate));
  const { isPinned, togglePin } = usePinning();

  return (
    <Link to={`/referral/${referral.id}`}>
      <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{referral.patient.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span><span className="font-bold">Gender</span> {referral.patient.gender}</span>
                <span>•</span>
                <span><span className="font-bold">Date of Birth</span> ({new Date().getFullYear() - new Date(referral.patient.birth_date).getFullYear()} years)</span> 
                <span>•</span>
                <span><span className="font-bold">No.</span> {referral.patient.nhsNumber}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PinButton
                isPinned={isPinned(referral.id)}
                onTogglePin={() => togglePin(referral.id)}
                size="sm"
                variant="ghost"
              />
              <div className="flex items-center gap-1">
                <CircleDot 
                  className={`h-3 w-3 ${getDotColor(referral)} fill-current`}
                />
                <span className="text-xs font-bold text-muted-foreground">
                  {getStatusText(referral).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Emphasized Key Fields */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-md">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Specialty</div>
              <div className="font-bold text-sm text-primary">{referral.specialty}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority</div>
              <div><ReferralPriorityBadge priority={referral.priority} size="sm" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 mt-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reason for Referral</div>
              <div className="text-sm font-medium text-foreground line-clamp-2">{referral.clinicalInfo.reason}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Referrer</div>
                <div className="text-sm font-medium">{referral.referrer.name}</div>
                <div className="text-xs text-muted-foreground">{referral.referrer.organization}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</div>
                <ReferralSourceBadge referral={referral} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">NHS</div>
              <div className="text-sm font-medium font-mono">{referral.patient.nhsNumber}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">UBRN</div>
              <div className="text-sm font-medium font-mono truncate" title={referral.ubrn}>{referral.ubrn}</div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone</div>
              <div className="text-sm font-medium">{referral.patient.phone || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</div>
              <div className="text-sm font-medium">{formattedDate} at {formattedTime}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <ReferralTypeBadge referral={referral} size="sm" />
              {referral.attachments.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  <span>{referral.attachments.length}</span>
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            <SubReferralIndicator referral={referral} variant="compact" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReferralCard;
