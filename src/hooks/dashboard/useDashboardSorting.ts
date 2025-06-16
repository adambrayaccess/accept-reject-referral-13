
import { useState, useMemo } from 'react';
import { Referral } from '@/types/referral';

export const useDashboardSorting = () => {
  const [sortField, setSortField] = useState<string>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const applySorting = useMemo(() => {
    return (referrals: Referral[], hasActiveFilters: boolean): Referral[] => {
      const sorted = [...referrals];

      // Apply sorting - but preserve display order when no explicit sort is set
      if (sortField !== 'created' || hasActiveFilters) {
        // Only apply custom sorting when filters are active or sort field is changed
        sorted.sort((a, b) => {
          let valueA = sortField.includes('.') 
            ? sortField.split('.').reduce((obj, key) => obj[key], a)
            : a[sortField];
          let valueB = sortField.includes('.')
            ? sortField.split('.').reduce((obj, key) => obj[key], b)
            : b[sortField];

          if (typeof valueA === 'string') valueA = valueA.toLowerCase();
          if (typeof valueB === 'string') valueB = valueB.toLowerCase();

          if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
          if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      } else {
        // Maintain display order when no filters or custom sorting
        sorted.sort((a, b) => {
          const aOrder = (a as any).displayOrder;
          const bOrder = (b as any).displayOrder;
          
          if (aOrder !== undefined && bOrder !== undefined) {
            return aOrder - bOrder;
          }
          
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        });
      }

      return sorted;
    };
  }, [sortField, sortDirection]);

  return {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    applySorting
  };
};
