
import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';
import { updateUbrnIfSelected } from '../utils/ubrn-randomizer';
import { testReferralWithAdjustments } from './test-referral-003';

// Define additional specific neurology referrals
const additionalNeurologyReferrals: Referral[] = [
  {
    id: 'NEUR-2024-051',
    ubrn: 'RFR-2024-NEUR-051',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Neurology',
    service: 'Stroke Service',
    patient: mockPatients[0], // John Smith
    referrer: mockPractitioners[0],
    clinicalInfo: {
      reason: 'Suspected TIA - transient left-sided weakness and speech difficulties',
      history: 'Patient experienced sudden onset left-sided weakness and slurred speech lasting 45 minutes. Symptoms completely resolved. Risk factors: hypertension, diabetes, smoking history. ABCD2 score: 6 (high risk).',
      diagnosis: 'Transient Ischaemic Attack',
      medications: ['Lisinopril 10mg OD', 'Metformin 500mg BD', 'Aspirin 75mg OD started'],
      allergies: [],
      notes: 'Urgent stroke prevention clinic referral required within 24 hours'
    },
    created: '2024-02-28T14:30:00Z',
    attachments: [
      {
        id: 'NEUR-ATT-051-1',
        title: 'CT Brain Report',
        contentType: 'application/pdf',
        url: '/mock-data/ct-brain-051.pdf',
        date: '2024-02-28T15:00:00Z',
        size: 2345678
      },
      {
        id: 'NEUR-ATT-051-2',
        title: 'ECG Report',
        contentType: 'application/pdf',
        url: '/mock-data/ecg-051.pdf',
        date: '2024-02-28T14:45:00Z',
        size: 1234567
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-28T14:30:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Urgent TIA referral - high ABCD2 score'
      }
    ],
    tags: ['tia', 'stroke-risk', 'urgent', 'abcd2-high']
  },
  {
    id: 'NEUR-2024-052',
    ubrn: 'RFR-2024-NEUR-052',
    status: 'accepted',
    triageStatus: 'waiting-list',
    priority: 'routine',
    specialty: 'Neurology',
    service: 'Epilepsy Service',
    patient: mockPatients[1], // Sarah Williams
    referrer: mockPractitioners[1],
    clinicalInfo: {
      reason: 'New onset seizures - witnessed tonic-clonic seizure',
      history: 'Patient had first witnessed seizure 2 weeks ago. Tonic-clonic activity lasting 3 minutes. Postictal confusion for 30 minutes. No previous seizure history. Family history of epilepsy (brother). Recent stress at work.',
      diagnosis: 'New onset seizure disorder - query epilepsy',
      medications: ['Sertraline 50mg OD', 'Levetiracetam 500mg BD - started by ED'],
      allergies: ['Aspirin - LIFE-THREATENING anaphylaxis, carries EpiPen', 'Latex', 'Peanuts'],
      notes: 'Patient anxious about driving restrictions. EEG and MRI requested.'
    },
    created: '2024-02-20T09:15:00Z',
    attachments: [
      {
        id: 'NEUR-ATT-052-1',
        title: 'Witness Statement',
        contentType: 'application/pdf',
        url: '/mock-data/witness-statement.pdf',
        date: '2024-02-20T09:15:00Z',
        size: 876543
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-20T09:15:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'New onset seizure referral'
      },
      {
        timestamp: '2024-02-25T11:30:00Z',
        action: 'referral_accepted',
        user: 'Dr. Michael Chen',
        notes: 'Accepted for epilepsy service assessment'
      }
    ],
    tags: ['seizure', 'epilepsy', 'new-onset', 'family-history']
  },
  {
    id: 'NEUR-2024-053',
    ubrn: 'RFR-2024-NEUR-053',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Neurology',
    service: 'Multiple Sclerosis Service',
    patient: mockPatients[2], // Alice Johnson
    referrer: mockPractitioners[2],
    clinicalInfo: {
      reason: 'Suspected multiple sclerosis - optic neuritis and sensory symptoms',
      history: 'Patient developed sudden visual loss in right eye 1 week ago with eye pain on movement. Also reports numbness and tingling in left leg over past month. Previous episode of similar leg symptoms 6 months ago that resolved. Age 25, female.',
      diagnosis: 'Query Multiple Sclerosis',
      medications: ['Prednisolone 1mg/kg started for optic neuritis'],
      allergies: ['Latex - contact dermatitis'],
      notes: 'Urgent MRI brain and spine requested. Ophthalmology reviewed.'
    },
    created: '2024-02-26T16:45:00Z',
    attachments: [
      {
        id: 'NEUR-ATT-053-1',
        title: 'Ophthalmology Report',
        contentType: 'application/pdf',
        url: '/mock-data/ophthalmology-report.pdf',
        date: '2024-02-26T16:45:00Z',
        size: 1987654
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-26T16:45:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Suspected MS - optic neuritis and sensory symptoms'
      }
    ],
    tags: ['ms-suspected', 'optic-neuritis', 'sensory-symptoms', 'young-female']
  },
  {
    id: 'NEUR-2024-054',
    ubrn: 'RFR-2024-NEUR-054',
    status: 'accepted',
    triageStatus: 'assessed',
    priority: 'routine',
    specialty: 'Neurology',
    service: 'Movement Disorders Clinic',
    patient: mockPatients[4], // David Wilson
    referrer: mockPractitioners[3],
    clinicalInfo: {
      reason: 'Progressive tremor and bradykinesia - suspected Parkinson\'s disease',
      history: 'Patient reports 18-month history of right-hand tremor at rest, progressive slowness of movement, and stiffness. Handwriting has become smaller. Slight stooped posture noted. No response to levodopa trial yet. Family concerned about functional decline.',
      diagnosis: 'Query Parkinson\'s Disease',
      medications: ['Ramipril 5mg OD', 'Co-careldopa 12.5/50mg TDS - started last week'],
      allergies: [],
      notes: 'DaTscan requested to confirm diagnosis. Occupational therapy referral made.'
    },
    created: '2024-02-12T10:20:00Z',
    attachments: [
      {
        id: 'NEUR-ATT-054-1',
        title: 'Video Assessment',
        contentType: 'video/mp4',
        url: '/mock-data/movement-assessment.mp4',
        date: '2024-02-12T10:20:00Z',
        size: 15678901
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-12T10:20:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Suspected Parkinson\'s disease referral'
      },
      {
        timestamp: '2024-02-18T14:15:00Z',
        action: 'referral_accepted',
        user: 'Dr. Sarah Mitchell',
        notes: 'Accepted for movement disorders assessment'
      }
    ],
    tags: ['parkinsons', 'tremor', 'bradykinesia', 'movement-disorder']
  },
  {
    id: 'NEUR-2024-055',
    ubrn: 'RFR-2024-NEUR-055',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'routine',
    specialty: 'Neurology',
    service: 'Headache Clinic',
    patient: mockPatients[3], // Emma Thompson
    referrer: mockPractitioners[4],
    clinicalInfo: {
      reason: 'Chronic daily headache with medication overuse',
      history: 'Patient reports daily headaches for past 8 months. Using over-the-counter analgesics daily (paracetamol and ibuprofen). Headaches worse in morning, associated with nausea. Previous migraine history. Concerned about medication overuse headache.',
      diagnosis: 'Chronic Daily Headache - query Medication Overuse Headache',
      medications: ['Microgynon 30', 'Paracetamol 1g QDS', 'Ibuprofen 400mg TDS'],
      allergies: [],
      notes: 'Headache diary completed. Patient motivated for medication withdrawal.'
    },
    created: '2024-02-24T13:30:00Z',
    attachments: [
      {
        id: 'NEUR-ATT-055-1',
        title: 'Headache Diary',
        contentType: 'application/pdf',
        url: '/mock-data/headache-diary.pdf',
        date: '2024-02-24T13:30:00Z',
        size: 3456789
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-24T13:30:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Chronic headache with medication overuse referral'
      }
    ],
    tags: ['chronic-headache', 'medication-overuse', 'headache-diary']
  }
];

export const neurologyReferrals: Referral[] = [
  // Use our test referral that specifically has reasonable adjustments data
  testReferralWithAdjustments,
  ...additionalNeurologyReferrals
];

// Generate additional bulk referrals
const bulkNeurologyReferrals: Referral[] = Array.from({ length: 44 }, (_, i) => {
  const index = i + 6; // Start from 6 since we have 6 specific ones above
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Better distribution: 30% for dashboard, 70% for waiting list
  let status: Referral['status'];
  let triageStatus: TriageStatus;
  
  if (index <= 20) {
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
    id: `NEUR-2024-${(index + 50).toString().padStart(3, '0')}`,
    ubrn: `N${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
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

export const allNeurologyReferrals = [...neurologyReferrals, ...bulkNeurologyReferrals];
