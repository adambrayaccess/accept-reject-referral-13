
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
