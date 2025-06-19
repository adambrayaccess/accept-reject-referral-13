
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';
import { createPatientAllergies } from '../shared/allergies';

export const patient003: Patient = {
  id: 'P003',
  name: 'Alice Johnson',
  birthDate: '1975-12-03',
  gender: 'female',
  nhsNumber: '345 678 9012',
  address: '789 Oak Avenue, Birmingham, B1 1AA',
  phone: '07700 900456',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-03-20T00:00:00Z', 'monitoring'),
    testResults: [
      ...createCommonTestResults('003', 'Dr. Michael Davis', '2023-03-15T00:00:00Z'),
      ...createSpecializedTestResults('003', 'Dr. Michael Davis', 'renal', '2023-03-15T00:00:00Z')
    ],
    medicationHistory: createMedicationHistory('003', 'Dr. Michael Davis', ['hypertension'], '2023-03-01T00:00:00Z'),
    allergies: createPatientAllergies('P003', 'Dr. Michael Davis', '2023-03-01T00:00:00Z'),
    mhaSections: [
      {
        id: 'MHA003001',
        sectionNumber: '136',
        sectionTitle: 'Police Powers',
        appliedDate: '2023-02-20T00:00:00Z',
        expiryDate: '2023-02-21T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Lisa Thompson',
        hospital: 'Birmingham Mental Health Trust',
        reason: 'Police found patient in distressed state in public place, expressing suicidal ideation.',
        notes: 'Patient assessed and admitted voluntarily. Section 136 discharged after 16 hours.'
      },
      {
        id: 'MHA003002',
        sectionNumber: '5(4)',
        sectionTitle: "Nurse's Holding Power",
        appliedDate: '2023-03-10T00:00:00Z',
        expiryDate: '2023-03-10T00:00:00Z',
        status: 'discharged',
        consultantResponsible: 'Dr. Lisa Thompson',
        hospital: 'Birmingham Mental Health Trust',
        reason: 'Patient attempted to leave ward during voluntary admission while acutely unwell.',
        notes: 'Holding power used for 4 hours until doctor assessment completed. Patient agreed to remain voluntary.'
      },
      {
        id: 'MHA003003',
        sectionNumber: '3',
        sectionTitle: 'Admission for Treatment',
        appliedDate: '2023-03-15T00:00:00Z',
        expiryDate: '2023-09-15T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. Lisa Thompson',
        hospital: 'Birmingham Mental Health Trust',
        reason: 'Severe bipolar disorder with psychotic features. Patient lacks capacity and refuses necessary treatment.',
        reviewDate: '2023-06-15T00:00:00Z',
        notes: 'Patient showing gradual improvement with mood stabilizers and antipsychotic medication.'
      }
    ]
  }
};
