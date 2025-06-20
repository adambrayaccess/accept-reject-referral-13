
import { HealthcareProfessional } from '@/types/referral';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';

// Import the centralized healthcare professionals data
export { healthcareProfessionals as mockHealthcareProfessionals } from '@/data/specialtyOptions';

// Helper function to get healthcare professionals by specialty
export const getHealthcareProfessionalsBySpecialty = (specialtyName: string): HealthcareProfessional[] => {
  const { healthcareProfessionals, getSpecialtyIdByName } = require('@/data/specialtyOptions');
  const specialtyId = getSpecialtyIdByName(specialtyName);
  return healthcareProfessionals.filter((hp: HealthcareProfessional) => hp.specialty === specialtyId);
};

// Helper function to validate specialty coverage
export const validateSpecialtyCoverage = (): { [key: string]: number } => {
  const { healthcareProfessionals } = require('@/data/specialtyOptions');
  const specialtyNames = getAllSpecialtyNames();
  const coverage: { [key: string]: number } = {};
  
  specialtyNames.forEach(name => {
    coverage[name] = getHealthcareProfessionalsBySpecialty(name).length;
  });
  
  return coverage;
};
