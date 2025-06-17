
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';
import { updateUbrnIfSelected } from '../utils/ubrn-randomizer';

const cardiologyPatients = mockPatients.slice(0, 50);
const cardiologyPractitioners = mockPractitioners.slice(0, 10);

// First 10 referrals for quick testing
export const cardiologyReferrals: Referral[] = [
  updateUbrnIfSelected({
    id: 'card-001',
    ubrn: 'CARD001',
    created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    priority: 'urgent',
    patient: cardiologyPatients[0],
    referrer: cardiologyPractitioners[0],
    specialty: 'Cardiology',
    service: 'Heart Failure',
    clinicalInfo: {
      reason: 'Suspected heart failure with reduced ejection fraction',
      history: 'Progressive shortness of breath, ankle swelling, fatigue',
      diagnosis: 'Heart failure - suspected',
      medications: ['Ramipril', 'Bisoprolol', 'Furosemide'],
      allergies: ['Penicillin'],
      notes: 'Requires urgent echocardiogram and specialist review'
    },
    attachments: [],
    triageStatus: 'waiting-list',
    tags: ['urgent', 'two-week-wait', 'complex-case'],
    calculatedReferralAge: 15,
    aiGenerated: false
  }),
  updateUbrnIfSelected({
    id: 'card-002', 
    ubrn: 'CARD002',
    created: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    priority: 'routine',
    patient: cardiologyPatients[1],
    referrer: cardiologyPractitioners[1],
    specialty: 'Cardiology',
    service: 'Arrhythmia',
    clinicalInfo: {
      reason: 'Atrial fibrillation management',
      history: 'Recently diagnosed AF, rate control required',
      diagnosis: 'Atrial fibrillation',
      medications: ['Warfarin', 'Digoxin'],
      allergies: [],
      notes: 'Anticoagulation review and rate control optimization'
    },
    attachments: [],
    triageStatus: 'waiting-list',
    tags: ['anticoagulation', 'rate-control'],
    calculatedReferralAge: 8,
    aiGenerated: false
  }),
  updateUbrnIfSelected({
    id: 'card-003',
    ubrn: 'CARD003',
    created: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    priority: 'routine',
    patient: cardiologyPatients[2],
    referrer: cardiologyPractitioners[2],
    specialty: 'Cardiology',
    service: 'General Cardiology',
    clinicalInfo: {
      reason: 'Chest pain investigation',
      history: 'Intermittent chest pain, family history of CAD',
      diagnosis: 'Chest pain - ?angina',
      medications: ['Aspirin', 'Atorvastatin'],
      allergies: [],
      notes: 'Exercise stress test indicated'
    },
    attachments: [],
    triageStatus: 'waiting-list',
    tags: ['chest-pain', 'investigation-required'],
    calculatedReferralAge: 22,
    aiGenerated: false
  })
];

// Generate the remaining 47 referrals to make 50 total
const generateCardiologyReferral = (index: number): Referral => {
  const patientIndex = index % cardiologyPatients.length;
  const practitionerIndex = index % cardiologyPractitioners.length;
  const daysAgo = Math.floor(Math.random() * 90) + 1;
  
  const services = ['Heart Failure', 'Arrhythmia', 'General Cardiology', 'Interventional Cardiology'];
  const priorities: ('routine' | 'urgent' | 'emergency')[] = ['routine', 'routine', 'routine', 'urgent', 'emergency'];
  const tagOptions = ['follow-up-required', 'multidisciplinary', 'complex-case', 'urgent', 'two-week-wait', 'anticoagulation', 'device-therapy', 'lifestyle-advice'];
  
  // Randomly assign tags to some referrals
  const tags = Math.random() > 0.6 ? [tagOptions[Math.floor(Math.random() * tagOptions.length)]] : [];
  if (Math.random() > 0.8) {
    tags.push(tagOptions[Math.floor(Math.random() * tagOptions.length)]);
  }
  
  return updateUbrnIfSelected({
    id: `card-${String(index + 1).padStart(3, '0')}`,
    ubrn: `CARD${String(index + 1).padStart(3, '0')}`,
    created: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    patient: cardiologyPatients[patientIndex],
    referrer: cardiologyPractitioners[practitionerIndex],
    specialty: 'Cardiology',
    service: services[Math.floor(Math.random() * services.length)],
    clinicalInfo: {
      reason: `Cardiology consultation - case ${index + 1}`,
      history: 'Clinical history details',
      diagnosis: 'Cardiology condition',
      medications: ['Medication 1', 'Medication 2'],
      allergies: [],
      notes: 'Clinical notes for review'
    },
    attachments: [],
    triageStatus: 'waiting-list',
    tags,
    calculatedReferralAge: daysAgo,
    aiGenerated: false
  });
};

const additionalReferrals = Array.from({ length: 47 }, (_, i) => generateCardiologyReferral(i + 3));

export const allCardiologyReferrals: Referral[] = [
  ...cardiologyReferrals,
  ...additionalReferrals
];
