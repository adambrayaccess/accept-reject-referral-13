
import { Patient } from '@/types/patient';

export const patient004: Patient = {
  id: 'P004',
  name: 'Emma Thompson',
  birthDate: '1990-03-15',
  gender: 'female',
  nhsNumber: '456 789 0123',
  address: '25 High Street, Leeds, LS1 4HG',
  phone: '07700 900234',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-10T10:30:00Z',
        news2: 0,
        temperature: 36.7,
        heartRate: 70,
        respiration: 14,
        oxygenSaturation: 98,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 75
      },
      {
        timestamp: '2023-06-09T15:20:00Z',
        news2: 1,
        temperature: 36.9,
        heartRate: 75,
        respiration: 16,
        oxygenSaturation: 97,
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 78
      },
      {
        timestamp: '2023-06-08T11:45:00Z',
        news2: 0,
        temperature: 36.6,
        heartRate: 68,
        respiration: 14,
        oxygenSaturation: 98,
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 72
      },
      {
        timestamp: '2023-06-07T09:15:00Z',
        news2: 2,
        temperature: 37.1,
        heartRate: 82,
        respiration: 18,
        oxygenSaturation: 96,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 82
      }
    ],
    testResults: [
      {
        id: 'TEST004',
        testName: 'Thyroid Function Tests',
        testType: 'blood',
        requestedDate: '2023-06-01T00:00:00Z',
        sampleDate: '2023-06-01T08:45:00Z',
        reportDate: '2023-06-01T15:20:00Z',
        requestedBy: 'Dr. Helen Roberts',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'TSH',
            value: '2.1',
            unit: 'mU/L',
            referenceRange: '0.5-4.0',
            flag: 'normal'
          },
          {
            parameter: 'Free T4',
            value: '14.8',
            unit: 'pmol/L',
            referenceRange: '10-25',
            flag: 'normal'
          },
          {
            parameter: 'Free T3',
            value: '4.2',
            unit: 'pmol/L',
            referenceRange: '3.5-6.5',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal thyroid function.',
        notes: 'Baseline assessment for mood symptoms'
      },
      {
        id: 'TEST012',
        testName: 'Full Blood Count',
        testType: 'blood',
        requestedDate: '2023-05-28T00:00:00Z',
        sampleDate: '2023-05-28T09:30:00Z',
        reportDate: '2023-05-28T16:15:00Z',
        requestedBy: 'Dr. Helen Roberts',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Haemoglobin',
            value: '12.8',
            unit: 'g/dL',
            referenceRange: '12.0-15.5',
            flag: 'normal'
          },
          {
            parameter: 'White Cell Count',
            value: '6.2',
            unit: '×10⁹/L',
            referenceRange: '4.0-11.0',
            flag: 'normal'
          },
          {
            parameter: 'Platelets',
            value: '275',
            unit: '×10⁹/L',
            referenceRange: '150-450',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal blood count parameters.',
        notes: 'Baseline before starting antidepressant therapy'
      },
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
      {
        id: 'MED009',
        name: 'Microgynon 30',
        dosage: '1 tablet',
        frequency: 'Once daily',
        prescribedDate: '2023-01-05T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Contraception',
        status: 'active',
        notes: 'Take at the same time each day'
      },
      {
        id: 'MED010',
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily in morning',
        prescribedDate: '2023-05-15T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Depression and anxiety',
        status: 'active',
        notes: 'Started 4 weeks ago, monitoring response and side effects'
      },
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
