
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient003: Patient = {
  id: 'P003',
  name: 'Michael Johnson',
  birthDate: '1978-11-03',
  gender: 'male',
  nhsNumber: '345 678 9012',
  address: '789 Oak Avenue, Birmingham, B1 1DB',
  phone: '07700 900456',
  gpDetails: {
    id: 'GP003',
    name: 'Dr. Rachel Green',
    practice: 'Birmingham Health Clinic',
    address: '321 Church Street, Birmingham, B1 2CC',
    phone: '0121 496 0000',
    email: 'rachel.green@birmingham.nhs.uk'
  },
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-12T00:00:00Z', 'concerning'),
    cardiograms: [
      {
        timestamp: '2023-06-12T09:00:00Z',
        data: [],
        interpretation: 'Sinus tachycardia. ST segment depression in leads V4-V6, suggestive of myocardial ischemia.'
      },
      {
        timestamp: '2023-06-12T21:00:00Z',
        data: [],
        interpretation: 'Improved ST segments. Persisting sinus tachycardia.'
      },
      {
        timestamp: '2023-06-13T09:00:00Z',
        data: [],
        interpretation: 'Resolution of ST changes. Normal sinus rhythm.'
      }
    ],
    testResults: [
      ...createCommonTestResults('003', 'Dr. Rachel Green', '2023-06-10T00:00:00Z'),
      ...createSpecializedTestResults('003', 'Dr. Rachel Green', 'cardiac', '2023-06-12T00:00:00Z')
    ],
    medicationHistory: createMedicationHistory('003', 'Dr. Rachel Green', ['cardiac'], '2023-06-01T00:00:00Z'),
    allergies: [
      {
        id: 'ALLERGY003001',
        allergen: 'Morphine',
        reaction: 'Severe nausea, vomiting, hallucinations',
        severity: 'severe',
        recordedDate: '2021-02-10T00:00:00Z',
        recordedBy: 'Dr. Rachel Green',
        status: 'active',
        notes: 'Patient experienced severe adverse reaction during post-operative care. Use alternative pain management.'
      },
      {
        id: 'ALLERGY003002',
        allergen: 'Latex',
        reaction: 'Contact dermatitis, respiratory symptoms',
        severity: 'moderate',
        recordedDate: '2019-11-18T00:00:00Z',
        recordedBy: 'Nurse Sarah Adams',
        status: 'active',
        notes: 'Reaction to latex gloves during examination. Use nitrile gloves for all procedures.'
      }
    ]
  }
};
