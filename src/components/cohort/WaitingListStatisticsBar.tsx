
import { Users, Clock, Calendar, AlertTriangle, Target, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Referral } from '@/types/referral';

interface WaitingListStatisticsBarProps {
  referrals: Referral[];
}

const WaitingListStatisticsBar = ({ referrals }: WaitingListStatisticsBarProps) => {
  // Calculate statistics
  const totalReferrals = referrals.length;
  
  const referralAges = referrals.map(ref => ref.calculatedReferralAge || 0);
  const highestDaysWaiting = referralAges.length > 0 ? Math.max(...referralAges) : 0;
  
  // Count referrals with scheduled/confirmed appointments
  const appointmentsScheduled = referrals.filter(ref => 
    ref.appointmentDetails && 
    ['scheduled', 'confirmed'].includes(ref.appointmentDetails.status)
  ).length;
  
  // Count referrals awaiting appointment (no appointment data or cancelled)
  const awaitingAppointment = referrals.filter(ref => 
    !ref.appointmentDetails || 
    ref.appointmentDetails.status === 'cancelled' ||
    ref.triageStatus === 'waiting-list'
  ).length;
  
  // RTT Pathway statistics
  const rttBreaches = referrals.filter(ref => 
    ref.rttPathway?.breachRisk === 'breached'
  ).length;

  const rttHighRisk = referrals.filter(ref => 
    ref.rttPathway?.breachRisk === 'high'
  ).length;

  const statistics = [
    {
      title: 'Total Referrals',
      value: totalReferrals.toString(),
      period: 'Currently in waiting list',
      icon: Users,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary'
    },
    {
      title: 'RTT Breaches',
      value: rttBreaches.toString(),
      period: 'Over 18 weeks',
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive'
    },
    {
      title: 'High RTT Risk',
      value: rttHighRisk.toString(),
      period: 'Within 2 weeks of breach',
      icon: Timer,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning'
    },
    {
      title: 'Appointments Scheduled',
      value: appointmentsScheduled.toString(),
      period: 'Confirmed or scheduled',
      icon: Calendar,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      valueColor: 'text-success'
    },
    {
      title: 'Awaiting Appointment',
      value: awaitingAppointment.toString(),  
      period: 'Ready for scheduling',
      icon: Clock,
      iconColor: 'text-purple',
      iconBg: 'bg-purple/10',
      valueColor: 'text-purple'
    },
    {
      title: 'Longest Wait Time',
      value: `${highestDaysWaiting} days`,
      period: 'Maximum duration',
      icon: Target,
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted',
      valueColor: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statistics.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-border shadow-none bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-card-foreground">{stat.title}</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <span className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                <span>{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WaitingListStatisticsBar;
