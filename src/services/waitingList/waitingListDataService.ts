
import { Referral } from '@/types/referral';
import { fetchReferrals } from '../referral/bulkReferralService';

export const loadWaitingListReferrals = async (selectedSpecialties: string[] = [], includeDischarged: boolean = false): Promise<Referral[]> => {
  console.log('Loading waiting list referrals for specialties:', selectedSpecialties, 'includeDischarged:', includeDischarged);
  
  try {
    const filters: any = {};
    
    // When including discharged referrals, we need to get both:
    // 1. Active waiting list referrals (triage_status = 'waiting-list' AND status != 'discharged')
    // 2. Discharged referrals that were previously on waiting list (status = 'discharged')
    if (includeDischarged) {
      // Include both waiting list and discharged referrals
      filters.waitingListIncludeDischargedFilter = true;
    } else {
      // Only show active waiting list referrals
      filters.triageStatus = 'waiting-list';
      filters.excludeStatuses = ['discharged', 'complete'];
    }
    
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
