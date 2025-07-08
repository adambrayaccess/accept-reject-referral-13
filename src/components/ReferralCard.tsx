import { Referral } from '@/types/referral';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ReferralPriorityBadge from '@/components/dashboard/ReferralPriorityBadge';
import ReferralTypeBadge from '@/components/dashboard/ReferralTypeBadge';
import ReferralStatusBadge from '@/components/dashboard/ReferralStatusBadge';
import PinButton from '@/components/ui/pin-button';
import { usePinning } from '@/hooks/usePinning';
import SubReferralIndicator from '@/components/cohort/SubReferralIndicator';

interface ReferralCardProps {
  referral: Referral;
}


const ReferralCard = ({ referral }: ReferralCardProps) => {
  const formattedDate = format(new Date(referral.created), 'dd MMM yyyy');
  const formattedTime = format(new Date(referral.created), 'HH:mm');
  const { isPinned, togglePin } = usePinning();

  return (
    <Link to={`/referral/${referral.id}`}>
      <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{referral.patient.name}</CardTitle>
            <div className="flex items-center gap-2">
              <PinButton
                isPinned={isPinned(referral.id)}
                onTogglePin={() => togglePin(referral.id)}
                size="sm"
                variant="ghost"
              />
              <ReferralStatusBadge referral={referral} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <span>NHS:</span>
              <span className="font-mono">{referral.patient.nhsNumber}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <span>UBRN:</span>
              <span className="font-mono">{referral.ubrn}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <div className="info-label">Specialty</div>
              <div className="info-value">{referral.specialty}</div>
            </div>
            
            <div>
              <div className="info-label">Referrer</div>
              <div className="info-value">{referral.referrer.name}</div>
              <div className="text-xs text-muted-foreground">{referral.referrer.organization}</div>
            </div>
            
            <div className="flex items-center gap-2 text-sm mt-1">
              <ReferralPriorityBadge priority={referral.priority} size="sm" />
              <ReferralTypeBadge referral={referral} size="sm" />
              
              {referral.attachments.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{referral.attachments.length}</span>
                </Badge>
              )}
            </div>
            
            <div className="mt-2">
              <SubReferralIndicator referral={referral} variant="compact" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs font-bold text-muted-foreground border-t border-white" style={{ verticalAlign: 'bottom' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ReferralCard;
