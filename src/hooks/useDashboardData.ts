
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardData = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReferrals();
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
  }, []);

  useEffect(() => {
    filterAndSortReferrals();
  }, [searchTerm, statusFilter, priorityFilter, sortField, sortDirection, referrals]);

  const filterAndSortReferrals = () => {
    let filtered = [...referrals];

    // Apply existing filters
    if (statusFilter !== 'all') {
      // Check both status and triageStatus fields
      filtered = filtered.filter(ref => {
        // Check standard status field (new, accepted, rejected)
        if (['new', 'accepted', 'rejected', 'refer-to-another-specialty'].includes(statusFilter)) {
          return ref.status === statusFilter;
        }
        // Check triageStatus field for other status values
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

    // Apply sorting
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

    setFilteredReferrals(filtered);
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
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    handleRefresh,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  };
};
