
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

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
    clinicalInfo: {
      reason: 'Chest pain on exertion',
      history: 'Patient reports intermittent chest pain during moderate exercise.',
      diagnosis: 'Suspected angina',
      medications: ['Aspirin 75mg OD'],
      allergies: [],
      notes: 'Referral from Access Group Elemental GP'
    },
    attachments: []
  }
];

// Generate 48 more mock referrals with varied triage statuses
const additionalCardiologyReferrals: Referral[] = Array.from({ length: 48 }, (_, i) => {
  const index = i + 2; // Start from 2 since we already have 2 referrals
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Distribute triage statuses across referrals
  const triageStatuses = ['pre-assessment', 'assessed', 'pre-admission-assessment', 'waiting-list', 'refer-to-another-specialty'];
  const triageStatus = triageStatuses[index % triageStatuses.length];
  
  // Set status based on triage status
  const status = triageStatus === 'refer-to-another-specialty' ? 'rejected' : 
                index % 6 === 0 ? 'rejected' : 
                index % 7 === 0 ? 'accepted' : 'new';
  
  // Generate a date between 1 and 365 days ago
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    id: `CARD-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `C${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Cardiology',
    service: index % 3 === 0 ? 'Rapid Access Chest Pain Clinic' : 
             index % 3 === 1 ? 'Heart Failure Clinic' : 'Arrhythmia Service',
    triageStatus,
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
    attachments: index % 3 === 0 ? [
      {
        id: `CARD-ATT-${index}-1`,
        title: 'ECG Report',
        contentType: 'application/pdf',
        url: '/mock-data/ecg-report.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
        size: 2456000
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allCardiologyReferrals = [...cardiologyReferrals, ...additionalCardiologyReferrals];
