
import { useState, useMemo } from 'react';
import { Referral } from '@/types/referral';

export const useReferralSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (referralId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(referralId)) {
        newSet.delete(referralId);
      } else {
        newSet.add(referralId);
      }
      return newSet;
    });
  };

  const selectAll = (referrals: Referral[]) => {
    setSelectedIds(new Set(referrals.map(r => r.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (referralId: string) => {
    return selectedIds.has(referralId);
  };

  const getSelectedReferrals = (referrals: Referral[]) => {
    return referrals.filter(r => selectedIds.has(r.id));
  };

  const isAllSelected = (referrals: Referral[]) => {
    return referrals.length > 0 && referrals.every(r => selectedIds.has(r.id));
  };

  const isIndeterminate = (referrals: Referral[]) => {
    const selectedCount = referrals.filter(r => selectedIds.has(r.id)).length;
    return selectedCount > 0 && selectedCount < referrals.length;
  };

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedReferrals,
    isAllSelected,
    isIndeterminate
  };
};
