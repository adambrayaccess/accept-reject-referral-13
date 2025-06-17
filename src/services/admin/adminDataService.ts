
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { differenceInDays } from 'date-fns';

export const loadAllAdminReferrals = async (): Promise<Referral[]> => {
  let data = await fetchReferrals();
  
  // Include ALL referrals for admin view - no filtering like dashboard or waiting list
  // This gives the admin a complete view across all statuses and triage stages
  
  // Add calculated properties for comprehensive analytics
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
  
  // Sort by priority and creation date for admin overview
  processedData.sort((a, b) => {
    // Priority order: emergency > urgent > routine
    const priorityOrder = { emergency: 3, urgent: 2, routine: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Then by creation date (newest first)
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  
  return processedData;
};
