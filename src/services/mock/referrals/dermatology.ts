
import { Referral, TriageStatus } from '@/types/referral';
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
    triageStatus: 'pre-assessment',
    tags: ['eczema', 'chronic-condition', 'steroid-trial'],
    clinicalInfo: {
      reason: 'Persistent rash on trunk and limbs',
      history: 'Patient presents with pruritic rash present for 3 months. Not responding to OTC treatments.',
      diagnosis: 'Suspected eczema/dermatitis',
      medications: ['Cetirizine 10mg OD', 'Hydrocortisone 1% cream BD'],
      allergies: [],
      notes: 'Referral from Access Group Elemental GP'
    },
    attachments: [
      {
        id: 'AGE-ATT-001-1',
        title: 'Clinical Photos - Torso',
        contentType: 'image/jpeg',
        url: '/mock-data/rash-photos-torso.jpg',
        date: '2024-04-26T15:30:00Z',
        size: 2845000
      }
    ]
  },
  {
    id: 'REF-2023-002',
    ubrn: '234567890123',
    created: '2023-06-14T14:20:00Z',
    status: 'accepted',
    priority: 'routine',
    patient: mockPatients[1],
    referrer: mockPractitioners[1],
    specialty: 'Dermatology',
    service: 'General Dermatology',
    triageStatus: 'waiting-list',
    tags: ['eczema', 'photos-attached', 'gp-managed'],
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

const additionalDermatologyReferrals: Referral[] = Array.from({ length: 48 }, (_, i) => {
  const index = i + 2;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Better distribution: 30% for dashboard, 70% for waiting list
  let status: Referral['status'];
  let triageStatus: TriageStatus;
  
  if (index <= 15) {
    // Dashboard referrals
    if (index % 3 === 0) {
      status = 'new';
      triageStatus = 'pre-assessment';
    } else if (index % 3 === 1) {
      status = 'accepted';
      triageStatus = 'assessed';
    } else {
      status = 'rejected';
      triageStatus = 'refer-to-another-specialty';
    }
  } else {
    // Waiting list referrals
    status = 'accepted';
    triageStatus = 'waiting-list';
  }
  
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Enhanced tag options for dermatology
  const tagOptions = [
    ['suspicious-lesion', 'two-week-wait'],
    ['acne', 'scarring', 'isotretinoin-candidate'],
    ['psoriasis', 'biologic-candidate'],
    ['eczema', 'atopic-dermatitis'],
    ['melanoma-concern', 'dermoscopy-required'],
    ['rosacea', 'laser-candidate'],
    ['hidradenitis', 'surgery-required'],
    ['hair-loss', 'alopecia'],
    ['skin-cancer', 'excision-required'],
    ['birthmark', 'cosmetic-concern']
  ];
  
  const attachmentOptions = [
    { title: 'Clinical Photographs', contentType: 'image/jpeg', url: '/mock-data/rash-photos.jpg', size: 3568000 },
    { title: 'Dermoscopy Images', contentType: 'image/jpeg', url: '/mock-data/dermoscopy.jpg', size: 4120000 },
    { title: 'Biopsy Report', contentType: 'application/pdf', url: '/mock-data/biopsy-report.pdf', size: 1890000 },
    { title: 'Allergy Test Results', contentType: 'application/pdf', url: '/mock-data/allergy-tests.pdf', size: 2340000 },
    { title: 'Previous Treatment Records', contentType: 'application/pdf', url: '/mock-data/treatment-history.pdf', size: 1567000 }
  ];
  
  return {
    id: `DERM-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `D${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Dermatology',
    service: index % 3 === 0 ? 'General Dermatology' : 
             index % 3 === 1 ? 'Skin Cancer Service' : 'Pediatric Dermatology',
    triageStatus,
    tags: tagOptions[index % tagOptions.length],
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
    attachments: index % 3 !== 2 ? [
      {
        id: `DERM-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      }
    ] : []
  };
});

export const allDermatologyReferrals = [...dermatologyReferrals, ...additionalDermatologyReferrals];
