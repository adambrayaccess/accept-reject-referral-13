
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const neurologyReferrals: Referral[] = [
  {
    id: 'REF-2023-003',
    ubrn: '345678901234',
    created: '2023-06-13T11:05:00Z',
    status: 'new',
    priority: 'emergency',
    patient: mockPatients[2],
    referrer: mockPractitioners[2],
    specialty: 'Neurology',
    service: 'Stroke Clinic',
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
