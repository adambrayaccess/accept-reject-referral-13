
import { Patient } from '@/types/patient';
import { patient002VitalSigns } from './patient-002/vital-signs';
import { patient002TestResults } from './patient-002/test-results';
import { patient002MedicationHistory } from './patient-002/medication-history';
import { patient002MHASections } from './patient-002/mha-sections';

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Davis',
  birthDate: '1992-08-20',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '456 Queen Street, Manchester, M1 1AA',
  phone: '07700 900345',
  medicalHistory: {
    vitalSigns: patient002VitalSigns,
    testResults: patient002TestResults,
    medicationHistory: patient002MedicationHistory,
    mhaSections: patient002MHASections,
    allergies: [
      {
        id: 'ALLERGY002001',
        allergen: 'Aspirin',
        reaction: 'Gastrointestinal bleeding, stomach pain',
        severity: 'moderate',
        recordedDate: '2021-05-12T00:00:00Z',
        recordedBy: 'Dr. Emma Thompson',
        status: 'active',
        notes: 'Patient experienced severe stomach upset and minor bleeding. Avoid all NSAIDs.'
      },
      {
        id: 'ALLERGY002002',
        allergen: 'Peanuts',
        reaction: 'Mild hives, no respiratory symptoms',
        severity: 'mild',
        recordedDate: '2019-09-03T00:00:00Z',
        recordedBy: 'Dr. James Parker',
        status: 'active'
      }
    ]
  }
};
