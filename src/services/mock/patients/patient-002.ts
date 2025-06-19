
import { Patient } from '@/types/patient';
import { patient002VitalSigns } from './patient-002/vital-signs';
import { patient002TestResults } from './patient-002/test-results';
import { patient002MedicationHistory } from './patient-002/medication-history';
import { patient002MHASections } from './patient-002/mha-sections';
import { Allergy } from '@/types/allergy';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';

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

const patient002ReasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'complex',
  adjustments: [
    {
      id: 'RA002001',
      category: 'communication',
      description: 'British Sign Language interpreter required',
      specificNeeds: 'Patient is profoundly deaf and communicates primarily through BSL. Requires qualified BSL interpreter for all appointments.',
      implementationNotes: 'Book BSL interpreter minimum 48 hours in advance. Patient prefers face-to-face communication when interpreter present.',
      dateRecorded: '2023-01-15T00:00:00Z',
      recordedBy: 'Dr. Emma Wilson',
      reviewDate: '2024-01-15T00:00:00Z',
      status: 'active'
    },
    {
      id: 'RA002002',
      category: 'mobility',
      description: 'Wheelchair accessible facilities required',
      specificNeeds: 'Patient uses manual wheelchair. Requires accessible parking, ramp access, and wheelchair-accessible examination room.',
      implementationNotes: 'Ensure ground floor appointments or lift access. Adjustable height examination table needed.',
      dateRecorded: '2023-01-15T00:00:00Z',
      recordedBy: 'Dr. Emma Wilson',
      reviewDate: '2024-01-15T00:00:00Z',
      status: 'active'
    },
    {
      id: 'RA002003',
      category: 'mental-health',
      description: 'Anxiety support during procedures',
      specificNeeds: 'Patient experiences severe anxiety during medical procedures. May require additional time and calm environment.',
      implementationNotes: 'Allow extra appointment time. Offer breaks during procedures. Consider pre-procedure anxiety medication if appropriate.',
      dateRecorded: '2023-02-20T00:00:00Z',
      recordedBy: 'Dr. Sarah Collins',
      reviewDate: '2024-02-20T00:00:00Z',
      status: 'active'
    }
  ],
  lastUpdated: '2023-02-20T00:00:00Z',
  updatedBy: 'Dr. Sarah Collins'
};

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Davis',
  birthDate: '1992-08-20',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '456 Queen Street, Manchester, M1 1AA',
  phone: '07700 900345',
  pronouns: 'she/her',
  ethnicity: 'Mixed White and Black Caribbean',
  accommodationType: 'Rented - Housing Association',
  gpDetails: {
    id: 'GP002',
    name: 'Dr. Michael Brown',
    practice: 'Manchester Family Medical Centre',
    address: '123 Care Street, Manchester, M1 2CC',
    phone: '0161 123 4567',
    email: 'michael.brown@manchesterfamily.nhs.uk'
  },
  pharmacies: [
    {
      id: 'PH003',
      name: 'Well Pharmacy',
      address: '567 Queen Street, Manchester, M1 3DD',
      phone: '0161 234 5678',
      email: 'manchester.queen@well.co.uk',
      type: 'nominated'
    }
  ],
  relatedPeople: [
    {
      id: 'RP003',
      name: 'James Davis',
      relationship: 'partner',
      phone: '07700 900346',
      email: 'james.davis@email.com',
      address: '456 Queen Street, Manchester, M1 1AA',
      isPrimaryContact: true,
      isNextOfKin: true,
      isEmergencyContact: true
    },
    {
      id: 'RP004',
      name: 'Linda Wilson',
      relationship: 'mother',
      phone: '07700 900347',
      isPrimaryContact: false,
      isNextOfKin: false,
      isEmergencyContact: true
    }
  ],
  accessRestriction: {
    isRestricted: true,
    level: 'standard',
    reason: 'Previous incident of verbal aggression towards staff when anxious',
    appliedDate: '2023-03-01T00:00:00Z',
    appliedBy: 'Dr. Emma Wilson',
    reviewDate: '2024-03-01T00:00:00Z',
    notes: 'Patient responds well when approached calmly and given time to process information. Not a safety risk when proper protocols followed.'
  },
  historicAddresses: [
    {
      id: 'HA003',
      address: '789 Former Street, Liverpool, L1 1AA',
      dateFrom: '2018-01-01T00:00:00Z',
      dateTo: '2022-05-31T00:00:00Z',
      type: 'residential'
    }
  ],
  medicalHistory: {
    vitalSigns: patient002VitalSigns,
    testResults: patient002TestResults,
    medicationHistory: patient002MedicationHistory,
    mhaSections: patient002MHASections,
    allergies: patient002Allergies
  },
  reasonableAdjustments: patient002ReasonableAdjustments
};
