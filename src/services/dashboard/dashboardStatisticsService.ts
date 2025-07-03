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

  return [
    {
      title: 'New Referrals',
      value: newReferrals.toString().padStart(2, '0'),
      period: 'Last 7 days',
      pagination: '1/3',
      icon: 'Users',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
      valueColor: 'text-teal-600'
    },
    {
      title: 'Urgent Referrals',
      value: urgentReferrals.toString().padStart(2, '0'),
      period: 'Last 7 days',
      pagination: '1/3',
      icon: 'AlertTriangle',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      valueColor: 'text-red-600'
    },
    {
      title: 'Waiting To Be Reviewed',
      value: waitingToReview.toString().padStart(2, '0'),
      period: 'Current',
      pagination: '1/3',
      icon: 'Clock',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Ready For Discharge',
      value: readyForDischarge.toString().padStart(2, '0'),
      period: 'Current',
      pagination: '1/3',
      icon: 'CheckCircle',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      valueColor: 'text-orange-600'
    },
    {
      title: 'No. Of Appointments',
      value: upcomingAppointments.toString().padStart(2, '0'),
      period: 'Next 7 days',
      pagination: '1/3',
      icon: 'FileText',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      valueColor: 'text-blue-600'
    }
  ];
};