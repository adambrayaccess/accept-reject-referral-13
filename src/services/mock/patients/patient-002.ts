
import { Patient } from '@/types/patient';
import { patient002VitalSigns } from './patient-002/vital-signs';
import { patient002TestResults } from './patient-002/test-results';
import { patient002MedicationHistory } from './patient-002/medication-history';
import { patient002MHASections } from './patient-002/mha-sections';

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Johnson',
  birthDate: '1975-09-22',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '15 Oak Avenue, Manchester, M1 2AB',
  phone: '07700 900456',
  medicalHistory: {
    vitalSigns: patient002VitalSigns,
    testResults: patient002TestResults,
    medicationHistory: patient002MedicationHistory,
    mhaSections: patient002MHASections
  }
};
