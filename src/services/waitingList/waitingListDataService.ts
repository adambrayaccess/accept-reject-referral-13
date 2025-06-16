
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { differenceInDays } from 'date-fns';

export const loadWaitingListReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  let data = await fetchReferrals();
  
  // Filter by selected specialties and waiting list status
  data = data.filter(ref => 
    (selectedSpecialties.length === 0 || selectedSpecialties.includes(ref.specialty)) && 
    ref.status === 'accepted' &&
    ref.triageStatus === 'waiting-list'
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
  
  return processedData;
};
