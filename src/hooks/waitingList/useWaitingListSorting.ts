
import { useState } from 'react';
import { Referral } from '@/types/referral';

export const useWaitingListSorting = () => {
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const applySorting = (referrals: Referral[]): Referral[] => {
    return [...referrals].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'patient':
          aValue = a.patient.name.toLowerCase();
          bValue = b.patient.name.toLowerCase();
          break;
        case 'age':
          aValue = a.calculatedPatientAge || 0;
          bValue = b.calculatedPatientAge || 0;
          break;
        case 'priority':
          const priorityOrder = { 'emergency': 3, 'urgent': 2, 'routine': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'daysWaiting':
          aValue = a.calculatedReferralAge || 0;
          bValue = b.calculatedReferralAge || 0;
          break;
        case 'location':
          aValue = a.calculatedLocation?.toLowerCase() || '';
          bValue = b.calculatedLocation?.toLowerCase() || '';
          break;
        case 'referrer':
          aValue = a.referrer.name.toLowerCase();
          bValue = b.referrer.name.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.created).getTime();
          bValue = new Date(b.created).getTime();
          break;
        case 'appointmentStatus':
          const statusOrder = { 'cancelled': 4, 'scheduled': 3, 'confirmed': 2, 'completed': 1 };
          aValue = statusOrder[a.appointmentDetails?.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.appointmentDetails?.status as keyof typeof statusOrder] || 0;
          break;
        case 'rttTargetDate':
          aValue = a.rttPathway ? new Date(a.rttPathway.targetDate).getTime() : 0;
          bValue = b.rttPathway ? new Date(b.rttPathway.targetDate).getTime() : 0;
          break;
        case 'rttBreachRisk':
          const riskOrder = { 'breached': 4, 'high': 3, 'medium': 2, 'low': 1 };
          aValue = riskOrder[a.rttPathway?.breachRisk as keyof typeof riskOrder] || 0;
          bValue = riskOrder[b.rttPathway?.breachRisk as keyof typeof riskOrder] || 0;
          break;
        case 'rttDaysRemaining':
          aValue = a.rttPathway?.daysRemaining || 0;
          bValue = b.rttPathway?.daysRemaining || 0;
          break;
        default:
          aValue = new Date(a.created).getTime();
          bValue = new Date(b.created).getTime();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    applySorting
  };
};
