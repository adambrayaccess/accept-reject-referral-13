
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

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
    allergies: [
      {
        id: 'ALLERGY005001',
        allergen: 'Amoxicillin',
        reaction: 'Widespread skin rash, mild breathing difficulty',
        severity: 'moderate',
        recordedDate: '2022-03-18T00:00:00Z',
        recordedBy: 'Dr. Lisa Brown',
        status: 'active',
        notes: 'Patient developed rash within 2 hours of first dose. Avoid all penicillin-based antibiotics.'
      },
      {
        id: 'ALLERGY005002',
        allergen: 'Tree nuts',
        reaction: 'Oral itching, lip swelling',
        severity: 'moderate',
        recordedDate: '2020-11-25T00:00:00Z',
        recordedBy: 'Dr. Andrew Wilson',
        status: 'active',
        notes: 'Particularly reactive to walnuts and hazelnuts. Patient carries antihistamines.'
      },
      {
        id: 'ALLERGY005003',
        allergen: 'Plasters/Adhesive tape',
        reaction: 'Contact dermatitis, skin irritation',
        severity: 'mild',
        recordedDate: '2019-06-12T00:00:00Z',
        recordedBy: 'Nurse Patricia Davis',
        status: 'active',
        notes: 'Use hypoallergenic tape for wound dressings and medical procedures.'
      },
      {
        id: 'ALLERGY005004',
        allergen: 'Iodine contrast',
        reaction: 'Nausea, mild hypotension',
        severity: 'moderate',
        recordedDate: '2021-09-08T00:00:00Z',
        recordedBy: 'Dr. Mark Thompson',
        status: 'active',
        notes: 'Reaction during CT scan with contrast. Pre-medication required for future contrast studies.'
      }
    ],
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
