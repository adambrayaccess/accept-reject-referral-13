import React from 'react';
import { Referral } from '@/types/referral';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, AlertTriangle, CheckCircle, Target, MapPin, ExternalLink, FileText, Timer } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import RTTPathwayBadge from '@/components/cohort/RTTPathwayBadge';
import CarePathwayBadge from '@/components/cohort/CarePathwayBadge';
import { calculateRTTPathway } from '@/utils/rttPathwayUtils';
import { createOrUpdateRTTPathway } from '@/services/pathwayService';

interface WaitingListRTTPathwayTabContentProps {
  referral: Referral;
}

const WaitingListRTTPathwayTabContent = ({ referral }: WaitingListRTTPathwayTabContentProps) => {
  const navigate = useNavigate();
  // Check if referral is discharged
  const isDischarged = referral.status === 'discharged';
  
  // Use database pathway if available, otherwise calculate it and create it
  const rttPathway = referral.rttPathway || calculateRTTPathway(referral.created);
  
  // Debug logging to check what we're actually getting
  console.log('=== RTT Pathway Debug ===');
  console.log('Raw referral.rttPathway:', referral.rttPathway);
  console.log('Clock start:', rttPathway.clockStart);
  console.log('Target date:', rttPathway.targetDate);
  console.log('Days remaining:', rttPathway.daysRemaining);
  console.log('Breach risk:', rttPathway.breachRisk);
  console.log('========================');
  
  // If no database pathway exists, create one in the background
  React.useEffect(() => {
    if (!referral.rttPathway) {
      createOrUpdateRTTPathway(referral.id, referral.created);
    }
  }, [referral.id, referral.created, referral.rttPathway]);
  
  // Mock waiting list allocation data (in a real app, this would come from the API)
  const waitingListAllocation = isDischarged ? null : (referral.triageStatus === 'waiting-list' ? {
    consultant: 'Dr. Sarah Mitchell',
    clinic: 'Outpatient Clinic 3A',
    estimatedWaitTime: '8-12 weeks',
    position: 23,
    totalWaiting: 156
  } : null);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const getStatusIcon = (status: string) => {
    if (isDischarged) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
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
              {isDischarged ? (
                <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">
                  N/A
                </Badge>
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
              {getStatusIcon(isDischarged ? 'completed' : rttPathway.status)}
              <span className="font-medium capitalize">{isDischarged ? 'Complete' : rttPathway.status}</span>
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
          
        </>
      )}

      {/* Waiting List Allocation Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Waiting List Allocation</h4>
        </div>
        
        {isDischarged ? (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <div className="text-xs font-medium text-muted-foreground mb-1">Waiting List Status</div>
            <div className="text-sm text-muted-foreground">
              Discharged from Waiting List
            </div>
          </div>
        ) : waitingListAllocation ? (
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
        ) : (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <div className="text-sm text-muted-foreground">
              Awaiting Waiting List allocation
            </div>
          </div>
        )}
      </div>

      {/* View Referral Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Referral Details</h4>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/referral/${referral.id}`)}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 font-medium"
        >
          <ExternalLink className="w-3 h-3" />
          View Referral
        </Button>
      </div>
    </div>
  );
};

export default WaitingListRTTPathwayTabContent;
