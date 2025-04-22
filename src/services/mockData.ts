import { Referral } from '@/types/referral';
import { generateECGData } from '@/utils/ecgGenerator';

// Mock referrals data
export const mockReferrals: Referral[] = [
  {
    id: 'REF-2023-001',
    ubrn: '123456789012',
    created: '2023-06-15T09:30:00Z',
    status: 'new',
    priority: 'urgent',
    patient: {
      id: 'P001',
      name: 'John Smith',
      birthDate: '1975-04-12',
      gender: 'male',
      nhsNumber: '123 456 7890',
      address: '15 London Road, Manchester, M1 4BT',
      phone: '07700 900123',
      medicalHistory: {
        vitalSigns: [
          {
            timestamp: '2023-06-01T09:30:00Z',
            news2: 1,
            temperature: 36.8,
            heartRate: 72,
            respiration: 14,
            oxygenSaturation: 97,
            bloodPressureSystolic: 130,
            bloodPressureDiastolic: 80
          },
          {
            timestamp: '2023-06-05T14:15:00Z',
            news2: 3,
            temperature: 37.2,
            heartRate: 88,
            respiration: 18,
            oxygenSaturation: 95,
            bloodPressureSystolic: 135,
            bloodPressureDiastolic: 85
          },
          {
            timestamp: '2023-06-10T11:45:00Z',
            news2: 5,
            temperature: 37.9,
            heartRate: 96,
            respiration: 22,
            oxygenSaturation: 94,
            bloodPressureSystolic: 145,
            bloodPressureDiastolic: 90
          },
          {
            timestamp: '2023-06-12T08:30:00Z',
            news2: 4,
            temperature: 37.6,
            heartRate: 92,
            respiration: 20,
            oxygenSaturation: 95,
            bloodPressureSystolic: 140,
            bloodPressureDiastolic: 85
          },
          {
            timestamp: '2023-06-14T16:00:00Z',
            news2: 2,
            temperature: 37.1,
            heartRate: 80,
            respiration: 16,
            oxygenSaturation: 96,
            bloodPressureSystolic: 135,
            bloodPressureDiastolic: 80
          }
        ],
        cardiograms: [
          {
            timestamp: '2023-06-10T12:30:00Z',
            data: generateECGData(),
            interpretation: 'Sinus rhythm with occasional premature ventricular complexes. No ST segment changes.'
          },
          {
            timestamp: '2023-06-14T09:15:00Z',
            data: generateECGData(),
            interpretation: 'Normal sinus rhythm. No significant changes from previous ECG.'
          }
        ]
      }
    },
    referrer: {
      id: 'DR001',
      name: 'Dr. Emily Johnson',
      role: 'General Practitioner',
      organization: 'Oakwood Medical Practice',
      contact: 'emily.johnson@nhs.net'
    },
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
    id: 'REF-2023-002',
    ubrn: '234567890123',
    created: '2023-06-14T14:20:00Z',
    status: 'new',
    priority: 'routine',
    patient: {
      id: 'P002',
      name: 'Sarah Williams',
      birthDate: '1982-09-23',
      gender: 'female',
      nhsNumber: '234 567 8901',
      address: '42 Park Avenue, Birmingham, B15 2TT',
      phone: '07700 900456',
      medicalHistory: {
        vitalSigns: [
          {
            timestamp: '2023-05-20T10:00:00Z',
            news2: 0,
            temperature: 36.6,
            heartRate: 68,
            respiration: 12,
            oxygenSaturation: 98,
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 75
          },
          {
            timestamp: '2023-06-05T11:30:00Z',
            news2: 1,
            temperature: 36.9,
            heartRate: 72,
            respiration: 14,
            oxygenSaturation: 97,
            bloodPressureSystolic: 125,
            bloodPressureDiastolic: 78
          },
          {
            timestamp: '2023-06-12T15:45:00Z',
            news2: 1,
            temperature: 36.8,
            heartRate: 70,
            respiration: 14,
            oxygenSaturation: 98,
            bloodPressureSystolic: 122,
            bloodPressureDiastolic: 76
          }
        ]
      }
    },
    referrer: {
      id: 'DR002',
      name: 'Dr. Michael Chen',
      role: 'General Practitioner',
      organization: 'Riverside Health Centre',
      contact: 'michael.chen@nhs.net'
    },
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
    patient: {
      id: 'P003',
      name: 'Robert Taylor',
      birthDate: '1968-11-30',
      gender: 'male',
      nhsNumber: '345 678 9012',
      address: '8 Queen Street, Liverpool, L1 1RH',
      phone: '07700 900789',
      medicalHistory: {
        vitalSigns: [
          {
            timestamp: '2023-06-12T08:00:00Z',
            news2: 7,
            temperature: 37.5,
            heartRate: 112,
            respiration: 24,
            oxygenSaturation: 92,
            bloodPressureSystolic: 155,
            bloodPressureDiastolic: 95
          },
          {
            timestamp: '2023-06-12T14:00:00Z',
            news2: 8,
            temperature: 37.8,
            heartRate: 118,
            respiration: 26,
            oxygenSaturation: 90,
            bloodPressureSystolic: 160,
            bloodPressureDiastolic: 100
          },
          {
            timestamp: '2023-06-12T20:00:00Z',
            news2: 6,
            temperature: 37.6,
            heartRate: 102,
            respiration: 22,
            oxygenSaturation: 93,
            bloodPressureSystolic: 150,
            bloodPressureDiastolic: 90
          },
          {
            timestamp: '2023-06-13T02:00:00Z',
            news2: 4,
            temperature: 37.2,
            heartRate: 92,
            respiration: 18,
            oxygenSaturation: 94,
            bloodPressureSystolic: 145,
            bloodPressureDiastolic: 85
          },
          {
            timestamp: '2023-06-13T08:00:00Z',
            news2: 3,
            temperature: 37.0,
            heartRate: 88,
            respiration: 16,
            oxygenSaturation: 95,
            bloodPressureSystolic: 140,
            bloodPressureDiastolic: 80
          }
        ],
        cardiograms: [
          {
            timestamp: '2023-06-12T09:00:00Z',
            data: generateECGData(),
            interpretation: 'Sinus tachycardia. ST segment depression in leads V4-V6, suggestive of myocardial ischemia.'
          },
          {
            timestamp: '2023-06-12T21:00:00Z',
            data: generateECGData(),
            interpretation: 'Improved ST segments. Persisting sinus tachycardia.'
          },
          {
            timestamp: '2023-06-13T09:00:00Z',
            data: generateECGData(),
            interpretation: 'Resolution of ST changes. Normal sinus rhythm.'
          }
        ]
      }
    },
    referrer: {
      id: 'DR003',
      name: 'Dr. Sarah Ahmed',
      role: 'Emergency Medicine',
      organization: 'City General Hospital',
      contact: 'sarah.ahmed@nhs.net'
    },
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
