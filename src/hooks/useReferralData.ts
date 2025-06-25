
import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { referralService } from '@/services/supabase/referralService';
import { toast } from 'sonner';

export const useReferralData = (referralId?: string) => {
  const [referral, setReferral] = useState<Referral | null>(null);
  const [patientReferrals, setPatientReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReferralData = async () => {
    if (!referralId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const referralData = await referralService.getById(referralId);
      
      if (referralData) {
        setReferral({
          ...referralData,
          tags: referralData.tags || []
        });
        
        // Load other referrals for the same patient
        const patientReferralsData = await referralService.getByPatientId(referralData.patient.id);
        setPatientReferrals(patientReferralsData.map(ref => ({
          ...ref,
          tags: ref.tags || []
        })));
      } else {
        setError('Referral not found');
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
      setError('Failed to load referral data');
      toast.error('Failed to load referral data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, [referralId]);

  const refreshReferralData = () => {
    loadReferralData();
  };

  // Calculate related referrals for backward compatibility
  const relatedReferrals = {
    serviceTotal: patientReferrals.filter(ref => 
      ref.specialty === referral?.specialty && ref.id !== referral?.id
    ).length,
    activeTotal: patientReferrals.filter(ref => 
      ref.status !== 'rejected' && ref.id !== referral?.id
    ).length,
    activeSpecialties: Array.from(new Set(
      patientReferrals
        .filter(ref => ref.status !== 'rejected' && ref.id !== referral?.id)
        .map(ref => ref.specialty)
    ))
  };

  return {
    referral,
    patientReferrals,
    relatedReferrals,
    isLoading,
    error,
    refreshReferralData,
    loadReferral: loadReferralData // Add backward compatibility alias
  };
};
