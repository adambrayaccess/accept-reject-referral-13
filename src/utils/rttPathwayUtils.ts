
import { differenceInDays, addDays, format } from 'date-fns';
import { RTTPathway, RTTBreachRisk } from '@/types/referral';

export const calculateRTTPathway = (clockStartDate: string): RTTPathway => {
  const clockStart = new Date(clockStartDate);
  const today = new Date();
  const targetDate = addDays(clockStart, 126); // 18 weeks = 126 days
  const daysElapsed = differenceInDays(today, clockStart);
  const daysRemaining = 126 - daysElapsed;
  
  let breachRisk: RTTBreachRisk;
  if (daysRemaining < 0) {
    breachRisk = 'breached';
  } else if (daysRemaining <= 14) {
    breachRisk = 'high';
  } else if (daysRemaining <= 28) {
    breachRisk = 'medium';
  } else {
    breachRisk = 'low';
  }

  return {
    clockStart: clockStartDate,
    targetDate: targetDate.toISOString(),
    status: daysRemaining < 0 ? 'incomplete' : 'incomplete',
    daysRemaining: Math.max(0, daysRemaining),
    breachRisk
  };
};

export const formatTargetDate = (targetDate: string): string => {
  return format(new Date(targetDate), 'dd MMM yyyy');
};

export const getRTTStatusColor = (breachRisk: RTTBreachRisk): string => {
  switch (breachRisk) {
    case 'breached':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const formatRTTStatus = (breachRisk: RTTBreachRisk, daysRemaining: number): string => {
  if (breachRisk === 'breached') {
    const daysOverdue = Math.abs(daysRemaining - 126);
    return `Breached (${daysOverdue}d over)`;
  }
  return `${daysRemaining}d remaining`;
};
