
import { Referral } from '@/types/referral';
import { referralService } from '@/services/supabase/referralService';
import { differenceInDays } from 'date-fns';

export const loadDashboardReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  let data = await referralService.getAll();
  
  // Filter by selected specialties if provided
  if (selectedSpecialties.length > 0) {
    data = data.filter(ref => selectedSpecialties.includes(ref.specialty));
  }
  
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
  
  return processedData;
};

export const updateReferralDisplayOrder = (referrals: Referral[], reorderedReferrals: Referral[]): Referral[] => {
  // This would update the display order in the database
  // For now, just return the reordered list
  return reorderedReferrals;
};
