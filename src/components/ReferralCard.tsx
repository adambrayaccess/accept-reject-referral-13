
import { Referral } from '@/types/referral';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ReferralCardProps {
  referral: Referral;
}

const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getPriorityLabel = (priority: Referral['priority']) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getStatusClass = (status: Referral['status']) => {
  return `status-${status}`;
};

const ReferralCard = ({ referral }: ReferralCardProps) => {
  const formattedDate = format(new Date(referral.created), 'dd MMM yyyy');
  const formattedTime = format(new Date(referral.created), 'HH:mm');

  return (
    <Link to={`/referral/${referral.id}`}>
      <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{referral.patient.name}</CardTitle>
            <span className={getStatusClass(referral.status)}>
              {referral.status.toUpperCase()}
            </span>
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
              <Badge variant={getPriorityVariant(referral.priority)}>
                {getPriorityLabel(referral.priority)}
              </Badge>
              
              {referral.attachments.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{referral.attachments.length}</span>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs font-bold text-muted-foreground border-t justify-center">
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
