
import { Referral } from '@/types/referral';
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
    clinicalInfo: {
      reason: 'Persistent rash on trunk and limbs',
      history: 'Patient presents with pruritic rash present for 3 months. Not responding to OTC treatments.',
      diagnosis: 'Suspected eczema/dermatitis',
      medications: ['Cetirizine 10mg OD', 'Hydrocortisone 1% cream BD'],
      allergies: [],
      notes: 'Referral from Access Group Elemental GP'
    },
    attachments: []
  },
  {
    id: 'REF-2023-002',
    ubrn: '234567890123',
    created: '2023-06-14T14:20:00Z',
    status: 'new',
    priority: 'routine',
    patient: mockPatients[1],
    referrer: mockPractitioners[1],
    specialty: 'Dermatology',
    service: 'General Dermatology',
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

// Generate 48 more mock referrals
const additionalDermatologyReferrals: Referral[] = Array.from({ length: 48 }, (_, i) => {
  const index = i + 2; // Start from 2 since we already have 2 referrals
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Generate a date between 1 and 365 days ago
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    id: `DERM-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `D${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status: 'new',
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Dermatology',
    service: index % 3 === 0 ? 'General Dermatology' : 
             index % 3 === 1 ? 'Skin Cancer Service' : 'Pediatric Dermatology',
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
    attachments: index % 3 === 0 ? [
      {
        id: `DERM-ATT-${index}-1`,
        title: 'Clinical Photographs',
        contentType: 'image/jpeg',
        url: '/mock-data/rash-photos.jpg',
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
        size: 3568000
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allDermatologyReferrals = [...dermatologyReferrals, ...additionalDermatologyReferrals];
