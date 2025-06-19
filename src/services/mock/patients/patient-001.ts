
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1985-05-10',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '123 Main Street, London, SW1A 1AA',
  phone: '07700 900123',
  gpDetails: {
    id: 'GP001',
    name: 'Dr. Jane Wilson',
    practice: 'London Medical Centre',
    address: '456 High Street, London, SW1A 2BB',
    phone: '020 7946 0958',
    email: 'jane.wilson@londonmedical.nhs.uk'
  },
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-10T00:00:00Z', 'healthy'),
    testResults: createCommonTestResults('001', 'Dr. Jane Wilson', '2023-06-05T00:00:00Z'),
    medicationHistory: createMedicationHistory('001', 'Dr. Jane Wilson', ['contraception'], '2023-06-01T00:00:00Z'),
    allergies: [
      {
        id: 'ALLERGY001001',
        allergen: 'Penicillin',
        reaction: 'Skin rash, hives',
        severity: 'moderate',
        recordedDate: '2020-03-15T00:00:00Z',
        recordedBy: 'Dr. Jane Wilson',
        status: 'active',
        notes: 'Patient developed widespread rash within 30 minutes of oral penicillin administration.'
      },
      {
        id: 'ALLERGY001002',
        allergen: 'Shellfish',
        reaction: 'Swelling of lips and tongue, difficulty breathing',
        severity: 'severe',
        recordedDate: '2018-07-22T00:00:00Z',
        recordedBy: 'Dr. Michael Brown',
        status: 'active',
        notes: 'Anaphylactic reaction requiring emergency treatment. Patient carries EpiPen.'
      }
    ]
  }
};
