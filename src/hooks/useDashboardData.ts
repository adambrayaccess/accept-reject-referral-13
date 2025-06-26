
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { reorderReferrals } from '@/services/referral/referralReorderService';
import { useToast } from '@/components/ui/use-toast';
import { useDashboardFilters } from './dashboard/useDashboardFilters';
import { useDashboardSorting } from './dashboard/useDashboardSorting';
import { loadDashboardReferrals, updateReferralDisplayOrder } from '../services/dashboard/dashboardDataService';

export const useDashboardData = (selectedSpecialties: string[] = []) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    applyFilters,
    hasActiveFilters
  } = useDashboardFilters();

  const {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    applySorting
  } = useDashboardSorting();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await loadDashboardReferrals(selectedSpecialties);
      setReferrals(data);
      setFilteredReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referrals. Please try again.',
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

  useEffect(() => {
    filterAndSortReferrals();
  }, [searchTerm, statusFilter, priorityFilter, sortField, sortDirection, referrals]);

  const filterAndSortReferrals = () => {
    let filtered = applyFilters(referrals);
    filtered = applySorting(filtered, hasActiveFilters);
    setFilteredReferrals(filtered);
  };

  const handleReorderReferrals = async (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex || isReordering) return;

    setIsReordering(true);

    // Store original state for potential revert
    const originalFilteredReferrals = [...filteredReferrals];
    const originalReferrals = [...referrals];

    // Optimistic update
    const currentReferrals = [...filteredReferrals];
    const [movedItem] = currentReferrals.splice(sourceIndex, 1);
    currentReferrals.splice(destinationIndex, 0, movedItem);
    
    // Update UI immediately
    setFilteredReferrals(currentReferrals);

    try {
      const response = await reorderReferrals(
        filteredReferrals,
        sourceIndex,
        destinationIndex,
        {
          specialty: selectedSpecialties.length === 1 ? selectedSpecialties[0] : undefined,
          filter: statusFilter !== 'all' ? statusFilter : undefined,
          sortField
        }
      );

      if (response.success) {
        const updatedReferrals = updateReferralDisplayOrder(referrals, currentReferrals);
        setReferrals(updatedReferrals);
        
        console.log(`Successfully reordered: moved "${movedItem.patient.name}" from position ${sourceIndex} to ${destinationIndex}`);
        
        toast({
          title: "Order Updated",
          description: `Moved "${movedItem.patient.name}" to new position`,
        });
      } else {
        // Revert on failure
        setFilteredReferrals(originalFilteredReferrals);
        setReferrals(originalReferrals);
        toast({
          title: "Reorder Failed",
          description: response.error || "Failed to update referral order",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert on error
      setFilteredReferrals(originalFilteredReferrals);
      setReferrals(originalReferrals);
      console.error('Error reordering referrals:', error);
      toast({
        title: "Reorder Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Referral list has been updated',
    });
  };

  return {
    referrals,
    filteredReferrals,
    isLoading,
    isReordering,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    handleRefresh,
    handleReorderReferrals,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  };
};
