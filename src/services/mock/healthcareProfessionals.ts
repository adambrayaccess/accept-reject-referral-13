
import { HealthcareProfessional } from '@/types/referral';
import { getAllServiceNames } from '@/data/serviceOptions';

// Import the centralized healthcare professionals data
export { healthcareProfessionals as mockHealthcareProfessionals } from '@/data/serviceOptions';

// Helper function to get healthcare professionals by service
export const getHealthcareProfessionalsByService = (serviceName: string): HealthcareProfessional[] => {
  const { healthcareProfessionals, getServiceIdByName } = require('@/data/serviceOptions');
  const serviceId = getServiceIdByName(serviceName);
  return healthcareProfessionals.filter((hp: HealthcareProfessional) => hp.specialty === serviceId);
};

// Helper function to validate service coverage
export const validateServiceCoverage = (): { [key: string]: number } => {
  const { healthcareProfessionals } = require('@/data/serviceOptions');
  const serviceNames = getAllServiceNames();
  const coverage: { [key: string]: number } = {};
  
  serviceNames.forEach(name => {
    coverage[name] = getHealthcareProfessionalsByService(name).length;
  });
  
  return coverage;
};

// Legacy exports for backward compatibility
export const getHealthcareProfessionalsBySpecialty = getHealthcareProfessionalsByService;
export const validateSpecialtyCoverage = validateServiceCoverage;
