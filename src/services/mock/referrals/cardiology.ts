
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
    status: 'new',
    priority: 'urgent',
    patient: mockPatients[2],
    referrer: mockPractitioners[4],
    specialty: 'Cardiology',
    service: 'Rapid Access Chest Pain Clinic',
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
