
import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';
import { generateMockAppointment, generateSubReferralData } from '../appointmentGenerator';

export const cardiologyReferrals: Referral[] = [
  {
    id: 'REF-2023-001',
    ubrn: '123456789012',
    created: '2023-06-15T09:30:00Z',
    status: 'new',
    priority: 'urgent',
    patient: mockPatients[0],
    referrer: mockPractitioners[0],
    specialty: 'Cardiology',
    service: 'Rapid Access Chest Pain Clinic',
    triageStatus: 'assessed',
    tags: ['chest-pain', 'urgent-review', 'family-history'],
    clinicalInfo: {
      reason: 'Chest pain on exertion',
      history: 'Patient reports chest pain during moderate exercise lasting 5-10 minutes over the past two weeks.',
      diagnosis: 'Suspected angina',
      medications: ['Aspirin 75mg OD', 'Atorvastatin 20mg ON'],
      allergies: ['Penicillin'],
      notes: 'Patient has family history of coronary heart disease. Father had MI at age 58.'
    },
    attachments: [
      {
        id: 'ATT-001',
        title: 'ECG Report',
        contentType: 'application/pdf',
        url: '/mock-data/ecg-report.pdf',
        date: '2023-06-14T10:15:00Z',
        size: 2456000
      },
      {
        id: 'ATT-002',
        title: 'Blood Tests',
        contentType: 'application/pdf',
        url: '/mock-data/blood-tests.pdf',
        date: '2023-06-14T11:30:00Z',
        size: 1245000
      }
    ]
  },
  {
    id: 'AGE-2024-002',
    ubrn: 'AGE002',
    created: '2024-04-26T09:15:00Z',
    status: 'rejected',
    priority: 'urgent',
    patient: mockPatients[2],
    referrer: mockPractitioners[4],
    specialty: 'Cardiology',
    service: 'Rapid Access Chest Pain Clinic',
    triageStatus: 'refer-to-another-specialty',
    tags: ['refer-elsewhere', 'non-cardiac'],
    clinicalInfo: {
      reason: 'Chest pain on exertion',
      history: 'Patient reports intermittent chest pain during moderate exercise.',
      diagnosis: 'Suspected angina',
      medications: ['Aspirin 75mg OD'],
      allergies: [],
      notes: 'Referral from Access Group Elemental GP'
    },
    attachments: [
      {
        id: 'AGE-ATT-002-1',
        title: 'Exercise Stress Test',
        contentType: 'application/pdf',
        url: '/mock-data/stress-test.pdf',
        date: '2024-04-25T14:20:00Z',
        size: 3240000
      }
    ]
  }
];

