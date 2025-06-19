import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';
import { updateUbrnIfSelected } from '../utils/ubrn-randomizer';
import { testReferralWithAdjustments } from './test-referral-003';

export const neurologyReferrals: Referral[] = [
  // Use our test referral that specifically has reasonable adjustments data
  testReferralWithAdjustments
];

const additionalNeurologyReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1;
  // Ensure we're using the correct patient objects from mockPatients array
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Better distribution: 30% for dashboard, 70% for waiting list
  let status: Referral['status'];
  let triageStatus: TriageStatus;
  
  if (index <= 15) {
    // Dashboard referrals
    if (index % 3 === 0) {
      status = 'new';
      triageStatus = 'pre-assessment';
    } else if (index % 3 === 1) {
      status = 'accepted';
      triageStatus = 'assessed';
    } else {
      status = 'rejected';
      triageStatus = 'refer-to-another-specialty';
    }
  } else {
    // Waiting list referrals
    status = 'accepted';
    triageStatus = 'waiting-list';
  }
  
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Enhanced tag options for neurology
  const tagOptions = [
    ['seizure', 'epilepsy-workup'],
    ['headache', 'migraine', 'preventative-therapy'],
    ['tia', 'stroke-prevention'],
    ['tremor', 'parkinsons-query'],
    ['ms-suspected', 'mri-required'],
    ['neuropathy', 'diabetes-related'],
    ['memory-loss', 'dementia-screening'],
    ['vertigo', 'balance-issues'],
    ['nerve-pain', 'neuropathic'],
    ['weakness', 'motor-symptoms']
  ];
  
  const attachmentOptions = [
    { title: 'MRI Brain Report', contentType: 'application/pdf', url: '/mock-data/mri-report.pdf', size: 4567000 },
    { title: 'CT Head Report', contentType: 'application/pdf', url: '/mock-data/ct-report.pdf', size: 5678000 },
    { title: 'EEG Results', contentType: 'application/pdf', url: '/mock-data/eeg-report.pdf', size: 3456000 },
    { title: 'Carotid Doppler Results', contentType: 'application/pdf', url: '/mock-data/doppler-results.pdf', size: 2345000 },
    { title: 'Neuropsychology Assessment', contentType: 'application/pdf', url: '/mock-data/neuropsych.pdf', size: 2890000 }
  ];
  
  return updateUbrnIfSelected({
    id: `NEUR-2024-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `N${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex], // Use the actual patient object, not a recreation
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Neurology',
    service: index % 4 === 0 ? 'Stroke Clinic' : 
             index % 4 === 1 ? 'Epilepsy Service' : 
             index % 4 === 2 ? 'Headache Clinic' : 'Multiple Sclerosis Service',
    triageStatus,
    tags: tagOptions[index % tagOptions.length],
    clinicalInfo: {
      reason: index % 5 === 0 ? 'TIA symptoms' : 
              index % 5 === 1 ? 'Seizures' : 
              index % 5 === 2 ? 'Migraine' : 
              index % 5 === 3 ? 'Tremor' : 'Numbness and tingling',
      history: `Patient with ${index % 2 === 0 ? 'sudden onset' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Suspected TIA' : 
                index % 4 === 1 ? 'Suspected epilepsy' : 
                index % 4 === 2 ? 'Suspected migraine' : 'Suspected MS',
      medications: ['Propranolol 40mg BD', 'Amitriptyline 10mg ON'],
      allergies: index % 5 === 0 ? ['Latex'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of neurological conditions.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `NEUR-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      }
    ] : index % 4 === 0 ? [
      {
        id: `NEUR-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      },
      {
        id: `NEUR-ATT-${index}-2`,
        ...attachmentOptions[(index + 1) % attachmentOptions.length],
        date: new Date(date.getTime() - 172800000).toISOString(),
      }
    ] : []
  });
});

// Add 7 additional test records for Dashboard
const additionalDashboardReferrals: Referral[] = Array.from({ length: 7 }, (_, i) => {
  const index = i + 200;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  const tagOptions = [
    ['headache', 'dashboard-test'],
    ['seizure', 'dashboard-test'],
    ['tia', 'dashboard-test'],
    ['tremor', 'dashboard-test'],
    ['ms-suspected', 'dashboard-test'],
    ['neuropathy', 'dashboard-test'],
    ['memory-loss', 'dashboard-test']
  ];
  
  return updateUbrnIfSelected({
    id: `NEUR-DASH-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `NDASH${(3000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex], // Use actual patient object
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Neurology',
    service: index % 4 === 0 ? 'Stroke Clinic' : 
             index % 4 === 1 ? 'Epilepsy Service' : 
             index % 4 === 2 ? 'Headache Clinic' : 'Multiple Sclerosis Service',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    clinicalInfo: {
      reason: index % 5 === 0 ? 'TIA symptoms' : 
              index % 5 === 1 ? 'Seizures' : 
              index % 5 === 2 ? 'Migraine' : 
              index % 5 === 3 ? 'Tremor' : 'Memory concerns',
      history: `Dashboard test patient with neurological symptoms for past ${Math.floor(Math.random() * 6) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Suspected TIA' : 
                index % 4 === 1 ? 'Suspected epilepsy' : 
                index % 4 === 2 ? 'Suspected migraine' : 'Suspected MS',
      medications: ['Propranolol 40mg BD', 'Amitriptyline 10mg ON'],
      allergies: index % 7 === 0 ? ['Latex'] : [],
      notes: `Dashboard test referral for neurology assessment.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `NEUR-DASH-ATT-${index}-1`,
        title: 'MRI Brain Report',
        contentType: 'application/pdf',
        url: '/mock-data/mri-report.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 4567000
      }
    ] : []
  });
});

// Add 7 additional waiting list test records
const additionalWaitingListReferrals: Referral[] = Array.from({ length: 7 }, (_, i) => {
  const index = i + 100;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent'];
  const priority = priorityOptions[index % 2];
  
  const daysAgo = Math.floor(Math.random() * 180) + 30;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  const tagOptions = [
    ['headache', 'chronic-migraine'],
    ['epilepsy', 'medication-review'],
    ['movement-disorder', 'assessment'],
    ['neuropathy', 'nerve-conduction'],
    ['memory-clinic', 'cognitive-assessment'],
    ['ms-monitoring', 'annual-review'],
    ['tremor', 'essential-tremor']
  ];
  
  return updateUbrnIfSelected({
    id: `NEUR-WL-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `NWL${(2000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex], // Use actual patient object
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Neurology',
    service: index % 4 === 0 ? 'General Neurology' : 
             index % 4 === 1 ? 'Epilepsy Service' : 
             index % 4 === 2 ? 'Headache Clinic' : 'Memory Clinic',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Chronic headaches' : 
              index % 4 === 1 ? 'Seizure management' : 
              index % 4 === 2 ? 'Tremor assessment' : 'Memory concerns',
      history: `Patient with stable neurological symptoms requiring specialist review.`,
      diagnosis: index % 3 === 0 ? 'Chronic migraine' : 
                index % 3 === 1 ? 'Epilepsy' : 'Essential tremor',
      medications: ['Propranolol 40mg BD', 'Amitriptyline 10mg ON'],
      allergies: index % 7 === 0 ? ['Latex'] : [],
      notes: `Waiting list patient for routine neurology assessment.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `NEUR-WL-ATT-${index}-1`,
        title: 'MRI Brain Report',
        contentType: 'application/pdf',
        url: '/mock-data/mri-report.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 4567000
      }
    ] : []
  });
});

export const allNeurologyReferrals = [...neurologyReferrals, ...additionalNeurologyReferrals, ...additionalWaitingListReferrals, ...additionalDashboardReferrals];
