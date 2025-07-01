
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createMedicationHistory } from '../shared/medications';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createAllergies } from '../shared/allergies';

export interface PatientProfile {
  demographics: {
    ageRange: [number, number];
    gender: 'male' | 'female';
    ethnicity: string;
    maritalStatus: string;
    accommodationType: string;
  };
  clinical: {
    conditions: Array<'hypertension' | 'diabetes' | 'depression' | 'contraception' | 'cholesterol'>;
    vitalProfile: 'healthy' | 'hypertensive' | 'stable' | 'monitoring';
    specialtyTests?: 'cardiac' | 'diabetes' | 'thyroid' | 'renal';
  };
  accessibility: {
    hasAdjustments: boolean;
    flagLevel?: 'low' | 'medium' | 'high';
    adjustmentTypes?: string[];
  };
  social: {
    hasGP: boolean;
    hasPharmacy: boolean;
    hasRelatedPeople: boolean;
    hasHistoricAddresses: boolean;
    hasAccessRestriction: boolean;
  };
}

const PATIENT_PROFILES: PatientProfile[] = [
  // Elderly patients with complex conditions
  {
    demographics: { ageRange: [75, 85], gender: 'male', ethnicity: 'White British', maritalStatus: 'married', accommodationType: 'Own Home' },
    clinical: { conditions: ['hypertension', 'diabetes', 'cholesterol'], vitalProfile: 'monitoring', specialtyTests: 'cardiac' },
    accessibility: { hasAdjustments: true, flagLevel: 'medium', adjustmentTypes: ['mobility', 'hearing'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [70, 80], gender: 'female', ethnicity: 'White Irish', maritalStatus: 'widowed', accommodationType: 'Sheltered Housing' },
    clinical: { conditions: ['hypertension', 'cholesterol'], vitalProfile: 'stable', specialtyTests: 'renal' },
    accessibility: { hasAdjustments: true, flagLevel: 'high', adjustmentTypes: ['mobility', 'visual', 'communication'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: false }
  },
  
  // Middle-aged patients with chronic conditions
  {
    demographics: { ageRange: [45, 55], gender: 'male', ethnicity: 'Asian Pakistani', maritalStatus: 'married', accommodationType: 'Own Home' },
    clinical: { conditions: ['diabetes', 'hypertension'], vitalProfile: 'monitoring', specialtyTests: 'diabetes' },
    accessibility: { hasAdjustments: false },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [50, 60], gender: 'female', ethnicity: 'Black Caribbean', maritalStatus: 'divorced', accommodationType: 'Own Home' },
    clinical: { conditions: ['depression', 'hypertension'], vitalProfile: 'stable', specialtyTests: 'thyroid' },
    accessibility: { hasAdjustments: true, flagLevel: 'low', adjustmentTypes: ['communication'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  
  // Young adults with various conditions
  {
    demographics: { ageRange: [25, 35], gender: 'female', ethnicity: 'White British', maritalStatus: 'single', accommodationType: 'Rented' },
    clinical: { conditions: ['contraception'], vitalProfile: 'healthy' },
    accessibility: { hasAdjustments: false },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [30, 40], gender: 'male', ethnicity: 'Mixed White and Asian', maritalStatus: 'married', accommodationType: 'Own Home' },
    clinical: { conditions: ['depression'], vitalProfile: 'stable' },
    accessibility: { hasAdjustments: true, flagLevel: 'medium', adjustmentTypes: ['communication', 'mental health'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: true }
  },
  
  // Patients with complex accessibility needs
  {
    demographics: { ageRange: [35, 45], gender: 'female', ethnicity: 'Asian Indian', maritalStatus: 'married', accommodationType: 'Adapted Housing' },
    clinical: { conditions: ['hypertension'], vitalProfile: 'stable' },
    accessibility: { hasAdjustments: true, flagLevel: 'high', adjustmentTypes: ['mobility', 'visual', 'communication', 'cognitive'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [40, 50], gender: 'male', ethnicity: 'White Other', maritalStatus: 'single', accommodationType: 'Supported Living' },
    clinical: { conditions: ['diabetes', 'depression'], vitalProfile: 'monitoring', specialtyTests: 'diabetes' },
    accessibility: { hasAdjustments: true, flagLevel: 'high', adjustmentTypes: ['cognitive', 'communication', 'mobility'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: false }
  },
  
  // Patients with access restrictions
  {
    demographics: { ageRange: [28, 38], gender: 'female', ethnicity: 'Black African', maritalStatus: 'single', accommodationType: 'Temporary' },
    clinical: { conditions: ['depression'], vitalProfile: 'monitoring' },
    accessibility: { hasAdjustments: true, flagLevel: 'medium', adjustmentTypes: ['communication', 'mental health'] },
    social: { hasGP: true, hasPharmacy: false, hasRelatedPeople: false, hasHistoricAddresses: true, hasAccessRestriction: true }
  },
  {
    demographics: { ageRange: [35, 45], gender: 'male', ethnicity: 'White British', maritalStatus: 'divorced', accommodationType: 'Rented' },
    clinical: { conditions: ['hypertension', 'depression'], vitalProfile: 'stable' },
    accessibility: { hasAdjustments: false },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: false, hasHistoricAddresses: true, hasAccessRestriction: true }
  },
  
  // Patients with comprehensive medical histories
  {
    demographics: { ageRange: [60, 70], gender: 'female', ethnicity: 'Chinese', maritalStatus: 'married', accommodationType: 'Own Home' },
    clinical: { conditions: ['hypertension', 'diabetes', 'cholesterol'], vitalProfile: 'monitoring', specialtyTests: 'cardiac' },
    accessibility: { hasAdjustments: true, flagLevel: 'low', adjustmentTypes: ['communication'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [55, 65], gender: 'male', ethnicity: 'Asian Bangladeshi', maritalStatus: 'married', accommodationType: 'Own Home' },
    clinical: { conditions: ['diabetes', 'hypertension', 'cholesterol'], vitalProfile: 'monitoring', specialtyTests: 'renal' },
    accessibility: { hasAdjustments: false },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: false }
  },
  
  // Young patients with specific conditions
  {
    demographics: { ageRange: [22, 32], gender: 'female', ethnicity: 'Mixed White and Black Caribbean', maritalStatus: 'single', accommodationType: 'Rented' },
    clinical: { conditions: ['contraception', 'depression'], vitalProfile: 'healthy' },
    accessibility: { hasAdjustments: true, flagLevel: 'low', adjustmentTypes: ['mental health'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: true, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  {
    demographics: { ageRange: [26, 36], gender: 'male', ethnicity: 'Other', maritalStatus: 'single', accommodationType: 'Shared' },
    clinical: { conditions: ['depression'], vitalProfile: 'stable' },
    accessibility: { hasAdjustments: true, flagLevel: 'medium', adjustmentTypes: ['communication', 'mental health'] },
    social: { hasGP: true, hasPharmacy: true, hasRelatedPeople: false, hasHistoricAddresses: true, hasAccessRestriction: false }
  },
  
  // Patients with minimal medical history
  {
    demographics: { ageRange: [18, 28], gender: 'female', ethnicity: 'White British', maritalStatus: 'single', accommodationType: 'Student' },
    clinical: { conditions: ['contraception'], vitalProfile: 'healthy' },
    accessibility: { hasAdjustments: false },
    social: { hasGP: true, hasPharmacy: false, hasRelatedPeople: true, hasHistoricAddresses: false, hasAccessRestriction: false }
  }
];

const FIRST_NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
};

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];

const UK_ADDRESSES = [
  '123 High Street, London, SW1A 1AA',
  '45 Victoria Road, Birmingham, B1 3HH',
  '78 Queens Avenue, Manchester, M1 2AB',
  '32 Church Lane, Bristol, BS1 4DE',
  '156 King Street, Leeds, LS1 3GH',
  '89 Mill Road, Glasgow, G1 5JK',
  '234 Park View, Edinburgh, EH1 6LM',
  '67 Oak Drive, Cardiff, CF10 2NP',
  '145 Elm Close, Liverpool, L1 8QR',
  '298 Maple Gardens, Sheffield, S1 7ST',
  '43 Pine Avenue, Newcastle, NE1 4UV',
  '187 Cedar Street, Nottingham, NG1 6WX',
  '76 Birch Road, Southampton, SO14 9YZ',
  '321 Willow Court, Plymouth, PL1 2BC',
  '254 Ash Lane, Portsmouth, PO1 3DE'
];

const PHONE_NUMBERS = [
  '07700 900123', '07700 900456', '07700 900789', '07700 900234', '07700 900567',
  '07700 900890', '07700 900345', '07700 900678', '07700 900901', '07700 900432',
  '07700 900765', '07700 900198', '07700 900876', '07700 900543', '07700 900210'
];

const GP_PRACTICES = [
  { name: 'Dr. Sarah Wilson', practice: 'Riverside Medical Centre', address: '12 River Street, London, SW1 2AB', phone: '020 7123 4567', email: 'reception@riverside-medical.nhs.uk' },
  { name: 'Dr. James Thompson', practice: 'Oakfield Surgery', address: '45 Oak Road, Birmingham, B2 3CD', phone: '0121 456 7890', email: 'admin@oakfield-surgery.nhs.uk' },
  { name: 'Dr. Emily Davis', practice: 'Park View Health Centre', address: '78 Park Lane, Manchester, M3 4EF', phone: '0161 789 0123', email: 'info@parkview-health.nhs.uk' },
  { name: 'Dr. Michael Brown', practice: 'Central Family Practice', address: '23 Central Avenue, Bristol, BS4 5GH', phone: '0117 234 5678', email: 'reception@central-family.nhs.uk' },
  { name: 'Dr. Lisa Garcia', practice: 'Hillside Medical Group', address: '56 Hill Street, Leeds, LS5 6IJ', phone: '0113 567 8901', email: 'admin@hillside-medical.nhs.uk' }
];

const PHARMACY_DETAILS = [
  { name: 'Lloyds Pharmacy', address: '89 High Street, London, SW1 3AB', phone: '020 7234 5678', email: 'london.highst@lloydspharmacy.co.uk' },
  { name: 'Boots Pharmacy', address: '34 Market Square, Birmingham, B1 2CD', phone: '0121 345 6789', email: 'birmingham.market@boots.co.uk' },
  { name: 'Well Pharmacy', address: '67 King Street, Manchester, M1 3EF', phone: '0161 456 7890', email: 'manchester.king@well.co.uk' },
  { name: 'Superdrug Pharmacy', address: '12 Queen Street, Bristol, BS1 4GH', phone: '0117 567 8901', email: 'bristol.queen@superdrug.com' },
  { name: 'Independent Pharmacy', address: '45 Church Road, Leeds, LS1 5IJ', phone: '0113 678 9012', email: 'info@independent-pharmacy.co.uk' }
];

export class PatientDataGenerator {
  private static generateNHSNumber(): string {
    // Generate a valid NHS number format (3 digits + space + 3 digits + space + 4 digits)
    const part1 = Math.floor(Math.random() * 900) + 100;
    const part2 = Math.floor(Math.random() * 900) + 100;
    const part3 = Math.floor(Math.random() * 9000) + 1000;
    return `${part1} ${part2} ${part3}`;
  }

  private static generateBirthDate(ageRange: [number, number]): string {
    const currentYear = new Date().getFullYear();
    const minAge = ageRange[0];
    const maxAge = ageRange[1];
    const birthYear = currentYear - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private static generateRelatedPeople(patientId: string): any[] {
    const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Carer'];
    const count = Math.floor(Math.random() * 3) + 1;
    const relatedPeople = [];

    for (let i = 0; i < count; i++) {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      relatedPeople.push({
        id: `RP${patientId}${i + 1}`,
        name: `${firstName} ${lastName}`,
        relationship: relationships[Math.floor(Math.random() * relationships.length)],
        phone: PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)],
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        address: UK_ADDRESSES[Math.floor(Math.random() * UK_ADDRESSES.length)],
        isPrimaryContact: i === 0,
        isNextOfKin: i === 0 && Math.random() > 0.5,
        isEmergencyContact: Math.random() > 0.5
      });
    }

    return relatedPeople;
  }

  private static generateHistoricAddresses(patientId: string): any[] {
    const addressTypes = ['residential', 'temporary', 'correspondence'];
    const count = Math.floor(Math.random() * 2) + 1;
    const historicAddresses = [];

    for (let i = 0; i < count; i++) {
      const yearsAgo = Math.floor(Math.random() * 10) + 1;
      const fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - yearsAgo);
      
      const toDate = new Date(fromDate);
      toDate.setFullYear(toDate.getFullYear() + Math.floor(Math.random() * 3) + 1);

      historicAddresses.push({
        id: `HA${patientId}${i + 1}`,
        address: UK_ADDRESSES[Math.floor(Math.random() * UK_ADDRESSES.length)],
        dateFrom: fromDate.toISOString().split('T')[0],
        dateTo: toDate.toISOString().split('T')[0],
        type: addressTypes[Math.floor(Math.random() * addressTypes.length)]
      });
    }

    return historicAddresses;
  }

  private static generateReasonableAdjustments(profile: PatientProfile): any {
    if (!profile.accessibility.hasAdjustments) return undefined;

    const adjustmentDetails = {
      mobility: 'Wheelchair access required, ground floor appointments preferred',
      visual: 'Large print materials needed, good lighting required',
      hearing: 'BSL interpreter may be required, written instructions helpful',
      communication: 'Extra time needed for appointments, simple language preferred',
      cognitive: 'Memory aids helpful, family member support welcome',
      'mental health': 'Quiet waiting area preferred, flexible appointment times'
    };

    const adjustments = profile.accessibility.adjustmentTypes?.map(type => ({
      category: type,
      description: adjustmentDetails[type] || `${type} support required`,
      specificNeeds: `Patient requires ${type} accommodations`,
      implementationNotes: `Staff briefed on ${type} requirements`,
      status: 'active',
      dateRecorded: new Date().toISOString(),
      recordedBy: 'Clinical Team',
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    })) || [];

    return {
      hasAdjustments: true,
      flagLevel: profile.accessibility.flagLevel,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Clinical Team',
      adjustments
    };
  }

  private static generateAccessRestriction(): any {
    const restrictions = [
      { level: 'Level 1', reason: 'Staff safety concerns', appliedBy: 'Security Team' },
      { level: 'Level 2', reason: 'Confidentiality requirements', appliedBy: 'Data Protection Officer' },
      { level: 'Level 3', reason: 'Legal proceedings', appliedBy: 'Legal Department' }
    ];

    const restriction = restrictions[Math.floor(Math.random() * restrictions.length)];
    const appliedDate = new Date();
    appliedDate.setMonth(appliedDate.getMonth() - Math.floor(Math.random() * 6));

    const reviewDate = new Date(appliedDate);
    reviewDate.setMonth(reviewDate.getMonth() + 6);

    return {
      isRestricted: true,
      level: restriction.level,
      reason: restriction.reason,
      appliedBy: restriction.appliedBy,
      appliedDate: appliedDate.toISOString(),
      reviewDate: reviewDate.toISOString(),
      notes: 'Regular review required'
    };
  }

  static generatePatient(index: number): Patient {
    const profile = PATIENT_PROFILES[index];
    const patientId = `P${(index + 6).toString().padStart(3, '0')}`;
    
    // Generate basic demographics
    const gender = profile.demographics.gender;
    const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const birthDate = this.generateBirthDate(profile.demographics.ageRange);
    const baseDate = new Date().toISOString().split('T')[0];

    // Generate GP details
    const gp = GP_PRACTICES[Math.floor(Math.random() * GP_PRACTICES.length)];
    const gpDetails = profile.social.hasGP ? {
      id: `GP${patientId}`,
      name: gp.name,
      practice: gp.practice,
      address: gp.address,
      phone: gp.phone,
      email: gp.email
    } : undefined;

    // Generate pharmacy details
    const pharmacy = PHARMACY_DETAILS[Math.floor(Math.random() * PHARMACY_DETAILS.length)];
    const pharmacies = profile.social.hasPharmacy ? [{
      id: `PH${patientId}`,
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      email: pharmacy.email,
      type: 'nominated' as const
    }] : undefined;

    // Generate medical history
    const vitalSigns = createVitalSignsSequence(baseDate, profile.clinical.vitalProfile);
    const medications = createMedicationHistory(patientId, gp?.name || 'Dr. Unknown', profile.clinical.conditions, baseDate);
    const testResults = [
      ...createCommonTestResults(patientId, gp?.name || 'Dr. Unknown', baseDate),
      ...(profile.clinical.specialtyTests ? createSpecializedTestResults(patientId, gp?.name || 'Dr. Unknown', profile.clinical.specialtyTests, baseDate) : [])
    ];
    const allergies = Math.random() > 0.7 ? createAllergies(patientId) : undefined;

    const patient: Patient = {
      id: patientId,
      name: `${firstName} ${lastName}`,
      birthDate,
      gender,
      nhsNumber: this.generateNHSNumber(),
      address: UK_ADDRESSES[Math.floor(Math.random() * UK_ADDRESSES.length)],
      phone: PHONE_NUMBERS[Math.floor(Math.random() * PHONE_NUMBERS.length)],
      // FHIR fields
      fhirId: `Patient/${patientId}`,
      active: true,
      maritalStatus: profile.demographics.maritalStatus,
      ethnicity: profile.demographics.ethnicity,
      accommodationType: profile.demographics.accommodationType,
      // Medical history
      medicalHistory: {
        vitalSigns,
        medicationHistory: medications,
        testResults,
        allergies
      },
      // GP details
      gpDetails,
      // Related people
      relatedPeople: profile.social.hasRelatedPeople ? this.generateRelatedPeople(patientId) : undefined,
      // Pharmacies
      pharmacies,
      // Reasonable adjustments
      reasonableAdjustments: this.generateReasonableAdjustments(profile),
      // Access restriction
      accessRestriction: profile.social.hasAccessRestriction ? this.generateAccessRestriction() : undefined,
      // Historic addresses
      historicAddresses: profile.social.hasHistoricAddresses ? this.generateHistoricAddresses(patientId) : undefined
    };

    return patient;
  }

  static generateAllPatients(): Patient[] {
    return PATIENT_PROFILES.map((_, index) => this.generatePatient(index));
  }
}
