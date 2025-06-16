
import { Referral, TriageStatus } from '@/types/referral';
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
    tags: ['depression', 'anxiety', 'self-harm-risk'],
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

const additionalMentalHealthReferrals: Referral[] = Array.from({ length: 49 }, (_, i) => {
  const index = i + 1;
  const patientIndex = index % mockPatients.length;
  const practitionerIndex = index % mockPractitioners.length;
  const priorityOptions: Referral['priority'][] = ['routine', 'urgent', 'emergency'];
  const priority = priorityOptions[index % 3];
  
  // Ensure all referrals have waiting-list triage status
  const triageStatus: TriageStatus = 'waiting-list';
  const status = 'accepted';
  
  const daysAgo = Math.floor(Math.random() * 180) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  // Enhanced tag options for mental health - ensure every referral has at least 2 tags
  const tagOptions = [
    ['depression', 'medication-review', 'therapy-indicated'],
    ['anxiety', 'cbt-candidate', 'panic-disorder'],
    ['bipolar', 'mood-stabilizer', 'lithium-monitoring'],
    ['psychosis', 'antipsychotic', 'first-episode'],
    ['ptsd', 'trauma-therapy', 'emdr-candidate'],
    ['eating-disorder', 'specialist-unit', 'nutritional-support'],
    ['substance-misuse', 'dual-diagnosis', 'detox-required'],
    ['personality-disorder', 'dbt-candidate', 'borderline-traits'],
    ['self-harm', 'safety-planning', 'crisis-intervention'],
    ['suicidal-ideation', 'crisis-team', 'risk-assessment']
  ];
  
  const attachmentOptions = [
    { title: 'Risk Assessment', contentType: 'application/pdf', url: '/mock-data/risk-assessment.pdf', size: 1856000 },
    { title: 'PHQ-9 Questionnaire', contentType: 'application/pdf', url: '/mock-data/phq9.pdf', size: 1234000 },
    { title: 'Previous Discharge Summary', contentType: 'application/pdf', url: '/mock-data/discharge-summary.pdf', size: 2340000 },
    { title: 'Care Plan', contentType: 'application/pdf', url: '/mock-data/care-plan.pdf', size: 1789000 },
    { title: 'Medication Review', contentType: 'application/pdf', url: '/mock-data/med-review.pdf', size: 1456000 }
  ];
  
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
    tags: tagOptions[index % tagOptions.length],
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
    attachments: index % 2 === 0 ? [
      {
        id: `MH-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      }
    ] : index % 5 === 0 ? [
      {
        id: `MH-ATT-${index}-1`,
        ...attachmentOptions[index % attachmentOptions.length],
        date: new Date(date.getTime() - 86400000).toISOString(),
      },
      {
        id: `MH-ATT-${index}-2`,
        ...attachmentOptions[(index + 1) % attachmentOptions.length],
        date: new Date(date.getTime() - 172800000).toISOString(),
      }
    ] : []
  };
});

export const allMentalHealthReferrals = [...mentalHealthReferrals, ...additionalMentalHealthReferrals];
