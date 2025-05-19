
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays } from 'date-fns';

interface CohortFilters {
  referralAge: {
    min: number;
    max: number;
  };
  priority: string[];
  patientAge: {
    min: number;
    max: number;
  };
  location: string;
  tags: string[];
}

export const useCohortData = (currentSpecialty: string | null = null) => {
  const [allReferrals, setAllReferrals] = useState<Referral[]>([]);
  const [cohortReferrals, setCohortReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReferrals, setSelectedReferrals] = useState<Referral[]>([]);
  const [filters, setFilters] = useState<CohortFilters>({
    referralAge: { min: 0, max: 365 },
    priority: [],
    patientAge: { min: 0, max: 120 },
    location: '',
    tags: []
  });
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
      
      // Add calculated properties for filtering
      const processedData = data.map(ref => {
        // Calculate referral age in days
        const createdDate = new Date(ref.created);
        const today = new Date();
        const ageInDays = differenceInDays(today, createdDate);
        
        // Calculate patient age in years
        const birthDate = new Date(ref.patient.birthDate);
        const ageInYears = Math.floor(differenceInDays(today, birthDate) / 365);
        
        // Extract location from patient address if available
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
      setCohortReferrals(processedData);
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

  // Load referrals on mount and specialty change
  useEffect(() => {
    loadReferrals();
  }, [currentSpecialty]);

  // Filter referrals when filters change
  useEffect(() => {
    if (allReferrals.length === 0) return;
    
    const filtered = allReferrals.filter(ref => {
      // Filter by referral age
      if (ref.calculatedReferralAge < filters.referralAge.min || 
          ref.calculatedReferralAge > filters.referralAge.max) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority.length > 0 && !filters.priority.includes(ref.priority)) {
        return false;
      }
      
      // Filter by patient age
      if (ref.calculatedPatientAge < filters.patientAge.min || 
          ref.calculatedPatientAge > filters.patientAge.max) {
        return false;
      }
      
      // Filter by location
      if (filters.location && !ref.calculatedLocation.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Filter by tags
      if (filters.tags.length > 0) {
        if (!ref.tags || !ref.tags.some(tag => filters.tags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });
    
    setCohortReferrals(filtered);
  }, [filters, allReferrals]);

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Cohort data has been updated',
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

  return {
    cohortReferrals,
    isLoading,
    filters,
    setFilters,
    handleRefresh,
    selectedReferrals,
    toggleReferralSelection,
    clearSelection,
    selectAll
  };
};
