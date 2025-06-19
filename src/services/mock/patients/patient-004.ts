
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
      ...createCommonTestResults('004', 'Dr. Helen Roberts', '2023-06-01T00:00:00Z'),
      ...createSpecializedTestResults('004', 'Dr. Helen Roberts', 'thyroid', '2023-06-01T00:00:00Z'),
      {
        id: 'TEST004013',
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
      },
      {
        id: 'TEST004014',
        testName: 'Iron Studies',
        testType: 'blood',
        requestedDate: '2023-05-20T00:00:00Z',
        sampleDate: '2023-05-20T09:30:00Z',
        reportDate: '2023-05-20T15:45:00Z',
        requestedBy: 'Dr. Helen Roberts',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Serum Iron',
            value: '8.2',
            unit: 'μmol/L',
            referenceRange: '11-30',
            flag: 'low'
          },
          {
            parameter: 'Ferritin',
            value: '18',
            unit: 'μg/L',
            referenceRange: '15-150',
            flag: 'low'
          },
          {
            parameter: 'Transferrin Saturation',
            value: '12',
            unit: '%',
            referenceRange: '20-50',
            flag: 'low'
          }
        ],
        interpretation: 'Iron deficiency. Consider iron supplementation and investigate cause.',
        notes: 'Check for GI bleeding, dietary assessment recommended'
      }
    ],
    medicationHistory: [
      ...createMedicationHistory('004', 'Dr. Helen Roberts', ['contraception', 'depression'], '2023-05-01T00:00:00Z'),
      {
        id: 'MED004020',
        name: 'Vitamin D3',
        dosage: '4000 IU',
        frequency: 'Once daily',
        prescribedDate: '2023-05-25T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Vitamin D deficiency',
        status: 'active',
        notes: 'Take with fatty meal for better absorption. Recheck levels in 3 months.'
      },
      {
        id: 'MED004021',
        name: 'Ferrous Fumarate',
        dosage: '210mg',
        frequency: 'Twice daily',
        prescribedDate: '2023-05-20T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Iron deficiency anaemia',
        status: 'active',
        notes: 'Take on empty stomach if tolerated, otherwise with food. May cause dark stools.'
      },
      {
        id: 'MED004022',
        name: 'Vitamin C',
        dosage: '500mg',
        frequency: 'Once daily with iron',
        prescribedDate: '2023-05-20T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'To enhance iron absorption',
        status: 'active',
        notes: 'Take together with iron supplement'
      },
      {
        id: 'MED004023',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed, max 3 times daily',
        prescribedDate: '2023-04-15T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Period pain',
        status: 'active',
        notes: 'Take with food. Do not exceed 1200mg in 24 hours.'
      }
    ],
    mhaSections: [
      {
        id: 'MHA004003',
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
        id: 'MHA004004',
        sectionNumber: '5(2)',
        sectionTitle: "Doctor's Holding Power",
        appliedDate: '2023-05-14T00:00:00Z',
        expiryDate: '2023-05-17T00:00:00Z',
        status: 'discharged',
        consultantResponsible: 'Dr. Rachel Martinez',
        hospital: 'Leeds General Infirmary',
        reason: 'Patient attempted to leave hospital during voluntary admission while still presenting risk to self.',
        notes: 'Used to prevent patient leaving until formal assessment could be completed. Patient agreed to continue voluntary treatment.'
      },
      {
        id: 'MHA004005',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2023-05-17T00:00:00Z',
        expiryDate: '2023-06-16T00:00:00Z',
        status: 'discharged',
        consultantResponsible: 'Dr. Rachel Martinez',
        hospital: 'Leeds General Infirmary',
        reason: 'Formal assessment required following deterioration in mental state. Patient lacking capacity to consent to admission.',
        reviewDate: '2023-05-24T00:00:00Z',
        notes: 'Patient responded well to medication adjustment. Discharged to community mental health team with weekly follow-up arranged.'
      },
      {
        id: 'MHA004006',
        sectionNumber: '17',
        sectionTitle: 'Community Treatment Order',
        appliedDate: '2023-06-20T00:00:00Z',
        expiryDate: '2024-06-20T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. Rachel Martinez',
        hospital: 'Leeds Community Mental Health Team',
        reason: 'To ensure ongoing compliance with medication and treatment in the community.',
        reviewDate: '2023-09-20T00:00:00Z',
        notes: 'Patient living independently with weekly mental health nurse visits. Good medication compliance.'
      }
    ]
  }
};
