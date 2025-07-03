
import { Referral } from '@/types/referral';
import { fetchReferrals } from '../referral/bulkReferralService';

export const loadWaitingListReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  console.log('Loading waiting list referrals for specialties:', selectedSpecialties);
  
  try {
    const filters: any = {
      triageStatus: 'waiting-list' // Only show referrals with waiting-list triage status
    };
    
    // Apply specialty filter if specific specialties are selected
    if (selectedSpecialties.length === 1) {
      filters.specialty = selectedSpecialties[0];
    } else if (selectedSpecialties.length > 1) {
      filters.specialties = selectedSpecialties;
    }
    
    const referrals = await fetchReferrals(filters);
    
    // Add calculated fields and preserve display order
    const processedReferrals = referrals.map((referral, index) => ({
      ...referral,
      displayOrder: referral.displayOrder !== undefined ? referral.displayOrder : index,
      calculatedReferralAge: calculateReferralAge(referral.created),
      calculatedPatientAge: calculatePatientAge(referral.patient.birthDate),
      calculatedLocation: extractLocation(referral.patient.address)
    }));

    // Sort by display order to maintain manual ordering
    processedReferrals.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    console.log(`Loaded ${processedReferrals.length} referrals for waiting list`);
    return processedReferrals;
  } catch (error) {
    console.error('Error loading waiting list referrals:', error);
    return [];
  }
};

function calculateReferralAge(created: string): number {
  const createdDate = new Date(created);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
}

function calculatePatientAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
}

function extractLocation(address?: string): string {
  if (!address) return 'Unknown';
  const parts = address.split(',');
  return parts[parts.length - 1]?.trim() || 'Unknown';
}
