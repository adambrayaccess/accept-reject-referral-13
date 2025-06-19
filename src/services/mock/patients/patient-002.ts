
import { Patient } from '@/types/patient';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';
import { MedicalHistory } from '@/types/medical';

// Import medical history data
import { patient002MedicationHistory } from './patient-002/medication-history';
import { patient002TestResults } from './patient-002/test-results';
import { patient002VitalSigns } from './patient-002/vital-signs';
import { patient002MHASections } from './patient-002/mha-sections';

const medicalHistory: MedicalHistory = {
  conditions: [
    {
      id: 'cond-002-001',
      name: 'Hypertension',
      status: 'active',
      diagnosedDate: '2020-03-15',
      severity: 'moderate'
    },
    {
      id: 'cond-002-002', 
      name: 'Type 2 Diabetes',
      status: 'active',
      diagnosedDate: '2019-08-22',
      severity: 'mild'
    }
  ],
  allergies: [
    {
      id: 'allergy-002-001',
      allergen: 'Shellfish',
      type: 'food',
      severity: 'moderate',
      status: 'active',
      reactions: [
        {
          type: 'hives',
          description: 'Hives and itching'
        }
      ],
      recordedDate: '2018-05-10',
      recordedBy: 'Dr. Thompson',
      verificationStatus: 'confirmed',
      notes: 'Patient reports reaction to prawns and crab'
    }
  ],
  medications: patient002MedicationHistory,
  vitalSigns: patient002VitalSigns,
  testResults: patient002TestResults,
  mhaSections: patient002MHASections
};

const reasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'standard',
  lastUpdated: '2024-01-10T14:30:00Z',
  updatedBy: 'Dr. Sarah Johnson',
  adjustments: [
    {
      id: 'adj-002-001',
      category: 'communication',
      description: 'Large print materials required',
      specificNeeds: 'Patient has mild visual impairment and requires all written materials in 14pt font or larger',
      implementationNotes: 'Ensure all appointment letters, information leaflets, and consent forms are provided in large print format',
      status: 'active',
      dateRecorded: '2024-01-10T14:30:00Z',
      recordedBy: 'Dr. Sarah Johnson',
      reviewDate: '2025-01-10T00:00:00Z'
    }
  ]
};

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Williams',
  birthDate: '1982-09-23',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '42 Park Avenue, Birmingham, B15 2TT',
  phone: '07700 900456',
  pronouns: 'she/her',
  ethnicity: 'White British',
  accommodationType: 'Owner occupied house',
  medicalHistory,
  reasonableAdjustments,
  gpDetails: {
    id: 'GP002',
    name: 'Dr. Michael Thompson',
    practice: 'Birmingham Medical Centre',
    address: '15 High Street, Birmingham, B1 1AA',
    phone: '0121 234 5678',
    email: 'reception@birminghammedical.nhs.uk'
  },
  pharmacies: [
    {
      id: 'PHARM002',
      name: 'Boots Pharmacy Birmingham',
      address: '25 New Street, Birmingham, B2 4QA',
      phone: '0121 345 6789',
      email: 'birmingham@boots.co.uk',
      type: 'nominated'
    },
    {
      id: 'PHARM003',
      name: 'Lloyds Pharmacy Park Avenue',
      address: '88 Park Avenue, Birmingham, B15 3TT',
      phone: '0121 456 7890',
      type: 'linked'
    }
  ],
  relatedPeople: [
    {
      id: 'REL002-001',
      name: 'David Williams',
      relationship: 'spouse',
      phone: '07700 900457',
      email: 'david.williams@email.com',
      address: '42 Park Avenue, Birmingham, B15 2TT',
      isPrimaryContact: true,
      isNextOfKin: true,
      isEmergencyContact: true
    },
    {
      id: 'REL002-002',
      name: 'Emily Williams',
      relationship: 'daughter',
      phone: '07700 900458',
      email: 'emily.williams@email.com',
      isPrimaryContact: false,
      isNextOfKin: false,
      isEmergencyContact: true
    }
  ],
  historicAddresses: [
    {
      id: 'ADDR002-001',
      address: '18 Victoria Road, Birmingham, B12 9QR',
      dateFrom: '2015-06-01',
      dateTo: '2020-08-15',
      type: 'residential'
    },
    {
      id: 'ADDR002-002', 
      address: '5 Church Lane, Solihull, B91 3DL',
      dateFrom: '2010-03-01',
      dateTo: '2015-05-31',
      type: 'residential'
    }
  ],
  accessRestriction: {
    isRestricted: false
  }
};
