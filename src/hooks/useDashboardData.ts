
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { referralService } from '@/services/supabase/referralService';
import { toast } from 'sonner';

export const useDashboardData = (selectedSpecialties: string[] = []) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await referralService.getAll();
      
      // Filter by selected specialties if any are selected
      const filtered = selectedSpecialties.length > 0 
        ? data.filter(ref => selectedSpecialties.includes(ref.specialty))
        : data;
      
      setReferrals(filtered);
      setFilteredReferrals(filtered);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
  }, [selectedSpecialties]);

  const handleRefresh = () => {
    loadReferrals();
    toast.success('Referral list has been updated');
  };

  const handleReorderReferrals = async (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex || isReordering) return;

    setIsReordering(true);
    
    // Optimistic update
    const newReferrals = [...filteredReferrals];
    const [movedItem] = newReferrals.splice(sourceIndex, 1);
    newReferrals.splice(destinationIndex, 0, movedItem);
    setFilteredReferrals(newReferrals);

    try {
      // Here you would implement the actual reorder logic with Supabase
      console.log(`Reordered referral from ${sourceIndex} to ${destinationIndex}`);
      toast.success(`Moved "${movedItem.patient.name}" to new position`);
    } catch (error) {
      // Revert on error
      setFilteredReferrals(filteredReferrals);
      toast.error('Failed to update referral order');
    } finally {
      setIsReordering(false);
    }
  };

  return {
    referrals,
    filteredReferrals,
    isLoading,
    isReordering,
    handleRefresh,
    handleReorderReferrals
  };
};
