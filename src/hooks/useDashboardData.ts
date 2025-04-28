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
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
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
  }, [searchTerm, statusFilter, priorityFilter, specialtyFilter, sortField, sortDirection, referrals]);

  const filterAndSortReferrals = () => {
    let filtered = [...referrals];

    // Apply existing filters
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ref => ref.priority === priorityFilter);
    }

    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(ref => ref.specialty === specialtyFilter);
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

  const specialties = ['all', ...new Set(referrals.map(ref => ref.specialty))];

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
    specialtyFilter,
    setSpecialtyFilter,
    specialties,
    handleRefresh,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  };
};
