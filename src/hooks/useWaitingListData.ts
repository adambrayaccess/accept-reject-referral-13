
import { useState, useEffect, useMemo } from 'react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { useWaitingListFilters } from './waitingList/useWaitingListFilters';
import { useWaitingListSorting } from './waitingList/useWaitingListSorting';
import { useReferralSelection } from './useReferralSelection';
import { loadWaitingListReferrals } from '../services/waitingList/waitingListDataService';

export const useWaitingListData = (selectedSpecialties: string[] = []) => {
  const [allReferrals, setAllReferrals] = useState<Referral[]>([]);
  const [orderedReferrals, setOrderedReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();
  
  const { filters, updateFilters, clearFilters, applyFilters } = useWaitingListFilters();
  const { sortField, setSortField, sortDirection, setSortDirection, applySorting } = useWaitingListSorting();
  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedReferrals,
    isAllSelected,
    isIndeterminate
  } = useReferralSelection();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const processedData = await loadWaitingListReferrals(selectedSpecialties, filters.includeDischarged);
      console.log('Loaded referrals with display order:', processedData.map(r => ({ id: r.id, name: r.patient.name, displayOrder: (r as any).displayOrder })));
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
  }, [selectedSpecialties, filters.includeDischarged]);

  // Filter and sort referrals
  const filteredAndSortedReferrals = useMemo(() => {
    let filtered = applyFilters(orderedReferrals);
    
    // Only apply sorting if not using display order (preserve manual ordering)
    if (sortField !== 'displayOrder') {
      filtered = applySorting(filtered);
    }
    
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
    console.log('Updating referrals order in state');
    setIsReordering(true);
    
    // Update the ordered referrals state with the new order
    setOrderedReferrals(reorderedReferrals);
    
    // Update display order in the all referrals data
    const updatedReferrals = reorderedReferrals.map((ref, index) => ({
      ...ref,
      displayOrder: index
    }));
    
    setAllReferrals(prev => {
      const updated = [...prev];
      updatedReferrals.forEach(updatedRef => {
        const index = updated.findIndex(r => r.id === updatedRef.id);
        if (index !== -1) {
          updated[index] = updatedRef;
        }
      });
      return updated;
    });
    
    // Reset reordering state
    setTimeout(() => setIsReordering(false), 500);
  };

  const toggleReferralSelection = (referral: Referral) => {
    toggleSelection(referral.id);
  };

  const handleSelectAll = () => {
    selectAll(filteredAndSortedReferrals);
  };

  const selectedReferrals = getSelectedReferrals(filteredAndSortedReferrals);

  return {
    referrals: filteredAndSortedReferrals,
    isLoading,
    isReordering,
    filters,
    updateFilters,
    clearFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    selectedReferrals,
    selectedCount,
    toggleReferralSelection,
    clearSelection,
    selectAll: handleSelectAll,
    isAllSelected: isAllSelected(filteredAndSortedReferrals),
    isIndeterminate: isIndeterminate(filteredAndSortedReferrals),
    handleRefresh,
    reorderReferrals
  };
};
