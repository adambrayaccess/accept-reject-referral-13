
import { Patient } from '@/types/patient';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';
import { MedicalHistory } from '@/types/medical';
import { Allergy } from '@/types/allergy';

const patient003ReasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'standard',
  adjustments: [
    {
      id: 'RA003001',
      category: 'sensory',
      description: 'Large print materials required',
      specificNeeds: 'Patient has visual impairment and requires all written materials in large print (minimum 16pt font).',
      implementationNotes: 'Prepare appointment letters and information sheets in large print format. Ensure good lighting in consultation room.',
      dateRecorded: '2023-03-10T00:00:00Z',
      recordedBy: 'Dr. Michael Thompson',
      reviewDate: '2024-03-10T00:00:00Z',
      status: 'active'
    }
  ],
  lastUpdated: '2023-03-10T00:00:00Z',
  updatedBy: 'Dr. Michael Thompson'
};

const patient003Allergies: Allergy[] = [
  {
    id: 'ALL003001',
    allergen: 'Penicillin',
    type: 'drug',
    severity: 'severe',
    status: 'active',
    reactions: [
      { type: 'rash', description: 'Widespread skin rash' },
      { type: 'swelling', description: 'Facial swelling' }
    ],
    onsetDate: '2015-08-15T00:00:00Z',
    lastReactionDate: '2015-08-15T00:00:00Z',
    notes: 'Patient developed severe allergic reaction to penicillin during treatment for pneumonia. Avoid all penicillin-based antibiotics.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. Sarah Wilson',
    recordedDate: '2015-08-16T00:00:00Z'
  },
  {
    id: 'ALL003002',
    allergen: 'Latex',
    type: 'contact',
    severity: 'moderate',
    status: 'active',
    reactions: [
      { type: 'hives', description: 'Localized hives on contact' },
      { type: 'rash', description: 'Contact dermatitis' }
    ],
    onsetDate: '2018-03-20T00:00:00Z',
    lastReactionDate: '2022-11-05T00:00:00Z',
    notes: 'Patient experiences contact dermatitis when exposed to latex products. Use latex-free gloves and equipment.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. Michael Thompson',
    recordedDate: '2018-03-21T00:00:00Z'
  }
];

const patient003MedicalHistory: MedicalHistory = {
  vitalSigns: [],
  allergies: patient003Allergies
};

export const patient003: Patient = {
  id: 'P003',
  name: 'Alice Johnson',
  birthDate: '1978-11-30',
  gender: 'female',
  nhsNumber: '345 678 9012',
  address: '789 King Road, Birmingham, B1 2BB',
  phone: '07700 900456',
  pronouns: 'she/her',
  ethnicity: 'White British',
  accommodationType: 'Owner Occupied',
  reasonableAdjustments: patient003ReasonableAdjustments,
  medicalHistory: patient003MedicalHistory,
  gpDetails: {
    id: 'GP003',
    name: 'Dr. Robert Chen',
    practice: 'Birmingham Medical Centre',
    address: '456 Healthcare Avenue, Birmingham, B1 3CC',
    phone: '0121 456 7890',
    email: 'r.chen@birminghammedical.nhs.uk'
  },
  pharmacies: [
    {
      id: 'PHARM003001',
      name: 'Birmingham Central Pharmacy',
      address: '123 High Street, Birmingham, B1 1AA',
      phone: '0121 123 4567',
      email: 'info@birminghamcentral.pharmacy',
      type: 'nominated'
    },
    {
      id: 'PHARM003002',
      name: 'Health Plus Pharmacy',
      address: '45 Church Street, Birmingham, B1 2CC',
      phone: '0121 234 5678',
      type: 'linked'
    }
  ],
  relatedPeople: [
    {
      id: 'REL003001',
      name: 'Michael Johnson',
      relationship: 'spouse',
      phone: '07700 900789',
      email: 'm.johnson@email.com',
      address: '789 King Road, Birmingham, B1 2BB',
      isPrimaryContact: true,
      isNextOfKin: true,
      isEmergencyContact: true
    },
    {
      id: 'REL003002',
      name: 'Sarah Johnson',
      relationship: 'daughter',
      phone: '07700 900321',
      email: 's.johnson@email.com',
      isPrimaryContact: false,
      isNextOfKin: false,
      isEmergencyContact: true
    }
  ],
  accessRestriction: {
    isRestricted: true,
    level: 'standard',
    reason: 'Previous incident with aggressive behavior during mental health episode',
    appliedDate: '2023-05-15T00:00:00Z',
    appliedBy: 'Security Team',
    reviewDate: '2024-05-15T00:00:00Z',
    notes: 'Patient requires additional support person present during appointments. No restrictions on medical care.'
  },
  historicAddresses: [
    {
      id: 'ADDR003001',
      address: '12 Oak Street, Birmingham, B2 1DD',
      dateFrom: '2020-01-01T00:00:00Z',
      dateTo: '2023-06-30T00:00:00Z',
      type: 'residential'
    },
    {
      id: 'ADDR003002',
      address: '56 Elm Avenue, Birmingham, B3 2EE',
      dateFrom: '2018-03-15T00:00:00Z',
      dateTo: '2019-12-31T00:00:00Z',
      type: 'residential'
    }
  ]
};
