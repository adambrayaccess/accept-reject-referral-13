
import { SpecialtyOption, HealthcareProfessional } from '@/types/referral';
import { 
  getCachedSpecialtyNames, 
  getCachedSpecialtyIdByName, 
  getCachedSpecialtyNameById,
  initializeSpecialtyCache 
} from '@/services/specialtyService';

// Legacy specialty configuration for backward compatibility
// This data has been migrated to the database and should be removed once all dependencies are updated
export const specialties: SpecialtyOption[] = [
  { id: 'card', name: 'Cardiology' },
  { id: 'derm', name: 'Dermatology' },
  { id: 'endo', name: 'Endocrinology' },
  { id: 'gast', name: 'Gastroenterology' },
  { id: 'neur', name: 'Neurology' },
  { id: 'onco', name: 'Oncology' },
  { id: 'orth', name: 'Orthopedics' },
  { id: 'psyc', name: 'Psychiatry' },
  { id: 'pulm', name: 'Pulmonology' },
  { id: 'rheu', name: 'Rheumatology' },
  { id: 'mhea', name: 'Mental Health' },
];

// Helper functions that now use cached database data
export const getSpecialtyNameById = (id: string): string => {
  return getCachedSpecialtyNameById(id);
};

export const getSpecialtyIdByName = (name: string): string => {
  return getCachedSpecialtyIdByName(name);
};

export const getAllSpecialtyNames = (): string[] => {
  return getCachedSpecialtyNames();
};

// Validate if a specialty exists (fallback to legacy for now)
export const isValidSpecialty = (specialtyId: string): boolean => {
  return specialties.some(s => s.id === specialtyId);
};

// Initialize the specialty cache on app startup
initializeSpecialtyCache().catch(console.error);

export const healthcareProfessionals: HealthcareProfessional[] = [
  // Cardiology
  { id: 'hp1', name: 'Dr. Sarah Jones', role: 'Consultant', specialty: 'card' },
  { id: 'hp2', name: 'Dr. Michael Chen', role: 'Specialist', specialty: 'card' },
  
  // Dermatology
  { id: 'hp3', name: 'Dr. Emma Wilson', role: 'Consultant', specialty: 'derm' },
  { id: 'hp4', name: 'Dr. James Smith', role: 'Specialist', specialty: 'derm' },
  
  // Neurology
  { id: 'hp5', name: 'Dr. Lisa Brown', role: 'Consultant', specialty: 'neur' },
  { id: 'hp6', name: 'Dr. Robert Taylor', role: 'Senior Registrar', specialty: 'neur' },
  
  // Mental Health
  { id: 'hp7', name: 'Dr. Robert Taylor', role: 'Consultant', specialty: 'mhea' },
  { id: 'hp8', name: 'Dr. Maria Lopez', role: 'Specialist', specialty: 'mhea' },
  
  // Psychiatry
  { id: 'hp23', name: 'Dr. Amanda Wilson', role: 'Consultant', specialty: 'psyc' },
  { id: 'hp24', name: 'Dr. Sarah Mitchell', role: 'Senior Registrar', specialty: 'psyc' },
  
  // Rheumatology
  { id: 'hp9', name: 'Dr. Helen Davies', role: 'Consultant', specialty: 'rheu' },
  { id: 'hp10', name: 'Dr. Peter Evans', role: 'Senior Registrar', specialty: 'rheu' },
  
  // Gastroenterology
  { id: 'hp11', name: 'Dr. Anna Smith', role: 'Consultant', specialty: 'gast' },
  { id: 'hp12', name: 'Dr. Thomas Brown', role: 'Senior Registrar', specialty: 'gast' },
  
  // Endocrinology
  { id: 'hp13', name: 'Dr. Susan Miller', role: 'Consultant', specialty: 'endo' },
  { id: 'hp14', name: 'Dr. David Wilson', role: 'Specialist', specialty: 'endo' },
  
  // Oncology
  { id: 'hp15', name: 'Dr. Rachel Green', role: 'Consultant', specialty: 'onco' },
  { id: 'hp16', name: 'Dr. Mark Johnson', role: 'Senior Registrar', specialty: 'onco' },
  
  // Orthopedics
  { id: 'hp17', name: 'Dr. Christopher Lee', role: 'Consultant', specialty: 'orth' },
  { id: 'hp18', name: 'Dr. Jennifer White', role: 'Specialist', specialty: 'orth' },
  
  // Pulmonology
  { id: 'hp21', name: 'Dr. Steven Clark', role: 'Consultant', specialty: 'pulm' },
  { id: 'hp22', name: 'Dr. Laura Martinez', role: 'Specialist', specialty: 'pulm' },
];
