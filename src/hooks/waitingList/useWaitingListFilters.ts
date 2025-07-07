
import { useState } from 'react';
import { Referral } from '@/types/referral';

export interface WaitingListFilters {
  search: string;
  priority: string;
  location: string;
  tags: string[];
  appointmentStatus: string;
  ageRange: { min: number; max: number };
  rttBreachRisk: string;
  rttDaysRange: { min: number; max: number };
  includeDischarged: boolean;
}

export const useWaitingListFilters = () => {
  const [filters, setFilters] = useState<WaitingListFilters>({
    search: '',
    priority: 'all',
    location: '',
    tags: [],
    appointmentStatus: 'all',
    ageRange: { min: 0, max: 365 },
    rttBreachRisk: 'all',
    rttDaysRange: { min: 0, max: 126 },
    includeDischarged: false
  });

  const applyFilters = (referrals: Referral[]): Referral[] => {
    let filtered = [...referrals];

    // Apply search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(ref =>
        ref.patient.name.toLowerCase().includes(term) ||
        ref.patient.nhsNumber.toLowerCase().includes(term) ||
        ref.ubrn.toLowerCase().includes(term)
      );
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(ref => ref.priority === filters.priority);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(ref =>
        ref.calculatedLocation?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(ref =>
        filters.tags.some(tag => ref.tags?.includes(tag))
      );
    }

    // Apply appointment status filter
    if (filters.appointmentStatus !== 'all') {
      filtered = filtered.filter(ref => {
        const age = ref.calculatedReferralAge || 0;
        switch (filters.appointmentStatus) {
          case 'overdue':
            return (ref.triageStatus === 'waiting-list' && age > 60) || 
                   (filters.includeDischarged && ref.status === 'discharged');
          case 'due':
            return (ref.triageStatus === 'waiting-list' && age > 30 && age <= 60) || 
                   (filters.includeDischarged && ref.status === 'discharged');
          case 'scheduled':
            return (ref.triageStatus === 'waiting-list' && age <= 30) || 
                   (filters.includeDischarged && ref.status === 'discharged');
          case 'booked':
            return ref.triageStatus === 'pre-admission-assessment' || 
                   (filters.includeDischarged && ref.status === 'discharged');
          case 'completed':
            return ref.triageStatus === 'assessed' || 
                   (filters.includeDischarged && ref.status === 'discharged');
          default:
            return true;
        }
      });
    }

    // Apply age range filter
    filtered = filtered.filter(ref =>
      (ref.calculatedReferralAge || 0) >= filters.ageRange.min &&
      (ref.calculatedReferralAge || 0) <= filters.ageRange.max
    );

    // Apply RTT breach risk filter
    if (filters.rttBreachRisk !== 'all') {
      filtered = filtered.filter(ref =>
        ref.rttPathway?.breachRisk === filters.rttBreachRisk
      );
    }

    // Apply RTT days range filter
    if (filters.rttDaysRange.min > 0 || filters.rttDaysRange.max < 126) {
      filtered = filtered.filter(ref => {
        const daysRemaining = ref.rttPathway?.daysRemaining || 0;
        return daysRemaining >= filters.rttDaysRange.min && 
               daysRemaining <= filters.rttDaysRange.max;
      });
    }

    return filtered;
  };

  const updateFilters = (newFilters: Partial<WaitingListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priority: 'all',
      location: '',
      tags: [],
      appointmentStatus: 'all',
      ageRange: { min: 0, max: 365 },
      rttBreachRisk: 'all',
      rttDaysRange: { min: 0, max: 126 },
      includeDischarged: false
    });
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    applyFilters
  };
};
