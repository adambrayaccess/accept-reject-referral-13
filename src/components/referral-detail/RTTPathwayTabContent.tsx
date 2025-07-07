
import { Referral } from '@/types/referral';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar, AlertTriangle, CheckCircle, Target, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import RTTPathwayBadge from '@/components/cohort/RTTPathwayBadge';
import CarePathwayBadge from '@/components/cohort/CarePathwayBadge';
import { calculateRTTPathway } from '@/utils/rttPathwayUtils';

interface RTTPathwayTabContentProps {
  referral: Referral;
}

const RTTPathwayTabContent = ({ referral }: RTTPathwayTabContentProps) => {
  // Calculate RTT pathway if not present
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  
  // Override pathway status if referral is discharged
  const finalRttPathway = referral.status === 'discharged' 
    ? { ...rttPathway, status: 'complete' }
    : rttPathway;
  
  // Mock waiting list allocation data (in a real app, this would come from the API)
  const waitingListAllocation = referral.triageStatus === 'waiting-list' ? {
    consultant: 'Dr. Sarah Mitchell',
    clinic: 'Outpatient Clinic 3A',
    estimatedWaitTime: '8-12 weeks',
    position: 23,
    totalWaiting: 156
  } : null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'discontinued':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* RTT Pathway Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">RTT Pathway (18 Week Target)</h4>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <div className="text-xs font-medium text-muted-foreground">Clock Start Date</div>
            <div className="font-medium">{formatDate(rttPathway.clockStart)}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground">Target Date</div>
            <div className="font-medium">{formatDate(rttPathway.targetDate)}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground">Days Remaining</div>
            <div className="font-medium">
              {referral.status === 'discharged' ? (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-muted-foreground bg-muted/30">
                  <span>N/A</span>
                </div>
              ) : (
                <RTTPathwayBadge 
                  breachRisk={rttPathway.breachRisk} 
                  daysRemaining={rttPathway.daysRemaining}
                  variant="compact"
                />
              )}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground">Pathway Status</div>
            <div className="flex items-center gap-2">
              {getStatusIcon(finalRttPathway.status)}
              <span className="font-medium capitalize">{finalRttPathway.status}</span>
            </div>
          </div>
        </div>

        {rttPathway.pauseHistory && rttPathway.pauseHistory.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-xs font-medium text-yellow-800 mb-2">Pathway Pause History</div>
            <div className="space-y-1">
              {rttPathway.pauseHistory.map((pause, index) => (
                <div key={index} className="text-xs text-yellow-700">
                  <span className="font-medium">{formatDate(pause.startDate)}</span>
                  {pause.endDate && <span> - {formatDate(pause.endDate)}</span>}
                  <span className="ml-2">({pause.reason})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Care Pathway Section */}
      {referral.carePathway && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Care Pathway</h4>
            </div>
            
            <CarePathwayBadge carePathway={referral.carePathway} />
          </div>
          
          <Separator />
        </>
      )}

      {/* Waiting List Allocation Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Waiting List Allocation</h4>
        </div>
        
        {waitingListAllocation ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Assigned Consultant</div>
                <div className="font-medium">{waitingListAllocation.consultant}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Clinic Location</div>
                <div className="font-medium">{waitingListAllocation.clinic}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Estimated Wait Time</div>
                <div className="font-medium">{waitingListAllocation.estimatedWaitTime}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground">Queue Position</div>
                <div className="font-medium">
                  {waitingListAllocation.position} of {waitingListAllocation.totalWaiting}
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-blue-800 mb-1">Waiting List Status</div>
              <div className="text-xs text-blue-700">
                Patient is currently on the waiting list for {referral.specialty}. 
                Appointment scheduling will begin approximately {waitingListAllocation.estimatedWaitTime} from referral date.
              </div>
            </div>
          </>
        ) : referral.status === 'discharged' ? (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <div className="text-sm text-muted-foreground">
              Discharged from Waiting List
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <div className="text-sm text-muted-foreground">
              Awaiting Waiting List allocation
            </div>
          </div>
        )}
      </div>

      {/* Triage Status */}
      {referral.triageStatus && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Triage Status</h4>
            </div>
            
            <div>
              <Badge variant="outline" className="capitalize">
                {referral.triageStatus.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RTTPathwayTabContent;
