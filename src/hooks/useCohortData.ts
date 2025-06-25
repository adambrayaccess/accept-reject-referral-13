
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { referralService } from '@/services/supabase/referralService';
import { differenceInDays, format } from 'date-fns';
import { toast } from 'sonner';

export const useCohortData = (selectedSpecialties: string[] = []) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCohortData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await referralService.getAll();
      
      // Filter by selected specialties if any are selected
      let filteredData = selectedSpecialties.length > 0 
        ? data.filter(ref => selectedSpecialties.includes(ref.specialty))
        : data;

      // Add calculated properties
      const processedData = filteredData.map(ref => {
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

      setReferrals(processedData);
    } catch (error) {
      console.error('Error loading cohort data:', error);
      setError('Failed to load cohort data');
      toast.error('Failed to load cohort data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCohortData();
  }, [selectedSpecialties]);

  const refreshData = () => {
    loadCohortData();
  };

  return {
    referrals,
    isLoading,
    error,
    refreshData
  };
};
