
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

export const mentalHealthReferrals: Referral[] = [
  {
    id: 'MH-2024-001',
    ubrn: 'MH12345678',
    created: '2024-05-18T10:45:00Z',
    status: 'accepted',
    priority: 'urgent',
    patient: mockPatients[3],
    referrer: mockPractitioners[2],
    specialty: 'Mental Health',
    service: 'Community Mental Health Team',
    triageStatus: 'waiting-list',
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

// Generate 49 more mock referrals with varied triage statuses
const additionalMentalHealthReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1; // Start from 1 since we already have 1 referral
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Distribute triage statuses across referrals
  const triageStatuses = ['pre-assessment', 'assessed', 'pre-admission-assessment', 'waiting-list', 'refer-to-another-specialty'];
  const triageStatus = triageStatuses[index % triageStatuses.length];
  
  // Set status based on triage status
  const status = triageStatus === 'refer-to-another-specialty' ? 'rejected' : 
                index % 6 === 0 ? 'rejected' : 
                index % 7 === 0 ? 'accepted' : 'new';
  
  // Generate a date between 1 and 365 days ago
  const daysAgo = Math.floor(Math.random() * 365) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    id: `MH-2024-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `MH${(1000000 + index).toString().padStart(8, '0')}`,
    created: date.toISOString(),
    status,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Mental Health',
    service: index % 4 === 0 ? 'Community Mental Health Team' : 
             index % 4 === 1 ? 'Crisis Team' : 
             index % 4 === 2 ? 'Eating Disorder Service' : 'IAPT',
    triageStatus,
    clinicalInfo: {
      reason: index % 5 === 0 ? 'Depression and anxiety' : 
              index % 5 === 1 ? 'Suicidal ideation' : 
              index % 5 === 2 ? 'Psychosis' : 
              index % 5 === 3 ? 'Eating disorder' : 'Substance misuse',
      history: `Patient with ${index % 2 === 0 ? 'acute' : 'chronic'} symptoms for past ${Math.floor(Math.random() * 12) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Major depressive disorder' : 
                index % 4 === 1 ? 'Bipolar affective disorder' : 
                index % 4 === 2 ? 'Schizophrenia' : 'Personality disorder',
      medications: ['Sertraline 50mg OD', 'Olanzapine 5mg ON'],
      allergies: index % 10 === 0 ? ['Sulfa drugs'] : [],
      notes: `Patient has ${index % 2 === 0 ? 'no significant' : 'family'} history of mental health conditions.`
    },
    attachments: index % 3 === 0 ? [
      {
        id: `MH-ATT-${index}-1`,
        title: 'Risk Assessment',
        contentType: 'application/pdf',
        url: '/mock-data/risk-assessment.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(), // 1 day before referral
        size: 1856000
      }
    ] : []
  };
});

// Combine the original referrals with the additional ones
export const allMentalHealthReferrals = [...mentalHealthReferrals, ...additionalMentalHealthReferrals];
