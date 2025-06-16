
import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const dermatologyReferrals: Referral[] = [
  {
    id: 'AGE-2024-001',
    ubrn: 'AGE001',
    created: '2024-04-27T14:20:00Z',
    status: 'new',
    priority: 'routine',
    patient: mockPatients[1],
    referrer: mockPractitioners[3],
    specialty: 'Dermatology',
    service: 'General Dermatology',
    triageStatus: 'pre-assessment',
    clinicalInfo: {
      reason: 'Persistent rash on trunk and limbs',
      history: 'Patient presents with pruritic rash present for 3 months. Not responding to OTC treatments.',
      diagnosis: 'Suspected eczema/dermatitis',
      medications: ['Cetirizine 10mg OD', 'Hydrocortisone 1% cream BD'],
      allergies: [],
      notes: 'Referral from Access Group Elemental GP'
    },
    attachments: [
      {
        id: 'AGE-ATT-001-1',
        title: 'Clinical Photos - Torso',
        contentType: 'image/jpeg',
        url: '/mock-data/rash-photos-torso.jpg',
        date: '2024-04-26T15:30:00Z',
        size: 2845000
      }
    ]
  },
  {
    id: 'REF-2023-002',
    ubrn: '234567890123',
    created: '2023-06-14T14:20:00Z',
    status: 'accepted',
    priority: 'routine',
    patient: mockPatients[1],
    referrer: mockPractitioners[1],
    specialty: 'Dermatology',
    service: 'General Dermatology',
    triageStatus: 'waiting-list',
    clinicalInfo: {
      reason: 'Persistent rash on trunk and limbs',
      history: 'Patient presents with pruritic rash present for 3 months. Not responding to OTC treatments.',
      diagnosis: 'Suspected eczema/dermatitis',
      medications: ['Cetirizine 10mg OD', 'Hydrocortisone 1% cream BD'],
      allergies: [],
      notes: 'No known history of skin conditions.'
    },
    attachments: [
      {
        id: 'ATT-003',
        title: 'Photographs of Rash',
        contentType: 'image/jpeg',
        url: '/mock-data/rash-photos.jpg',
        date: '2023-06-13T09:45:00Z',
        size: 3568000
      }
    ]
  }
];

// Generate 48 more mock referrals with varied triage statuses
const additionalDermatologyReferrals: Referral[] = Array.from({ length: 48 }, (_, i) => {
  const index = i + 2; // Start from 2 since we already have 2 referrals
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
  
  // Define attachment options for dermatology
  const attachmentOptions = [
    { title: 'Clinical Photographs', contentType: 'image/jpeg', url: '/mock-data/rash-photos.jpg', size: 3568000 },
    { title: 'Dermoscopy Images', contentType: 'image/jpeg', url: '/mock-data/dermoscopy.jpg', size: 4120000 },
    { title: 'Biopsy Report', contentType: 'application/pdf', url: '/mock-data/biopsy-report.pdf', size: 1890000 },
    { title: 'Allergy Test Results', contentType: 'application/pdf', url: '/mock-data/allergy-tests.pdf', size: 2340000 },
    { title: 'Previous Treatment Records', contentType: 'application/pdf', url: '/mock-data/treatment-history.pdf', size: 1567000 }
  ];
  
  return {
    id: `DERM-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `D${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Dermatology',
    service: index % 3 === 0 ? 'General Dermatology' : 
             index % 3 === 1 ? 'Skin Cancer Service' : 'Pediatric Dermatology',
    triageStatus,
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Persistent rash' : 
              index % 4 === 1 ? 'Suspicious mole' : 
              index % 4 === 2 ? 'Severe acne' : 'Chronic urticaria',
      history: `Patient with ${index % 2 === 0 ? 'new onset' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 3 === 0 ? 'Suspected eczema' : 
                index % 3 === 1 ? 'Suspected melanoma' : 'Suspected psoriasis',
      medications: ['Cetirizine 10mg OD', 'Hydrocortisone 1% cream BD'],
      allergies: index % 5 === 0 ? ['Latex'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of skin conditions.`
    },
    attachments: index % 3 !== 2 ? [
      {
        id: `DERM-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allDermatologyReferrals = [...dermatologyReferrals, ...additionalDermatologyReferrals];
