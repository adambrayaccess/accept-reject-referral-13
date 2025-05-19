
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const mentalHealthReferrals: Referral[] = [
  {
    id: 'MH-2024-001',
    ubrn: 'MH12345678',
    created: '2024-05-18T10:45:00Z',
    status: 'new',
    priority: 'urgent',
    patient: mockPatients[3],
    referrer: mockPractitioners[2],
    specialty: 'Mental Health',
    service: 'Community Mental Health Team',
    clinicalInfo: {
      reason: 'Severe depression and anxiety',
      history: 'Patient reports worsening symptoms over the past 3 months. Unable to work or perform daily activities.',
      diagnosis: 'Major depressive disorder with anxiety',
      medications: ['Sertraline 50mg OD', 'Diazepam 2mg PRN'],
      allergies: [],
      notes: 'Patient has history of self-harm. Lives alone with limited social support network.'
    },
    attachments: [
      {
        id: 'MH-ATT-001',
        title: 'Risk Assessment',
        contentType: 'application/pdf',
        url: '/mock-data/risk-assessment.pdf',
        date: '2024-05-17T15:30:00Z',
        size: 1856000
      }
    ]
  }
];
