import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';
import { createPatientAllergies } from '../shared/allergies';

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1980-05-15',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '123 High Street, London, SW1A 1AA',
  phone: '07700 900123',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-01-15T00:00:00Z', 'stable'),
    testResults: [
      ...createCommonTestResults('001', 'Dr. Sarah Johnson', '2023-01-10T00:00:00Z'),
      ...createSpecializedTestResults('001', 'Dr. Sarah Johnson', 'cardiac', '2023-01-10T00:00:00Z')
    ],
    medicationHistory: createMedicationHistory('001', 'Dr. Sarah Johnson', ['hypertension', 'diabetes'], '2023-01-01T00:00:00Z'),
    allergies: createPatientAllergies('P001', 'Dr. Sarah Johnson', '2023-01-01T00:00:00Z'),
    mhaSections: [
      {
        id: 'MHA001001',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2022-08-15T00:00:00Z',
        expiryDate: '2022-09-13T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. James Mitchell',
        hospital: 'St. Thomas Mental Health Unit',
        reason: 'Patient presented with acute psychotic symptoms and posed risk to self and others. Assessment required.',
        reviewDate: '2022-08-29T00:00:00Z',
        notes: 'Patient responded well to treatment. Discharged to community mental health team follow-up.'
      },
      {
        id: 'MHA001002',
        sectionNumber: '117',
        sectionTitle: 'Aftercare',
        appliedDate: '2022-09-13T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. James Mitchell',
        hospital: 'St. Thomas Mental Health Unit',
        reason: 'Ongoing aftercare support following discharge from Section 2.',
        notes: 'Community mental health team providing ongoing support and monitoring.'
      }
    ]
  }
};
