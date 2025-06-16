import { Referral, TriageStatus } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';
import { generateMockAppointment, generateSubReferralData } from '../appointmentGenerator';

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
  const created = date.toISOString();
  
  // Enhanced tag options for mental health
  const tagOptions = [
    ['depression', 'medication-review'],
    ['anxiety', 'cbt-candidate'],
    ['bipolar', 'mood-stabilizer'],
    ['psychosis', 'antipsychotic'],
    ['ptsd', 'trauma-therapy'],
    ['eating-disorder', 'specialist-unit'],
    ['substance-misuse', 'dual-diagnosis'],
    ['personality-disorder', 'dbt-candidate'],
    ['self-harm', 'safety-planning'],
    ['suicidal-ideation', 'crisis-team']
  ];
  
  const attachmentOptions = [
    { title: 'Risk Assessment', contentType: 'application/pdf', url: '/mock-data/risk-assessment.pdf', size: 1856000 },
    { title: 'PHQ-9 Questionnaire', contentType: 'application/pdf', url: '/mock-data/phq9.pdf', size: 1234000 },
    { title: 'Previous Discharge Summary', contentType: 'application/pdf', url: '/mock-data/discharge-summary.pdf', size: 2340000 },
    { title: 'Care Plan', contentType: 'application/pdf', url: '/mock-data/care-plan.pdf', size: 1789000 },
    { title: 'Medication Review', contentType: 'application/pdf', url: '/mock-data/med-review.pdf', size: 1456000 }
  ];

  // Generate appointment and sub-referral data
  const appointmentDetails = generateMockAppointment(`MH-2024-${(index + 1).toString().padStart(3, '0')}`, created, 'Mental Health');
  const subReferralData = generateSubReferralData(`MH-2024-${(index + 1).toString().padStart(3, '0')}`);
  
  return {
    id: `MH-2024-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `MH${(1000000 + index).toString().padStart(8, '0')}`,
    created,
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
    appointmentDetails,
    ...subReferralData,
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
    ['depression', 'stable-medication'],
    ['anxiety', 'cbt-completed'],
    ['bipolar', 'lithium-monitoring'],
    ['adhd', 'titration'],
    ['ptsd', 'emdr-candidate'],
    ['ocd', 'exposure-therapy'],
    ['eating-disorder', 'recovery-phase']
  ];

  const appointmentDetails = generateMockAppointment(`MH-WL-${(index + 1).toString().padStart(3, '0')}`, created, 'Mental Health');
  const subReferralData = generateSubReferralData(`MH-WL-${(index + 1).toString().padStart(3, '0')}`);
  
  return {
    id: `MH-WL-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `MHWL${(2000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Mental Health',
    service: index % 4 === 0 ? 'Community Mental Health Team' : 
             index % 4 === 1 ? 'IAPT' : 
             index % 4 === 2 ? 'Eating Disorder Service' : 'ADHD Service',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    appointmentDetails,
    ...subReferralData,
    clinicalInfo: {
      reason: index % 4 === 0 ? 'Depression follow-up' : 
              index % 4 === 1 ? 'Anxiety management' : 
              index % 4 === 2 ? 'Bipolar monitoring' : 'ADHD assessment',
      history: `Patient with stable mental health condition requiring ongoing specialist support.`,
      diagnosis: index % 3 === 0 ? 'Major depressive disorder' : 
                index % 3 === 1 ? 'Generalized anxiety disorder' : 'Bipolar affective disorder',
      medications: ['Sertraline 100mg OD', 'Quetiapine 25mg ON'],
      allergies: index % 7 === 0 ? ['Sulfa drugs'] : [],
      notes: `Waiting list patient for routine mental health follow-up.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `MH-WL-ATT-${index}-1`,
        title: 'PHQ-9 Questionnaire',
        contentType: 'application/pdf',
        url: '/mock-data/phq9.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 1234000
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
    ['depression', 'dashboard-test'],
    ['anxiety', 'dashboard-test'],
    ['bipolar', 'dashboard-test'],
    ['psychosis', 'dashboard-test'],
    ['ptsd', 'dashboard-test'],
    ['eating-disorder', 'dashboard-test'],
    ['substance-misuse', 'dashboard-test']
  ];

  const appointmentDetails = generateMockAppointment(`MH-DASH-${(index + 1).toString().padStart(3, '0')}`, created, 'Mental Health');
  const subReferralData = generateSubReferralData(`MH-DASH-${(index + 1).toString().padStart(3, '0')}`);
  
  return {
    id: `MH-DASH-${(index + 1).toString().padStart(3, '0')}`,
    ubrn: `MHDASH${(3000000 + index).toString().padStart(8, '0')}`,
    created,
    status: 'accepted' as const,
    priority,
    patient: mockPatients[patientIndex],
    referrer: mockPractitioners[practitionerIndex],
    specialty: 'Mental Health',
    service: index % 4 === 0 ? 'Community Mental Health Team' : 
             index % 4 === 1 ? 'Crisis Team' : 
             index % 4 === 2 ? 'Eating Disorder Service' : 'IAPT',
    triageStatus: 'waiting-list' as const,
    tags: tagOptions[i % tagOptions.length],
    appointmentDetails,
    ...subReferralData,
    clinicalInfo: {
      reason: index % 5 === 0 ? 'Depression and anxiety' : 
              index % 5 === 1 ? 'Suicidal ideation' : 
              index % 5 === 2 ? 'Psychosis' : 
              index % 5 === 3 ? 'Eating disorder' : 'Substance misuse',
      history: `Dashboard test patient with mental health symptoms for past ${Math.floor(Math.random() * 6) + 1} months.`,
      diagnosis: index % 4 === 0 ? 'Major depressive disorder' : 
                index % 4 === 1 ? 'Bipolar affective disorder' : 
                index % 4 === 2 ? 'Schizophrenia' : 'Personality disorder',
      medications: ['Sertraline 50mg OD', 'Olanzapine 5mg ON'],
      allergies: index % 7 === 0 ? ['Sulfa drugs'] : [],
      notes: `Dashboard test referral for mental health assessment.`
    },
    attachments: index % 2 === 0 ? [
      {
        id: `MH-DASH-ATT-${index}-1`,
        title: 'Risk Assessment',
        contentType: 'application/pdf',
        url: '/mock-data/risk-assessment.pdf',
        date: new Date(date.getTime() - 86400000).toISOString(),
        size: 1856000
      }
    ] : []
  };
});

export const allMentalHealthReferrals = [...mentalHealthReferrals, ...additionalMentalHealthReferrals, ...additionalWaitingListReferrals, ...additionalDashboardReferrals];
