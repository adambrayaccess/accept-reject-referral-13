
import { Referral } from '@/types/referral';
import { fetchReferrals } from '../referral/bulkReferralService';

export const loadDashboardReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  console.log('Loading dashboard referrals for specialties:', selectedSpecialties);
  
  try {
    const filters: any = {};
    
    // Apply specialty filter if specific specialties are selected
    if (selectedSpecialties.length === 1) {
      filters.specialty = selectedSpecialties[0];
    }
    
    const referrals = await fetchReferrals(filters);
    
    // Add calculated fields for dashboard use
    const processedReferrals = referrals.map((referral, index) => ({
      ...referral,
      displayOrder: referral.displayOrder || index,
      calculatedReferralAge: calculateReferralAge(referral.created),
      calculatedPatientAge: calculatePatientAge(referral.patient.birthDate),
      calculatedLocation: extractLocation(referral.patient.address)
    }));

    console.log(`Loaded ${processedReferrals.length} referrals for dashboard`);
    return processedReferrals;
  } catch (error) {
    console.error('Error loading dashboard referrals:', error);
    return [];
  }
};

export const updateReferralDisplayOrder = (
  allReferrals: Referral[], 
  reorderedReferrals: Referral[]
): Referral[] => {
  const updatedReferrals = [...allReferrals];
  
  reorderedReferrals.forEach((reorderedRef, newIndex) => {
    const existingIndex = updatedReferrals.findIndex(ref => ref.id === reorderedRef.id);
    if (existingIndex !== -1) {
      updatedReferrals[existingIndex] = {
        ...updatedReferrals[existingIndex],
        displayOrder: newIndex
      };
    }
  });
  
  return updatedReferrals;
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
