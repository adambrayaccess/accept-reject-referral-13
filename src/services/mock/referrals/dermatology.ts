
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';

// Find patients for dermatology referrals
const johnSmith = mockPatients.find(p => p.id === 'P001')!;
const sarahDavis = mockPatients.find(p => p.id === 'P002')!;
const aliceJohnson = mockPatients.find(p => p.id === 'P003')!;
const emmaThompson = mockPatients.find(p => p.id === 'P004')!;
const davidWilson = mockPatients.find(p => p.id === 'P005')!;

export const dermatologyReferrals: Referral[] = [
  {
    id: 'DERM-2024-001',
    ubrn: 'RFR-2024-DERM-001',
    status: 'accepted',
    triageStatus: 'assessed',
    priority: 'routine',
    specialty: 'Dermatology',
    service: 'General Dermatology',
    patient: sarahDavis, // Patient P002 with severe allergies
    referrer: {
      id: 'REF003',
      name: 'Dr. Michael Brown',
      role: 'GP',
      organization: 'Hillside Medical Practice',
      contact: 'michael.brown@hillsidemedical.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Suspicious skin lesion on back, irregular borders, changing appearance over 3 months',
      history: 'Patient noticed a new mole on upper back 6 months ago. Initially small and regular, but has grown in size and developed irregular borders. No family history of melanoma. Patient works outdoors and has history of sunburn.',
      diagnosis: 'Suspicious melanocytic lesion - ?malignant melanoma',
      medications: ['Aspirin 75mg OD (CONTRAINDICATED - LIFE-THREATENING ALLERGY)', 'Moisturizer for dry skin'],
      allergies: ['Aspirin - LIFE-THREATENING anaphylaxis', 'Latex - contact dermatitis', 'Peanuts - severe reaction with breathing difficulty']
    },
    created: '2024-01-15T09:30:00Z',
    updated: '2024-01-15T14:20:00Z',
    attachments: [
      {
        id: 'DOC-DERM-001-001',
        title: 'GP Referral Letter',
        contentType: 'referral_letter',
        url: '#',
        date: '2024-01-15T09:30:00Z',
        size: 156789
      },
      {
        id: 'DOC-DERM-001-002',
        title: 'Skin Lesion Photos',
        contentType: 'image',
        url: '#',
        date: '2024-01-15T09:45:00Z',
        size: 2345678
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-15T09:30:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Referral received from Dr. Michael Brown'
      },
      {
        timestamp: '2024-01-15T14:20:00Z',
        action: 'referral_accepted',
        user: 'Dr. Sarah Wilson',
        notes: 'Referral accepted for General Dermatology'
      }
    ],
    tags: ['urgent-review', 'potential-cancer', 'photo-documentation']
  },
  {
    id: 'AGE-2024-001',
    ubrn: 'RFR-2024-AGE-001',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Dermatology',
    service: 'Age Spot Removal',
    patient: johnSmith, // Patient P001 with penicillin and shellfish allergies
    referrer: {
      id: 'REF004',
      name: 'Dr. Lisa Anderson',
      role: 'GP',
      organization: 'Central Health Clinic',
      contact: 'lisa.anderson@centralhealth.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Multiple age spots on face and hands, patient requesting cosmetic removal',
      history: 'Patient has developed multiple brown spots on face and hands over past 5 years. No pain or irritation, purely cosmetic concern. Patient is otherwise healthy.',
      diagnosis: 'Solar lentigines (age spots)',
      medications: ['Penicillin 500mg - CONTRAINDICATED due to severe allergy', 'Multivitamin daily'],
      allergies: ['Penicillin - severe rash and facial swelling', 'Shellfish - hives and nausea']
    },
    created: '2024-02-10T11:15:00Z',
    updated: '2024-02-10T11:15:00Z',
    attachments: [
      {
        id: 'DOC-AGE-001-001',
        title: 'Age Spot Assessment',
        contentType: 'clinical_notes',
        url: '#',
        date: '2024-02-10T11:15:00Z',
        size: 89432
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-10T11:15:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Referral received from Dr. Lisa Anderson'
      }
    ],
    tags: ['cosmetic', 'elective']
  },
  {
    id: 'DERM-2024-003',
    ubrn: 'RFR-2024-DERM-003',
    status: 'accepted',
    triageStatus: 'assessed',
    priority: 'urgent',
    specialty: 'Dermatology',
    service: 'Dermatology Oncology',
    patient: emmaThompson, // Patient P004 with codeine and egg allergies
    referrer: {
      id: 'REF005',
      name: 'Dr. James Wilson',
      role: 'GP',
      organization: 'Riverside Practice',
      contact: 'james.wilson@riverside.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Rapidly growing nodular lesion on scalp, bleeding and ulceration',
      history: 'Patient developed a small bump on scalp 4 months ago. Has grown rapidly and now bleeds easily with minor trauma. Patient reports occasional pain and tenderness.',
      diagnosis: 'Squamous cell carcinoma - suspected',
      medications: ['Codeine - CONTRAINDICATED due to nausea/vomiting', 'Paracetamol 1g QDS', 'Topical antiseptic'],
      allergies: ['Codeine - severe nausea and confusion', 'Eggs - gastrointestinal upset']
    },
    created: '2024-01-28T14:45:00Z',
    updated: '2024-02-05T10:30:00Z',
    attachments: [
      {
        id: 'DOC-DERM-003-001',
        title: 'Urgent Referral Letter',
        contentType: 'referral_letter',
        url: '#',
        date: '2024-01-28T14:45:00Z',
        size: 178234
      },
      {
        id: 'DOC-DERM-003-002',
        title: 'Scalp Lesion Biopsy Results',
        contentType: 'pathology_report',
        url: '#',
        date: '2024-02-05T10:30:00Z',
        size: 245789
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-28T14:45:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Urgent referral received from Dr. James Wilson'
      },
      {
        timestamp: '2024-01-29T08:15:00Z',
        action: 'referral_accepted',
        user: 'Dr. Sarah Wilson',
        notes: 'Urgent referral accepted for Dermatology Oncology'
      },
      {
        timestamp: '2024-02-05T10:30:00Z',
        action: 'biopsy_completed',
        user: 'Dr. Sarah Wilson',
        notes: 'Scalp lesion biopsy completed and results uploaded'
      }
    ],
    tags: ['cancer-pathway', 'biopsy-required', 'urgent-oncology']
  }
];

// Export as allDermatologyReferrals for consistency with index file
export const allDermatologyReferrals = dermatologyReferrals;
