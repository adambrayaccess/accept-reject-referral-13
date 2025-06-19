
import { Patient } from '@/types/patient';
import { patient001VitalSigns } from './patient-001/vital-signs';
import { patient001TestResults } from './patient-001/test-results';
import { patient001MedicationHistory } from './patient-001/medication-history';
import { Allergy } from '@/types/allergy';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';

const patient001Allergies: Allergy[] = [
  {
    id: 'ALG001001',
    allergen: 'Penicillin',
    type: 'drug',
    severity: 'severe',
    status: 'active',
    reactions: [
      { type: 'rash', description: 'Widespread urticaria' },
      { type: 'swelling', description: 'Facial swelling' }
    ],
    onsetDate: '2019-03-15T00:00:00Z',
    lastReactionDate: '2019-03-15T00:00:00Z',
    notes: 'Avoid all penicillin-based antibiotics. Patient carries medical alert card.',
    verificationStatus: 'confirmed',
    recordedBy: 'Dr. James Wilson',
    recordedDate: '2023-01-15T00:00:00Z'
  }
];

const patient001ReasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'standard',
  adjustments: [
    {
      id: 'RA001001',
      category: 'communication',
      description: 'Large print appointment letters',
      specificNeeds: 'Patient has mild visual impairment and prefers large print (14pt minimum) for all written communications.',
      implementationNotes: 'Use large print templates for appointment letters and information leaflets.',
      dateRecorded: '2023-01-15T00:00:00Z',
      recordedBy: 'Dr. James Wilson',
      reviewDate: '2024-01-15T00:00:00Z',
      status: 'active'
    },
    {
      id: 'RA001002',
      category: 'mobility',
      description: 'Ground floor appointments preferred',
      specificNeeds: 'Patient has difficulty with stairs due to arthritis. Prefers ground floor locations when possible.',
      implementationNotes: 'Book ground floor clinic rooms when available. Ensure lift access if upper floors required.',
      dateRecorded: '2023-01-15T00:00:00Z',
      recordedBy: 'Dr. James Wilson',
      reviewDate: '2024-01-15T00:00:00Z',
      status: 'active'
    }
  ],
  lastUpdated: '2023-01-15T00:00:00Z',
  updatedBy: 'Dr. James Wilson'
};

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1956-05-15',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '123 Main Street, London, SW1A 1AA',
  phone: '07700 900123',
  pronouns: 'he/him',
  ethnicity: 'White British',
  accommodationType: 'Owner Occupied',
  gpDetails: {
    id: 'GP001',
    name: 'Dr. Sarah Johnson',
    practice: 'London Primary Care Centre',
    address: '456 Healthcare Road, London, SW1A 2BB',
    phone: '020 7123 4567',
    email: 'sarah.johnson@londonprimary.nhs.uk'
  },
  pharmacies: [
    {
      id: 'PH001',
      name: 'Boots Pharmacy',
      address: '789 High Street, London, SW1A 3CC',
      phone: '020 7234 5678',
      email: 'london.highstreet@boots.co.uk',
      type: 'nominated'
    },
    {
      id: 'PH002',
      name: 'Lloyds Pharmacy',
      address: '321 Main Street, London, SW1A 4DD',
      phone: '020 7345 6789',
      type: 'linked'
    }
  ],
  relatedPeople: [
    {
      id: 'RP001',
      name: 'Mary Smith',
      relationship: 'spouse',
      phone: '07700 900124',
      email: 'mary.smith@email.com',
      address: '123 Main Street, London, SW1A 1AA',
      isPrimaryContact: true,
      isNextOfKin: true,
      isEmergencyContact: true
    },
    {
      id: 'RP002',
      name: 'David Smith',
      relationship: 'son',
      phone: '07700 900125',
      email: 'david.smith@email.com',
      isPrimaryContact: false,
      isNextOfKin: false,
      isEmergencyContact: true
    }
  ],
  historicAddresses: [
    {
      id: 'HA001',
      address: '789 Old Street, Birmingham, B1 1AA',
      dateFrom: '2010-01-01T00:00:00Z',
      dateTo: '2022-12-31T00:00:00Z',
      type: 'residential'
    },
    {
      id: 'HA002',
      address: '456 Previous Road, Manchester, M1 2BB',
      dateFrom: '2005-06-01T00:00:00Z',
      dateTo: '2009-12-31T00:00:00Z',
      type: 'residential'
    }
  ],
  medicalHistory: {
    vitalSigns: patient001VitalSigns,
    testResults: patient001TestResults,
    medicationHistory: patient001MedicationHistory,
    allergies: patient001Allergies
  },
  reasonableAdjustments: patient001ReasonableAdjustments
};
