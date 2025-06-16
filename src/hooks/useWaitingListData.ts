
import { useState, useEffect, useMemo } from 'react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { useWaitingListFilters } from './waitingList/useWaitingListFilters';
import { useWaitingListSorting } from './waitingList/useWaitingListSorting';
import { useWaitingListSelection } from './waitingList/useWaitingListSelection';
import { loadWaitingListReferrals } from '../services/waitingList/waitingListDataService';

export const useWaitingListData = (selectedSpecialties: string[] = []) => {
  const [allReferrals, setAllReferrals] = useState<Referral[]>([]);
  const [orderedReferrals, setOrderedReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { filters, updateFilters, clearFilters, applyFilters } = useWaitingListFilters();
  const { sortField, setSortField, sortDirection, setSortDirection, applySorting } = useWaitingListSorting();
  const { selectedReferrals, toggleReferralSelection, clearSelection, selectAll } = useWaitingListSelection();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const processedData = await loadWaitingListReferrals(selectedSpecialties);
      setAllReferrals(processedData);
      setOrderedReferrals(processedData);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load waiting list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
    
    // Listen for referral updates to refresh data
    const handleReferralUpdate = () => {
      loadReferrals();
    };
    
    window.addEventListener('referralUpdated', handleReferralUpdate);
    
    return () => {
      window.removeEventListener('referralUpdated', handleReferralUpdate);
    };
  }, [selectedSpecialties]);

  // Filter and sort referrals
  const filteredAndSortedReferrals = useMemo(() => {
    let filtered = applyFilters(orderedReferrals);
    filtered = applySorting(filtered);
    return filtered;
  }, [orderedReferrals, filters, sortField, sortDirection]);

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Waiting list has been updated',
    });
  };

  const reorderReferrals = (reorderedReferrals: Referral[]) => {
    setOrderedReferrals(reorderedReferrals);
    toast({
      title: 'Order Updated',
      description: 'Waiting list order has been updated',
    });
  };

  return {
    referrals: filteredAndSortedReferrals,
    isLoading,
    filters,
    updateFilters,
    clearFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    selectedReferrals,
    toggleReferralSelection,
    clearSelection,
    selectAll,
    handleRefresh,
    reorderReferrals
  };
};
