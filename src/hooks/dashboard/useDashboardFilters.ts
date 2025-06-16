
import { useState, useMemo } from 'react';
import { Referral } from '@/types/referral';

export interface DashboardFilters {
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
}

export const useDashboardFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const applyFilters = useMemo(() => {
    return (referrals: Referral[]): Referral[] => {
      let filtered = [...referrals];

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(ref => {
          if (['new', 'accepted', 'rejected', 'refer-to-another-specialty'].includes(statusFilter)) {
            return ref.status === statusFilter;
          }
          else if (ref.triageStatus) {
            return ref.triageStatus === statusFilter;
          }
          return false;
        });
      }

      // Apply priority filter
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(ref => ref.priority === priorityFilter);
      }

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          ref =>
            ref.patient.name.toLowerCase().includes(term) ||
            ref.patient.nhsNumber.toLowerCase().includes(term) ||
            ref.ubrn.toLowerCase().includes(term) ||
            ref.id.toLowerCase().includes(term)
        );
      }

      return filtered;
    };
  }, [searchTerm, statusFilter, priorityFilter]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    applyFilters,
    hasActiveFilters
  };
};
