import { Referral } from '@/types/referral';
import { subDays, isAfter, addDays } from 'date-fns';

export interface DashboardStatistic {
  title: string;
  value: string;
  period: string;
  pagination: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  valueColor: string;
}

export const calculateDashboardStatistics = (referrals: Referral[]): DashboardStatistic[] => {
  const now = new Date();
  const last7Days = subDays(now, 7);
  const next7Days = addDays(now, 7);

  // Calculate new referrals in last 7 days
  const newReferrals = referrals.filter(ref => 
    isAfter(new Date(ref.created), last7Days)
  ).length;

  // Calculate urgent referrals (urgent or emergency priority) in last 7 days
  const urgentReferrals = referrals.filter(ref => 
    (ref.priority === 'urgent' || ref.priority === 'emergency') &&
    isAfter(new Date(ref.created), last7Days)
  ).length;

  // Calculate waiting to be reviewed (new status)
  const waitingToReview = referrals.filter(ref => 
    ref.status === 'new'
  ).length;

  // Calculate ready for discharge (accepted status with assessed triage)
  const readyForDischarge = referrals.filter(ref => 
    ref.status === 'accepted' && ref.triageStatus === 'assessed'
  ).length;

  // Calculate upcoming appointments in next 7 days
  const upcomingAppointments = referrals.filter(ref => {
    if (!ref.appointmentDetails?.appointmentDate) return false;
    const appointmentDate = new Date(ref.appointmentDetails.appointmentDate);
    return appointmentDate >= now && appointmentDate <= next7Days;
  }).length;

  // Calculate referrals on waiting list
  const onWaitingList = referrals.filter(ref => 
    ref.triageStatus === 'waiting-list'
  ).length;

  return [
    {
      title: 'New Referrals',
      value: newReferrals.toString().padStart(2, '0'),
      period: 'Last 7 days',
      pagination: '1/3',
      icon: 'Users',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary'
    },
    {
      title: 'Urgent Referrals',
      value: urgentReferrals.toString().padStart(2, '0'),
      period: 'Last 7 days',
      pagination: '1/3',
      icon: 'AlertTriangle',
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive'
    },
    {
      title: 'Waiting To Be Reviewed',
      value: waitingToReview.toString().padStart(2, '0'),
      period: 'Current',
      pagination: '1/3',
      icon: 'Clock',
      iconColor: 'text-purple',
      iconBg: 'bg-purple/10',
      valueColor: 'text-purple'
    },
    {
      title: 'Ready For Discharge',
      value: readyForDischarge.toString().padStart(2, '0'),
      period: 'Current',
      pagination: '1/3',
      icon: 'CheckCircle',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      valueColor: 'text-success'
    },
    {
      title: 'No. Of Appointments',
      value: upcomingAppointments.toString().padStart(2, '0'),
      period: 'Next 7 days',
      pagination: '1/3',
      icon: 'FileText',
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning'
    },
    {
      title: 'On Waiting List',
      value: onWaitingList.toString().padStart(2, '0'),
      period: 'Current',
      pagination: '1/3',
      icon: 'Timer',
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted',
      valueColor: 'text-muted-foreground'
    }
  ];
};