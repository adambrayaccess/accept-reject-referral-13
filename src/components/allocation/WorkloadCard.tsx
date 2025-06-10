
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock } from 'lucide-react';
import { HealthcareProfessional, Referral } from '@/types/referral';
import { differenceInDays } from 'date-fns';

interface WorkloadCardProps {
  professional: HealthcareProfessional;
  allocatedReferrals: Referral[];
  onViewReferrals: (professional: HealthcareProfessional) => void;
}

const WorkloadCard = ({ professional, allocatedReferrals, onViewReferrals }: WorkloadCardProps) => {
  const totalReferrals = allocatedReferrals.length;
  const newReferrals = allocatedReferrals.filter(r => r.status === 'new').length;
  const waitingListReferrals = allocatedReferrals.filter(r => r.triageStatus === 'waiting-list').length;
  
  const averageWaitDays = waitingListReferrals > 0 
    ? Math.round(
        allocatedReferrals
          .filter(r => r.triageStatus === 'waiting-list')
          .reduce((sum, ref) => sum + differenceInDays(new Date(), new Date(ref.created)), 0) / waitingListReferrals
      )
    : 0;

  const getWorkloadColor = () => {
    if (totalReferrals >= 15) return 'bg-red-50 border-red-200';
    if (totalReferrals >= 10) return 'bg-orange-50 border-orange-200';
    if (totalReferrals >= 5) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getWorkloadStatus = () => {
    if (totalReferrals >= 15) return { label: 'High', color: 'bg-red-500' };
    if (totalReferrals >= 10) return { label: 'Medium', color: 'bg-orange-500' };
    if (totalReferrals >= 5) return { label: 'Low', color: 'bg-yellow-500' };
    return { label: 'Minimal', color: 'bg-green-500' };
  };

  const workloadStatus = getWorkloadStatus();

  return (
    <Card className={`transition-all hover:shadow-md ${getWorkloadColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{professional.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{professional.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${workloadStatus.color}`} />
            <span className="text-xs font-medium">{workloadStatus.label}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-lg font-bold text-primary">{totalReferrals}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-lg font-bold text-blue-600">{newReferrals}</div>
            <div className="text-xs text-muted-foreground">New</div>
          </div>
          <div className="text-center p-2 bg-white/60 rounded">
            <div className="text-lg font-bold text-orange-600">{waitingListReferrals}</div>
            <div className="text-xs text-muted-foreground">Waiting</div>
          </div>
        </div>
        
        {waitingListReferrals > 0 && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Avg wait: {averageWaitDays} days</span>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onViewReferrals(professional)}
        >
          <User className="mr-2 h-4 w-4" />
          View Referrals
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkloadCard;