// Generate 48 more mock referrals with balanced distribution for dashboard vs waiting list
const additionalCardiologyReferrals: Referral[] = Array.from({ length: 48 }, (_, i) => {
  const index = i + 2;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Better distribution: 30% for dashboard (new, some accepted/rejected), 70% for waiting list
  let status: Referral['status'];
  let triageStatus: TriageStatus;
  
  if (index <= 15) {
    // First 15 records: Dashboard referrals (new, some processed)
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
    // Remaining records: Waiting list referrals
    status = 'accepted';
    triageStatus = 'waiting-list';
  }
  
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  // Enhanced tag options for cardiology
  const tagOptions = [
    ['chest-pain', 'acs-ruled-out'],
    ['palpitations', 'ecg-abnormal'],
    ['heart-failure', 'echo-required'],
    ['hypertension', 'medication-review'],
    ['arrhythmia', 'holter-needed'],
    ['valve-disease', 'murmur'],
    ['syncope', 'tilt-test'],
    ['post-mi', 'rehabilitation'],
    ['diabetes', 'cardiovascular-risk'],
    ['family-history', 'screening']
  ];
  
  const attachmentOptions = [
    { title: 'ECG Report', contentType: 'application/pdf', url: '/mock-data/ecg-report.pdf', size: 2456000 },
    { title: 'Chest X-Ray', contentType: 'image/jpeg', url: '/mock-data/chest-xray.jpg', size: 4567000 },
    { title: 'Echocardiogram', contentType: 'application/pdf', url: '/mock-data/echo-report.pdf', size: 3456000 },
    { title: 'Blood Tests', contentType: 'application/pdf', url: '/mock-data/blood-tests.pdf', size: 1245000 },
    { title: 'Exercise Stress Test', contentType: 'application/pdf', url: '/mock-data/stress-test.pdf', size: 3240000 }
  ];

  // Generate appointment and sub-referral data
  const appointmentDetails = generateMockAppointment(`CARD-2024-${index.toString().padStart(3, '0')}`, created, 'Cardiology');
  const subReferralData = generateSubReferralData(`CARD-2024-${index.toString().padStart(3, '0')}`);
  
  return {
    id: `CARD-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `C${(1000000 + index).toString().padStart(8, '0')}`,
    created,
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Cardiology',
    service: index % 3 === 0 ? 'Rapid Access Chest Pain Clinic' : 
             index % 3 === 1 ? 'Heart Failure Clinic' : 'Arrhythmia Service',
    triageStatus,
    tags: tagOptions[index % tagOptions.length],
    appointmentDetails,
    ...subReferralData,
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Chest pain on exertion' : 
              index % 4 === 1 ? 'Palpitations' : 
              index % 4 === 2 ? 'Shortness of breath' : 'Syncope',
      history: `Patient with ${index % 2 === 0 ? 'new onset' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 3 === 0 ? 'Suspected angina' : 
                index % 3 === 1 ? 'Suspected arrhythmia' : 'Suspected heart failure',
      medications: ['Aspirin 75mg OD', 'Bisoprolol 2.5mg OD'],
      allergies: index % 5 === 0 ? ['Penicillin'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of heart disease.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `CARD-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      }
    ] : index % 3 === 0 ? [
      {
        id: `CARD-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      },
      {
        id: `CARD-ATT-${index}-2`,
        ...attachmentOptions[(index + 1) % attachmentOptions.length],
        date: new Date(date.getTime() - 172800000).toISOString(),
      }
    ] : []
  };
});

// Add 7 additional waiting list test records
const additionalWaitingListReferrals: Referral[] = Array.from({ length: 7 }, (_, i) => {
  const index = i + 100; // Start from 100 to avoid ID conflicts
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent'];
  const priority = priorityOptions[index % 2];
  
  const daysAgo = Math.floor(Math.random() * 180) + 30; // 30-210 days ago
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  const tagOptions = [
    ['chest-pain', 'stable-angina'],
    ['heart-failure', 'medication-optimisation'],
    ['arrhythmia', 'rate-control'],
    ['hypertension', 'resistant'],
    ['valve-disease', 'monitoring'],
    ['post-mi', 'secondary-prevention'],
    ['syncope', 'investigation']
  ];

  const appointmentDetails = generateMockAppointment(`CARD-WL-${(index + 1).toString().padStart(3, '0')}`, created, 'Cardiology');
  const subReferralData = generateSubReferralData(`CARD-WL-${(index + 1).toString().padStart(3, '0')}`);
  
  return {
    id: `CARD-WL-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `CWL${(2000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Cardiology',
    service: index % 3 === 0 ? 'General Cardiology' : 
             index % 3 === 1 ? 'Heart Failure Clinic' : 'Arrhythmia Service',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    appointmentDetails,
    ...subReferralData,
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Chest pain on exertion' : 
              index % 4 === 1 ? 'Palpitations' : 
              index % 4 === 2 ? 'Shortness of breath' : 'Follow-up care',
      history: `Patient with stable symptoms for past ${Math.floor(Math.random() * 6) + 3} months.`,
      diagnosis: index % 3 === 0 ? 'Stable angina' : 
                index % 3 === 1 ? 'Atrial fibrillation' : 'Heart failure',
      medications: ['Aspirin 75mg OD', 'Bisoprolol 2.5mg OD', 'Atorvastatin 40mg ON'],
      allergies: index % 7 === 0 ? ['Penicillin'] : [],
      notes: `Waiting list patient for routine cardiology assessment.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `CARD-WL-ATT-${index}-1`,
        title: 'ECG Report',
        contentType: 'application/pdf',
        url: '/mock-data/ecg-report.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 2456000
      }
    ] : []
  };
});

export const allCardiologyReferrals = [...cardiologyReferrals, ...additionalCardiologyReferrals, ...additionalWaitingListReferrals];
