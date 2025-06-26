
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReferralById, fetchPatientReferrals } from '@/services/referralService';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';

interface RelatedReferrals {
  serviceTotal: number;
  activeTotal: number;
  activeSpecialties: string[];
}

export const useReferralData = (id: string | undefined) => {
  const [referral, setReferral] = useState<Referral | null>(null);
  const [relatedReferrals, setRelatedReferrals] = useState<RelatedReferrals>({ 
    serviceTotal: 0, 
    activeTotal: 0,
    activeSpecialties: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadReferral = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchReferralById(id);
      
      if (!data) {
        toast({
          title: 'Error',
          description: 'Referral not found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      // Enhanced data validation logging
      console.log('=== useReferralData Hook Validation ===');
      console.log('Fetched referral ID:', data.id);
      console.log('Patient ID:', data.patient?.id);
      console.log('Patient name:', data.patient?.name);
      console.log('Patient reasonable adjustments exists:', !!data.patient?.reasonableAdjustments);
      
      if (data.patient?.reasonableAdjustments) {
        console.log('✅ Found reasonable adjustments on patient:');
        console.log('- hasAdjustments:', data.patient.reasonableAdjustments.hasAdjustments);
        console.log('- flagLevel:', data.patient.reasonableAdjustments.flagLevel);
        console.log('- adjustments count:', data.patient.reasonableAdjustments.adjustments?.length);
        console.log('- adjustments data:', data.patient.reasonableAdjustments.adjustments);
      } else {
        console.log('❌ No reasonable adjustments found on patient');
        console.log('Full patient object keys:', Object.keys(data.patient || {}));
      }
      console.log('=====================================');
      
      setReferral(data);
      
      const patientReferrals = await fetchPatientReferrals(data.patient.id);
      const serviceReferrals = patientReferrals.filter(ref => ref.specialty === data.specialty && ref.id !== data.id);
      const activeReferrals = patientReferrals.filter(ref => ref.status !== 'rejected' && ref.id !== data.id);
      const activeSpecialties = Array.from(new Set(activeReferrals.map(ref => ref.specialty)));
      
      setRelatedReferrals({
        serviceTotal: serviceReferrals.length,
        activeTotal: activeReferrals.length,
        activeSpecialties
      });
    } catch (error) {
      console.error('Error fetching referral:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referral details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferral();
  }, [id]);

  return {
    referral,
    relatedReferrals,
    isLoading,
    loadReferral
  };
};
