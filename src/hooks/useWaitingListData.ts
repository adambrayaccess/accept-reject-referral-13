
import { useState, useEffect, useMemo } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays } from 'date-fns';

interface WaitingListFilters {
  search: string;
  priority: string;
  location: string;
  ageRange: { min: number; max: number };
}

export const useWaitingListData = (currentSpecialty: string | null = null) => {
  const [allReferrals, setAllReferrals] = useState<Referral[]>([]);
  const [orderedReferrals, setOrderedReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReferrals, setSelectedReferrals] = useState<Referral[]>([]);
  
  const [filters, setFilters] = useState<WaitingListFilters>({
    search: '',
    priority: 'all',
    location: '',
    ageRange: { min: 0, max: 365 }
  });
  
  const [sortField, setSortField] = useState<string>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { toast } = useToast();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      let data = await fetchReferrals();
      
      // Filter by specialty and waiting list status
      data = data.filter(ref => 
        ref.specialty === currentSpecialty && 
        (ref.triageStatus === 'waiting-list' || ref.status === 'new')
      );
      
      // Add calculated properties
      const processedData = data.map(ref => {
        const createdDate = new Date(ref.created);
        const today = new Date();
        const ageInDays = differenceInDays(today, createdDate);
        
        const birthDate = new Date(ref.patient.birthDate);
        const ageInYears = Math.floor(differenceInDays(today, birthDate) / 365);
        
        const location = ref.patient.address ? 
          ref.patient.address.split(',').pop()?.trim() || '' : '';
          
        return {
          ...ref,
          calculatedReferralAge: ageInDays,
          calculatedPatientAge: ageInYears,
          calculatedLocation: location,
          tags: ref.tags || []
        };
      });
      
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
  }, [currentSpecialty]);

  // Filter and sort referrals
  const filteredAndSortedReferrals = useMemo(() => {
    let filtered = [...orderedReferrals];

    // Apply search filter
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(ref =>
        ref.patient.name.toLowerCase().includes(term) ||
        ref.patient.nhsNumber.toLowerCase().includes(term) ||
        ref.ubrn.toLowerCase().includes(term)
      );
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(ref => ref.priority === filters.priority);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(ref =>
        ref.calculatedLocation.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply age range filter
    filtered = filtered.filter(ref =>
      ref.calculatedReferralAge >= filters.ageRange.min &&
      ref.calculatedReferralAge <= filters.ageRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
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

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orderedReferrals, filters, sortField, sortDirection]);

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Waiting list has been updated',
    });
  };

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

  const reorderReferrals = (reorderedReferrals: Referral[]) => {
    setOrderedReferrals(reorderedReferrals);
    toast({
      title: 'Order Updated',
      description: 'Waiting list order has been updated',
    });
  };

  const updateFilters = (newFilters: Partial<WaitingListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priority: 'all',
      location: '',
      ageRange: { min: 0, max: 365 }
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
