
import { useState } from 'react';
import { Referral } from '@/types/referral';

export const useWaitingListSelection = () => {
  const [selectedReferrals, setSelectedReferrals] = useState<Referral[]>([]);

  const toggleReferralSelection = (referral: Referral) => {
    setSelectedReferrals(prev => {
      const isSelected = prev.some(r => r.id === referral.id);
      if (isSelected) {
        return prev.filter(r => r.id !== referral.id);
      } else {
        return [...prev, referral];
      }
    });
  };

  const clearSelection = () => {
    setSelectedReferrals([]);
  };

  const selectAll = (referrals: Referral[]) => {
    setSelectedReferrals(referrals);
  };

  return {
    selectedReferrals,
    toggleReferralSelection,
    clearSelection,
    selectAll
  };
};
