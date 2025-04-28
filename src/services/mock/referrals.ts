import { Referral } from '@/types/referral';
import { mockPatients } from './patients';
import { mockPractitioners } from './practitioners';

export const mockReferrals: Referral[] = [
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
    id: 'AGE-2024-001',
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
    id: 'AGE-2024-002',
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
  },
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
  },
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
  },
  {
    id: 'REF-2023-005',
    ubrn: '567890123456',
    created: '2023-06-11T09:15:00Z',
    status: 'new',
    priority: 'urgent',
    patient: mockPatients[4],
    referrer: mockPractitioners[4],
    specialty: 'Gastroenterology',
    service: 'Rapid Access',
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
