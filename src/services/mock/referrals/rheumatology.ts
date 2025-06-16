
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

// Generate 49 more mock referrals with varied triage statuses
const additionalRheumatologyReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1; // Start from 1 since we already have 1 referral
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Distribute triage statuses across referrals
  const triageStatuses: TriageStatus[] = ['pre-assessment', 'assessed', 'pre-admission-assessment', 'waiting-list', 'refer-to-another-specialty'];
  const triageStatus = triageStatuses[index % triageStatuses.length];
  
  // Set status based on triage status
  const status = triageStatus === 'refer-to-another-specialty' ? 'rejected' : 
                index % 6 === 0 ? 'rejected' : 
                index % 7 === 0 ? 'accepted' : 'new';
  
  // Generate a date between 1 and 365 days ago
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Define attachment options for rheumatology
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
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allRheumatologyReferrals = [...rheumatologyReferrals, ...additionalRheumatologyReferrals];
