
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { reorderReferrals } from '@/services/referral/referralReorderService';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardData = (currentSpecialty: string | null = null) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      let data = await fetchReferrals();
      
      // Filter referrals by specialty if one is selected
      if (currentSpecialty) {
        data = data.filter(ref => ref.specialty === currentSpecialty);
      }
      
      // Sort by display order if it exists, otherwise by creation date
      data.sort((a, b) => {
        const aOrder = (a as any).displayOrder;
        const bOrder = (b as any).displayOrder;
        
        if (aOrder !== undefined && bOrder !== undefined) {
          return aOrder - bOrder;
        }
        
        // Fallback to creation date
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
      
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
  }, [currentSpecialty]);

  useEffect(() => {
    filterAndSortReferrals();
  }, [searchTerm, statusFilter, priorityFilter, sortField, sortDirection, referrals]);

  const filterAndSortReferrals = () => {
    let filtered = [...referrals];

    // Apply existing filters
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

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ref => ref.priority === priorityFilter);
    }

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

    // Apply sorting only if not using display order
    if (sortField !== 'displayOrder') {
      filtered.sort((a, b) => {
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
    }

    setFilteredReferrals(filtered);
  };

  const handleReorderReferrals = async (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex || isReordering) return;

    setIsReordering(true);

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
          specialty: currentSpecialty || undefined,
          filter: statusFilter !== 'all' ? statusFilter : undefined,
          sortField
        }
      );

      if (response.success) {
        // Update the main referrals state
        let updatedReferrals = [...referrals];
        
        // Apply the same reordering to the main list
        const mainSourceIndex = updatedReferrals.findIndex(r => r.id === movedItem.id);
        if (mainSourceIndex !== -1) {
          const [mainMovedItem] = updatedReferrals.splice(mainSourceIndex, 1);
          const mainDestinationIndex = Math.min(destinationIndex, updatedReferrals.length);
          updatedReferrals.splice(mainDestinationIndex, 0, mainMovedItem);
        }
        
        setReferrals(updatedReferrals);
        
        toast({
          title: "Order Updated",
          description: `Moved "${movedItem.patient.name}" to new position`,
        });
      } else {
        // Revert on failure
        setFilteredReferrals(filteredReferrals);
        toast({
          title: "Reorder Failed",
          description: response.error || "Failed to update referral order",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert on error
      setFilteredReferrals(filteredReferrals);
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
