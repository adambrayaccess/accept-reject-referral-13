
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const rheumatologyReferrals: Referral[] = [
  {
    id: 'REF-2023-004',
    ubrn: '456789012345',
    created: '2023-06-12T15:45:00Z',
    status: 'new',
    priority: 'routine',
    patient: mockPatients[3],
    referrer: mockPractitioners[3],
    specialty: 'Rheumatology',
    service: 'General Rheumatology',
    clinicalInfo: {
      reason: 'Joint pain and stiffness',
      history: 'Patient reports morning stiffness and joint pain in hands and knees for past 3 months.',
      diagnosis: 'Suspected rheumatoid arthritis',
      medications: ['Paracetamol PRN', 'Ibuprofen 400mg TDS'],
      allergies: ['None known'],
      notes: 'Family history of rheumatoid arthritis (mother)'
    },
    attachments: [
      {
        id: 'ATT-006',
        title: 'Blood Test Results',
        contentType: 'application/pdf',
        url: '/mock-data/bloods.pdf',
        date: '2023-06-11T14:30:00Z',
        size: 1567000
      }
    ]
  }
];
