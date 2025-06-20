
import { Referral } from '@/types/referral';
import { cardiologyReferrals } from './cardiology';
import { dermatologyReferrals } from './dermatology';
import { gastroenterologyReferrals } from './gastroenterology';
import { mentalHealthReferrals } from './mentalhealth';
import { neurologyReferrals } from './neurology';
import { rheumatologyReferrals } from './rheumatology';

// Import test referral (create a simple one if it doesn't exist)
const testReferral003: Referral = {
  id: 'TEST-003',
  ubrn: 'UBRN-TEST-003',
  created: '2024-01-01T00:00:00Z',
  status: 'new',
  priority: 'routine',
  patient: {
    id: 'P999',
    name: 'Test Patient',
    birthDate: '1990-01-01',
    gender: 'other',
    nhsNumber: '999 999 9999',
    address: 'Test Address',
    phone: '07000 000000'
  },
  referrer: {
    id: 'PRACT999',
    name: 'Test Practitioner',
    role: 'GP',
    organization: 'Test Practice',
    contact: 'test@test.com'
  },
  specialty: 'Test Specialty',
  clinicalInfo: {
    reason: 'Test complaint',
    history: 'Test history',
    diagnosis: 'Test diagnosis',
    medications: [],
    allergies: [],
    notes: 'Test additional info'
  },
  attachments: [],
  calculatedReferralAge: 1,
  calculatedPatientAge: 34,
  calculatedLocation: 'Test Location'
};

// Combine all referrals
export const mockReferrals: Referral[] = [
  ...cardiologyReferrals,
  ...dermatologyReferrals,
  ...gastroenterologyReferrals,
  ...mentalHealthReferrals,
  ...neurologyReferrals,
  ...rheumatologyReferrals,
  testReferral003
];

// Export individual specialty referrals for easier access
export {
  cardiologyReferrals,
  dermatologyReferrals,
  gastroenterologyReferrals,
  mentalHealthReferrals,
  neurologyReferrals,
  rheumatologyReferrals,
  testReferral003
};

// Helper function to find referral by ID with complete patient data
export const findReferralById = (id: string): Referral | undefined => {
  const referral = mockReferrals.find(ref => ref.id === id);
  
  if (referral) {
    console.log('=== findReferralById Debug ===');
    console.log('Found referral:', referral.id);
    console.log('Patient ID:', referral.patient.id);
    console.log('Patient name:', referral.patient.name);
    console.log('Patient reasonableAdjustments:', referral.patient.reasonableAdjustments);
    console.log('Patient allergies:', referral.patient.medicalHistory?.allergies);
    console.log('=============================');
  }
  
  return referral;
};
