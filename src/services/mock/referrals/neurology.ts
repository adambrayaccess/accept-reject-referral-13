
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const neurologyReferrals: Referral[] = [
  {
    id: 'REF-2023-003',
    ubrn: '345678901234',
    created: '2023-06-13T11:05:00Z',
    status: 'accepted',
    priority: 'emergency',
    patient: mockPatients[2],
    referrer: mockPractitioners[2],
    specialty: 'Neurology',
    service: 'Stroke Clinic',
    triageStatus: 'pre-admission-assessment',
    clinicalInfo: {
      reason: 'Transient loss of speech and right-sided weakness',
      history: 'Patient experienced sudden onset speech difficulty and weakness in right arm lasting approximately 30 minutes yesterday evening.',
      diagnosis: 'Suspected TIA',
      medications: ['Amlodipine 5mg OD', 'Ramipril 5mg OD'],
      allergies: ['Latex'],
      notes: 'Patient has history of hypertension and type 2 diabetes. CT head performed in ED - no acute changes.'
    },
    attachments: [
      {
        id: 'ATT-004',
        title: 'CT Head Report',
        contentType: 'application/pdf',
        url: '/mock-data/ct-report.pdf',
        date: '2023-06-12T22:30:00Z',
        size: 5678000
      },
      {
        id: 'ATT-005',
        title: 'Carotid Doppler Results',
        contentType: 'application/pdf',
        url: '/mock-data/doppler-results.pdf',
        date: '2023-06-13T09:15:00Z',
        size: 2345000
      }
    ]
  }
];

// Generate 49 more mock referrals with varied triage statuses
const additionalNeurologyReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1; // Start from 1 since we already have 1 referral
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
    id: `NEUR-2024-${index.toString().padStart(3, '0')}`,
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
    attachments: index % 3 === 0 ? [
      {
        id: `NEUR-ATT-${index}-1`,
        title: 'MRI Brain Report',
        contentType: 'application/pdf',
        url: '/mock-data/mri-report.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
        size: 4567000
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allNeurologyReferrals = [...neurologyReferrals, ...additionalNeurologyReferrals];
