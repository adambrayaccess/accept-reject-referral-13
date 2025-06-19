
import { Patient } from '@/types/patient';
import { patient002VitalSigns } from './patient-002/vital-signs';
import { patient002TestResults } from './patient-002/test-results';
import { patient002MedicationHistory } from './patient-002/medication-history';
import { patient002MHASections } from './patient-002/mha-sections';
import { Allergy } from '@/types/allergy';

const patient002Allergies: Allergy[] = [
  {
    id: 'ALG002001',
    allergen: 'Aspirin',
    type: 'drug',
    severity: 'life-threatening',
    status: 'active',
    reactions: [
      { type: 'anaphylaxis', description: 'Systemic anaphylactic reaction' },
      { type: 'breathing_difficulty', description: 'Severe bronchospasm' },
      { type: 'swelling', description: 'Laryngeal edema' }
    ],
    onsetDate: '2020-01-15T00:00:00Z',
    lastReactionDate: '2020-01-15T00:00:00Z',
    notes: 'LIFE-THREATENING: Patient experienced anaphylaxis requiring emergency treatment. Avoid all NSAIDs and salicylates. Patient carries EpiPen.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. Emma Wilson',
    recordedDate: '2023-02-01T00:00:00Z'
  },
  {
    id: 'ALG002002',
    allergen: 'Latex',
    type: 'contact',
    severity: 'moderate',
    status: 'active',
    reactions: [
      { type: 'rash', description: 'Contact dermatitis' },
      { type: 'hives', description: 'Localized urticaria' }
    ],
    onsetDate: '2018-09-20T00:00:00Z',
    lastReactionDate: '2022-05-10T00:00:00Z',
    notes: 'Healthcare provider should use latex-free gloves and equipment.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. Emma Wilson',
    recordedDate: '2023-02-01T00:00:00Z'
  },
  {
    id: 'ALG002003',
    allergen: 'Peanuts',
    type: 'food',
    severity: 'severe',
    status: 'active',
    reactions: [
      { type: 'swelling', description: 'Lip and tongue swelling' },
      { type: 'breathing_difficulty', description: 'Wheezing' },
      { type: 'hives', description: 'Generalized urticaria' }
    ],
    onsetDate: '2016-04-12T00:00:00Z',
    lastReactionDate: '2021-11-08T00:00:00Z',
    notes: 'Severe reaction requiring emergency treatment. Patient avoids all nuts and carries EpiPen.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. Emma Wilson',
    recordedDate: '2023-02-01T00:00:00Z'
  }
];

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
    allergies: patient002Allergies
  }
};
