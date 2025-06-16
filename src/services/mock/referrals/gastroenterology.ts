
import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const gastroenterologyReferrals: Referral[] = [
  {
    id: 'REF-2023-005',
    ubrn: '567890123456',
    created: '2023-06-11T09:15:00Z',
    status: 'rejected',
    priority: 'urgent',
    patient: mockPatients[4],
    referrer: mockPractitioners[4],
    specialty: 'Gastroenterology',
    service: 'Rapid Access',
    triageStatus: 'refer-to-another-specialty',
    clinicalInfo: {
      reason: 'Weight loss and change in bowel habits',
      history: 'Unintentional weight loss of 5kg over 2 months. Change in bowel habits with occasional blood in stool.',
      diagnosis: 'Suspected colorectal cancer',
      medications: ['Omeprazole 20mg OD'],
      allergies: ['Penicillin'],
      notes: 'Colonoscopy urgently required'
    },
    attachments: [
      {
        id: 'ATT-007',
        title: 'FIT Test Result',
        contentType: 'application/pdf',
        url: '/mock-data/fit-test.pdf',
        date: '2023-06-10T15:45:00Z',
        size: 985000
      }
    ]
  }
];

// Generate 49 more mock referrals with varied triage statuses
const additionalGastroenterologyReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1; // Start from 1 since we already have 1 referral
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Distribute triage statuses across referrals
  const triageStatuses: TriageStatus[] = ['pre-assessment', 'assessed', 'pre-admission-assessment', 'waiting-list', 'refer-to-another-specialty'];
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
    id: `GAST-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `G${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Gastroenterology',
    service: index % 3 === 0 ? 'Rapid Access' : 
             index % 3 === 1 ? 'IBD Service' : 'Hepatology',
    triageStatus,
    clinicalInfo: {
      reason: index % 5 === 0 ? 'Weight loss and change in bowel habits' : 
              index % 5 === 1 ? 'Abdominal pain' : 
              index % 5 === 2 ? 'Dyspepsia' : 
              index % 5 === 3 ? 'Abnormal LFTs' : 'Diarrhea',
      history: `Patient with ${index % 2 === 0 ? 'acute' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Suspected colorectal cancer' : 
                index % 4 === 1 ? 'Suspected IBD' : 
                index % 4 === 2 ? 'Suspected peptic ulcer disease' : 'Suspected liver disease',
      medications: ['Omeprazole 20mg OD', 'Buscopan 10mg TDS'],
      allergies: index % 5 === 0 ? ['Penicillin'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of GI conditions.`
    },
    attachments: index % 3 === 0 ? [
      {
        id: `GAST-ATT-${index}-1`,
        title: 'FIT Test Result',
        contentType: 'application/pdf',
        url: '/mock-data/fit-test.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
        size: 985000
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allGastroenterologyReferrals = [...gastroenterologyReferrals, ...additionalGastroenterologyReferrals];
