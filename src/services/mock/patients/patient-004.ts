
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient004: Patient = {
  id: 'P004',
  name: 'Emma Thompson',
  birthDate: '1990-03-15',
  gender: 'female',
  nhsNumber: '456 789 0123',
  address: '25 High Street, Leeds, LS1 4HG',
  phone: '07700 900234',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-07T00:00:00Z', 'healthy'),
    testResults: [
      ...createSpecializedTestResults('004', 'Dr. Helen Roberts', 'thyroid', '2023-06-01T00:00:00Z'),
      ...createCommonTestResults('004', 'Dr. Helen Roberts', '2023-05-28T00:00:00Z'),
      {
        id: 'TEST013',
        testName: 'Vitamin D',
        testType: 'blood',
        requestedDate: '2023-05-25T00:00:00Z',
        sampleDate: '2023-05-25T08:15:00Z',
        reportDate: '2023-05-25T14:30:00Z',
        requestedBy: 'Dr. Helen Roberts',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Vitamin D',
            value: '35',
            unit: 'nmol/L',
            referenceRange: '50-125',
            flag: 'low'
          }
        ],
        interpretation: 'Vitamin D deficiency. Supplement recommended.',
        notes: 'May contribute to mood symptoms'
      }
    ],
    medicationHistory: [
      ...createMedicationHistory('004', 'Dr. Helen Roberts', ['contraception', 'depression'], '2023-05-01T00:00:00Z'),
      {
        id: 'MED020',
        name: 'Vitamin D3',
        dosage: '4000 IU',
        frequency: 'Once daily',
        prescribedDate: '2023-05-25T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Vitamin D deficiency',
        status: 'active',
        notes: 'Take with fatty meal for better absorption. Recheck levels in 3 months.'
      }
    ],
    mhaSections: [
      {
        id: 'MHA003',
        sectionNumber: '136',
        sectionTitle: 'Police Powers',
        appliedDate: '2023-05-10T00:00:00Z',
        expiryDate: '2023-05-11T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Rachel Martinez',
        hospital: 'Leeds General Infirmary',
        reason: 'Police brought patient from public place due to concerns for mental health and safety. Assessed under Section 136.',
        notes: 'Patient assessed and admitted voluntarily for treatment. Section 136 discharged after 18 hours.'
      },
      {
        id: 'MHA004',
        sectionNumber: '5(2)',
        sectionTitle: "Doctor's Holding Power",
        appliedDate: '2023-05-14T00:00:00Z',
        expiryDate: '2023-05-17T00:00:00Z',
        status: 'discharged',
        consultantResponsible: 'Dr. Rachel Martinez',
        hospital: 'Leeds General Infirmary',
        reason: 'Patient attempted to leave hospital during voluntary admission while still presenting risk to self.',
        notes: 'Used to prevent patient leaving until formal assessment could be completed. Patient agreed to continue voluntary treatment.'
      }
    ]
  }
};
