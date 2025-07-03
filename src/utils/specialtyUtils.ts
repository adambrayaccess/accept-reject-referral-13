
import { getCachedSpecialtyNames, getCachedSpecialtyIdByName, getCachedSpecialtyNameById } from '@/services/specialtyService';
import { isValidSpecialty } from '@/data/specialtyOptions';
import { Referral } from '@/types/referral';

/**
 * Extract unique specialties from referral data
 */
export const extractSpecialtiesFromReferrals = (referrals: Referral[]): string[] => {
  const specialtySet = new Set<string>();
  
  referrals.forEach(referral => {
    if (referral.specialty) {
      // Convert specialty ID to name if needed
      const specialtyName = isValidSpecialty(referral.specialty) 
        ? getCachedSpecialtyNameById(referral.specialty)
        : referral.specialty;
      specialtySet.add(specialtyName);
    }
  });
  
  return Array.from(specialtySet).sort();
};

/**
 * Get all available specialties (from central config + any found in data)
 */
export const getAllAvailableSpecialties = (referrals: Referral[] = []): string[] => {
  const configSpecialties = getCachedSpecialtyNames();
  const dataSpecialties = extractSpecialtiesFromReferrals(referrals);
  
  // Combine and deduplicate
  const allSpecialties = new Set([...configSpecialties, ...dataSpecialties]);
  return Array.from(allSpecialties).sort();
};

/**
 * Validate specialty and provide fallback
 */
export const normalizeSpecialty = (specialty: string): string => {
  // If it's a valid specialty name, return as-is
  if (getCachedSpecialtyNames().includes(specialty)) {
    return specialty;
  }

  // If it's a valid specialty ID, convert to name
  if (isValidSpecialty(specialty)) {
    return getCachedSpecialtyNameById(specialty);
  }
  
  // Return as-is for unknown specialties (they'll be filtered out in UI)
  return specialty;
};

/**
 * Filter specialties to only include valid ones
 */
export const filterValidSpecialties = (specialties: string[]): string[] => {
  const validSpecialtyNames = getCachedSpecialtyNames();
  return specialties.filter(specialty => validSpecialtyNames.includes(specialty));
};
