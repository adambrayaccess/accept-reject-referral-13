
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardData = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
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
    filterReferrals();
  }, [searchTerm, statusFilter, priorityFilter, specialtyFilter, referrals]);

  const filterReferrals = () => {
    let filtered = [...referrals];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ref => ref.priority === priorityFilter);
    }

    // Filter by specialty
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(ref => ref.specialty === specialtyFilter);
    }

    // Filter by search term
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
    handleRefresh
  };
};
