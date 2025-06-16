import { Referral, TriageStatus } from '@/types/referral';
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
    triageStatus: 'assessed',
    tags: ['joint-pain', 'ra-suspected', 'family-history'],
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

const additionalRheumatologyReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1;
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
  
  // Enhanced tag options for rheumatology
  const tagOptions = [
    ['rheumatoid-arthritis', 'dmard-candidate'],
    ['osteoarthritis', 'joint-replacement'],
    ['lupus', 'autoimmune'],
    ['gout', 'uric-acid-high'],
    ['fibromyalgia', 'pain-management'],
    ['psoriatic-arthritis', 'biologic-candidate'],
    ['ankylosing-spondylitis', 'hla-b27'],
    ['vasculitis', 'steroid-candidate'],
    ['polymyalgia', 'temporal-arteritis'],
    ['osteoporosis', 'fracture-risk']
  ];
  
  const attachmentOptions = [
    { title: 'Blood Test Results', contentType: 'application/pdf', url: '/mock-data/bloods.pdf', size: 1567000 },
    { title: 'Joint X-Rays', contentType: 'image/jpeg', url: '/mock-data/joint-xrays.jpg', size: 4230000 },
    { title: 'Rheumatology Assessment', contentType: 'application/pdf', url: '/mock-data/rheum-assessment.pdf', size: 2340000 },
    { title: 'Ultrasound Scan Report', contentType: 'application/pdf', url: '/mock-data/ultrasound.pdf', size: 3450000 },
    { title: 'Inflammatory Markers', contentType: 'application/pdf', url: '/mock-data/inflammatory-markers.pdf', size: 1890000 }
  ];
  
  return {
    id: `RHEU-2024-${index.toString().padStart(3, '0')}`,
    ubrn: `R${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Rheumatology',
    service: index % 3 === 0 ? 'General Rheumatology' : 
             index % 3 === 1 ? 'Early Inflammatory Arthritis' : 'Connective Tissue Disease',
    triageStatus,
    tags: tagOptions[index % tagOptions.length],
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Joint pain and stiffness' : 
              index % 4 === 1 ? 'Back pain' : 
              index % 4 === 2 ? 'Systemic symptoms with joint pain' : 'Gout',
      history: `Patient with ${index % 2 === 0 ? 'new onset' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Suspected rheumatoid arthritis' : 
                index % 4 === 1 ? 'Suspected ankylosing spondylitis' : 
                index % 4 === 2 ? 'Suspected lupus' : 'Suspected gout',
      medications: ['Paracetamol PRN', 'Ibuprofen 400mg TDS'],
      allergies: index % 5 === 0 ? ['Sulfa drugs'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of rheumatological conditions.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `RHEU-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      }
    ] : []
  };
});

// Add 7 additional waiting list test records
const additionalWaitingListReferrals: Referral[] = Array.from({ length: 7 }, (_, i) => {
  const index = i + 100;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent'];
  const priority = priorityOptions[index % 2];
  
  const daysAgo = Math.floor(Math.random() * 180) + 30;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  const tagOptions = [
    ['rheumatoid-arthritis', 'stable-dmards'],
    ['osteoarthritis', 'conservative-management'],
    ['fibromyalgia', 'multidisciplinary'],
    ['lupus', 'monitoring'],
    ['gout', 'prophylaxis'],
    ['psoriatic-arthritis', 'biologic-review'],
    ['osteoporosis', 'bisphosphonate']
  ];
  
  return {
    id: `RHEU-WL-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `RWL${(2000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Rheumatology',
    service: index % 3 === 0 ? 'General Rheumatology' : 
             index % 3 === 1 ? 'Early Inflammatory Arthritis' : 'Biologics Clinic',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    clinicalInfo: {
      reason: index % 4 === 0 ? 'RA monitoring' : 
              index % 4 === 1 ? 'Joint replacement assessment' : 
              index % 4 === 2 ? 'Biologic therapy review' : 'Pain management',
      history: `Patient with established rheumatological condition requiring ongoing care.`,
      diagnosis: index % 3 === 0 ? 'Rheumatoid arthritis' : 
                index % 3 === 1 ? 'Osteoarthritis' : 'Fibromyalgia',
      medications: ['Methotrexate 15mg weekly', 'Folic acid 5mg weekly'],
      allergies: index % 7 === 0 ? ['Sulfa drugs'] : [],
      notes: `Waiting list patient for routine rheumatology follow-up.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `RHEU-WL-ATT-${index}-1`,
        title: 'Blood Test Results',
        contentType: 'application/pdf',
        url: '/mock-data/bloods.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 1567000
      }
    ] : []
  };
});

// Add 7 additional test records for Dashboard
const additionalDashboardReferrals: Referral[] = Array.from({ length: 7 }, (_, i) => {
  const index = i + 200;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const created = date.toISOString();
  
  const tagOptions = [
    ['joint-pain', 'dashboard-test'],
    ['rheumatoid-arthritis', 'dashboard-test'],
    ['osteoarthritis', 'dashboard-test'],
    ['lupus', 'dashboard-test'],
    ['gout', 'dashboard-test'],
    ['fibromyalgia', 'dashboard-test'],
    ['vasculitis', 'dashboard-test']
  ];
  
  return {
    id: `RHEU-DASH-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `RDASH${(3000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Rheumatology',
    service: index % 3 === 0 ? 'General Rheumatology' : 
             index % 3 === 1 ? 'Early Inflammatory Arthritis' : 'Connective Tissue Disease',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Joint pain and stiffness' : 
              index % 4 === 1 ? 'Back pain' : 
              index % 4 === 2 ? 'Systemic symptoms with joint pain' : 'Gout',
      history: `Dashboard test patient with rheumatological symptoms for past ${Math.floor(Math.random() * 6) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Suspected rheumatoid arthritis' : 
                index % 4 === 1 ? 'Suspected ankylosing spondylitis' : 
                index % 4 === 2 ? 'Suspected lupus' : 'Suspected gout',
      medications: ['Paracetamol PRN', 'Ibuprofen 400mg TDS'],
      allergies: index % 7 === 0 ? ['Sulfa drugs'] : [],
      notes: `Dashboard test referral for rheumatology assessment.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `RHEU-DASH-ATT-${index}-1`,
        title: 'Blood Test Results',
        contentType: 'application/pdf',
        url: '/mock-data/bloods.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 1567000
      }
    ] : []
  };
});

export const allRheumatologyReferrals = [...rheumatologyReferrals, ...additionalRheumatologyReferrals, ...additionalWaitingListReferrals, ...additionalDashboardReferrals];
