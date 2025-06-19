
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';
import { createPatientAllergies } from '../shared/allergies';

export const patient005: Patient = {
  id: 'P005',
  name: 'David Wilson',
  birthDate: '1988-07-22',
  gender: 'male',
  nhsNumber: '567 890 1234',
  address: '456 Elm Street, Manchester, M1 1AA',
  phone: '07700 900567',
  gpDetails: {
    id: 'GP005',
    name: 'Dr. Sarah Thompson',
    practice: 'Manchester Medical Centre',
    address: '789 High Street, Manchester, M1 2BB',
    phone: '0161 234 5678',
    email: 'sarah.thompson@manchestermedical.nhs.uk'
  },
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-08-10T00:00:00Z', 'stable'),
    testResults: [
      ...createCommonTestResults('005', 'Dr. Lisa Brown', '2023-08-05T00:00:00Z'),
      ...createSpecializedTestResults('005', 'Dr. Lisa Brown', 'cardiac', '2023-08-05T00:00:00Z')
    ],
    medicationHistory: createMedicationHistory('005', 'Dr. Lisa Brown', ['depression'], '2023-08-01T00:00:00Z'),
    allergies: createPatientAllergies('P005', 'Dr. Lisa Brown', '2023-08-01T00:00:00Z'),
    mhaSections: [
      {
        id: 'MHA005001',
        sectionNumber: '4',
        sectionTitle: 'Admission for Assessment in Emergency',
        appliedDate: '2023-07-05T00:00:00Z',
        expiryDate: '2023-07-07T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Andrew Wilson',
        hospital: 'Manchester Royal Infirmary',
        reason: 'Emergency admission due to acute manic episode with risk to self and property damage.',
        notes: 'Converted to Section 2 after 72 hours for full assessment.'
      },
      {
        id: 'MHA005002',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2023-07-07T00:00:00Z',
        expiryDate: '2023-08-05T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Andrew Wilson',
        hospital: 'Manchester Royal Infirmary',
        reason: 'Continued assessment required following Section 4. Bipolar disorder with severe manic episode.',
        reviewDate: '2023-07-21T00:00:00Z',
        notes: 'Patient stabilized on lithium and olanzapine. Discharged with community support.'
      },
      {
        id: 'MHA005003',
        sectionNumber: '7',
        sectionTitle: 'Guardianship',
        appliedDate: '2023-08-10T00:00:00Z',
        expiryDate: '2024-08-10T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. Andrew Wilson',
        hospital: 'Manchester Social Services',
        reason: 'Ongoing support needed for mental health management and ensuring compliance with treatment.',
        reviewDate: '2023-11-10T00:00:00Z',
        notes: 'Guardian appointed to ensure medication compliance and attendance at appointments.'
      }
    ]
  }
};
