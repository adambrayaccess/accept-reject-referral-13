
import { useState } from 'react';
import { Referral } from '@/types/referral';

export const useWaitingListSorting = () => {
  const [sortField, setSortField] = useState<string>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const applySorting = (referrals: Referral[]): Referral[] => {
    const sorted = [...referrals];

    sorted.sort((a, b) => {
      let valueA = sortField.includes('.') 
        ? sortField.split('.').reduce((obj, key) => obj[key], a)
        : a[sortField];
      let valueB = sortField.includes('.')
        ? sortField.split('.').reduce((obj, key) => obj[key], b)
        : b[sortField];

      // Handle priority sorting specially
      if (sortField === 'priority') {
        const priorityOrder = { emergency: 3, urgent: 2, routine: 1 };
        valueA = priorityOrder[valueA] || 0;
        valueB = priorityOrder[valueB] || 0;
      }

      // Handle care pathway sorting
      if (sortField === 'carePathway.name') {
        valueA = a.carePathway?.name || '';
        valueB = b.carePathway?.name || '';
      }

      // Handle care pathway status sorting
      if (sortField === 'carePathway.status') {
        const statusOrder = { active: 4, paused: 3, completed: 2, discontinued: 1 };
        valueA = statusOrder[a.carePathway?.status] || 0;
        valueB = statusOrder[b.carePathway?.status] || 0;
      }

      // Handle care pathway priority sorting
      if (sortField === 'carePathway.priority') {
        const priorityOrder = { emergency: 3, urgent: 2, routine: 1 };
        valueA = priorityOrder[a.carePathway?.priority] || 0;
        valueB = priorityOrder[b.carePathway?.priority] || 0;
      }

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  return {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    applySorting
  };
};
