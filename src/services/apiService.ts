
import { Referral, Attachment, ReferralStatus } from '@/types/referral';

// This is a mock API service that would be replaced with actual API calls
// to the NHS Digital E-Referral Service FHIR API in a production environment

const MOCK_DELAY = 1000; // Simulate network latency

// Mock referrals data
const mockReferrals: Referral[] = [
  {
    id: 'REF-2023-001',
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
      phone: '07700 900123'
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
      phone: '07700 900456'
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
      phone: '07700 900789'
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

// Get all referrals
export const fetchReferrals = async (): Promise<Referral[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReferrals);
    }, MOCK_DELAY);
  });
};

// Get single referral by ID
export const fetchReferralById = async (id: string): Promise<Referral | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = mockReferrals.find(ref => ref.id === id);
      resolve(referral || null);
    }, MOCK_DELAY);
  });
};

// Get attachment content (in a real app, this would fetch the actual file)
export const fetchAttachment = async (referralId: string, attachmentId: string): Promise<Attachment | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = mockReferrals.find(ref => ref.id === referralId);
      const attachment = referral?.attachments.find(att => att.id === attachmentId);
      resolve(attachment || null);
    }, MOCK_DELAY);
  });
};

// Update referral status
export const updateReferralStatus = async (
  referralId: string, 
  status: ReferralStatus, 
  notes?: string
): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      if (referralIndex !== -1) {
        mockReferrals[referralIndex].status = status;
        // In a real app, we'd also save the notes and send the appropriate HL7 message
        console.log(`Referral ${referralId} status updated to ${status}. Notes: ${notes || 'None'}`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, MOCK_DELAY);
  });
};

// In a real implementation, this would send an HL7 message to the EPR system
export const sendHL7Message = async (referralId: string, action: 'accept' | 'reject'): Promise<boolean> => {
  // Simulate sending HL7 message
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`HL7 message sent for referral ${referralId}: ${action.toUpperCase()}`);
      resolve(true);
    }, MOCK_DELAY);
  });
};
