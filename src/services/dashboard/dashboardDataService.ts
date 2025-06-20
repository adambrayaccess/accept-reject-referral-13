
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';

export const loadDashboardReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  let data = await fetchReferrals();
  
  console.log('=== loadDashboardReferrals ===');
  console.log('Raw data loaded:', data.length);
  console.log('Selected specialties:', selectedSpecialties);
  
  // Filter referrals by selected specialties if any are selected
  if (selectedSpecialties.length > 0) {
    const beforeFilter = data.length;
    data = data.filter(ref => selectedSpecialties.includes(ref.specialty));
    console.log('After specialty filter:', data.length, 'from', beforeFilter);
  }
  
  // Filter for dashboard: exclude referrals that are only on waiting list
  // Dashboard shows: new referrals, recently processed referrals, but NOT pure waiting list items
  const beforeStatusFilter = data.length;
  data = data.filter(ref => {
    // Exclude referrals that are accepted AND on waiting-list (these belong to waiting list view)
    if (ref.status === 'accepted' && ref.triageStatus === 'waiting-list') {
      return false;
    }
    return true;
  });
  console.log('After status filter:', data.length, 'from', beforeStatusFilter);
  
  // Sort by display order if it exists, otherwise by creation date
  data.sort((a, b) => {
    const aOrder = (a as any).displayOrder;
    const bOrder = (b as any).displayOrder;
    
    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }
    
    // Fallback to creation date
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  
  console.log('Final referrals for dashboard:', data.length);
  console.log('==============================');
  
  return data;
};

export const updateReferralDisplayOrder = (referrals: Referral[], reorderedReferrals: Referral[]): Referral[] => {
  const updatedReferrals = [...referrals];
  
  // Update display orders for all items in the reordered list
  reorderedReferrals.forEach((referral, index) => {
    const mainIndex = updatedReferrals.findIndex(r => r.id === referral.id);
    if (mainIndex !== -1) {
      (updatedReferrals[mainIndex] as any).displayOrder = index;
    }
  });
  
  return updatedReferrals;
};
