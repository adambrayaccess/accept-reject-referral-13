
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

// Find the correct patient - should be patient004 (Emma Thompson)
const patient004 = mockPatients.find(p => p.id === 'P004');
const practitioner = mockPractitioners.find(p => p.id === 'DR001');

if (!patient004) {
  throw new Error('Patient P004 not found in mock patients');
}

if (!practitioner) {
  throw new Error('Practitioner DR001 not found in mock practitioners');
}

export const gastroenterologyReferrals: Referral[] = [
  {
    id: 'GAST-2024-001',
    ubrn: 'UBRN2024GAST001',
    created: '2024-01-15T10:30:00Z',
    status: 'accepted',
    priority: 'routine',
    patient: mockPatients[0], // P001 - John Smith
    referrer: practitioner,
    specialty: 'Gastroenterology',
    service: 'Upper GI',
    clinicalInfo: {
      reason: 'Recurrent epigastric pain and heartburn for 3 months',
      history: 'Patient reports burning sensation in upper abdomen, worse after meals. Associated with acid reflux symptoms. No weight loss or dysphagia. Previous H. pylori treatment 2 years ago. Family history of gastric ulcers.',
      diagnosis: 'GERD with possible peptic ulcer disease',
      medications: ['Omeprazole 20mg daily', 'Gaviscon as needed'],
      allergies: ['Penicillin - rash'],
      notes: 'Patient anxious about procedure. Prefers morning appointments. Non-smoker, moderate alcohol consumption (2-3 units/week). Mild epigastric tenderness on palpation. No masses or organomegaly. FBC, U&E, LFTs normal. H. pylori stool antigen negative.'
    },
    attachments: [],
    triageStatus: 'assessed',
    calculatedReferralAge: 12,
    calculatedPatientAge: 68,
    calculatedLocation: 'London',
    rttPathway: {
      clockStart: '2024-01-15T10:30:00Z',
      targetDate: '2024-05-13T10:30:00Z',
      status: 'incomplete',
      daysRemaining: 14,
      breachRisk: 'medium',
      milestones: [
        {
          id: 'referral-received',
          name: 'Referral Received',
          date: '2024-01-15T10:30:00Z',
          status: 'completed'
        },
        {
          id: 'triage-completed',
          name: 'Triage Completed',
          date: '2024-01-18T14:20:00Z',
          status: 'completed'
        },
        {
          id: 'appointment-booked',
          name: 'Appointment Booked',
          date: '2024-01-20T09:15:00Z',
          status: 'completed'
        },
        {
          id: 'first-appointment',
          name: 'First Appointment',
          targetDate: '2024-04-15T10:00:00Z',
          status: 'scheduled'
        }
      ]
    }
  },
  {
    id: 'GAST-2024-002',
    ubrn: 'UBRN2024GAST002',
    created: '2024-02-20T14:15:00Z',
    status: 'new',
    priority: 'urgent',
    patient: mockPatients[1], // P002 - Sarah Davis
    referrer: practitioner,
    specialty: 'Gastroenterology',
    service: 'Hepatology',
    clinicalInfo: {
      reason: 'Abnormal liver function tests and fatigue',
      history: 'Patient presents with 6-week history of fatigue and malaise. Incidental finding of deranged LFTs on routine blood work. No significant past medical history. No alcohol excess. No recent travel.',
      diagnosis: 'Hepatitis - cause unknown',
      medications: [],
      allergies: [],
      notes: 'Patient concerned about family history of liver disease in father. Non-smoker, minimal alcohol consumption. Mild hepatomegaly. No jaundice or stigmata of chronic liver disease. ALT 120 U/L, AST 95 U/L, ALP 180 U/L, Bilirubin 25 μmol/L'
    },
    attachments: [],
    triageStatus: 'pre-assessment',
    calculatedReferralAge: 8,
    calculatedPatientAge: 32,
    calculatedLocation: 'Manchester',
    rttPathway: {
      clockStart: '2024-02-20T14:15:00Z',
      targetDate: '2024-04-02T14:15:00Z',
      status: 'incomplete',
      daysRemaining: 5,
      breachRisk: 'high',
      milestones: [
        {
          id: 'referral-received',
          name: 'Referral Received',
          date: '2024-02-20T14:15:00Z',
          status: 'completed'
        },
        {
          id: 'triage-completed',
          name: 'Triage Completed',
          targetDate: '2024-02-22T14:15:00Z',
          status: 'pending'
        }
      ]
    }
  },
  {
    id: 'GAST-2024-003',
    ubrn: 'UBRN2024GAST003',
    created: '2024-03-10T11:45:00Z',
    status: 'new',
    priority: 'routine',
    patient: patient004, // P004 - Emma Thompson (with reasonable adjustments)
    referrer: practitioner,
    specialty: 'Gastroenterology',
    service: 'Lower GI',
    clinicalInfo: {
      reason: 'Chronic abdominal pain and altered bowel habits',
      history: 'Patient reports 4-month history of crampy abdominal pain, predominantly left-sided. Associated with alternating constipation and loose stools. Previous appendectomy 2015. No significant family history of bowel disease.',
      diagnosis: 'Possible IBS vs inflammatory bowel disease',
      medications: ['Loperamide as needed', 'Buscopan 10mg TDS'],
      allergies: [],
      notes: 'Patient has hearing difficulties and may need interpreter support. Non-smoker, social drinker. Mild left iliac fossa tenderness. No masses palpable. FBC normal, CRP <5, Calprotectin 45 μg/g'
    },
    attachments: [],
    triageStatus: 'pre-assessment',
    calculatedReferralAge: 7,
    calculatedPatientAge: 34,
    calculatedLocation: 'Leeds',
    rttPathway: {
      clockStart: '2024-03-10T11:45:00Z',
      targetDate: '2024-07-07T11:45:00Z',
      status: 'incomplete',
      daysRemaining: 95,
      breachRisk: 'low',
      milestones: [
        {
          id: 'referral-received',
          name: 'Referral Received',
          date: '2024-03-10T11:45:00Z',
          status: 'completed'
        },
        {
          id: 'triage-completed',
          name: 'Triage Completed',
          targetDate: '2024-03-12T11:45:00Z',
          status: 'pending'
        }
      ]
    }
  }
];
