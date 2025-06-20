
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';
import { mockPractitioners } from '../practitioners';

// Find the correct patient - should be patient004 (Emma Thompson)
const patient004 = mockPatients.find(p => p.id === 'P004');
const practitioner = mockPractitioners.find(p => p.id === 'PRACT001');

if (!patient004) {
  throw new Error('Patient P004 not found in mock patients');
}

if (!practitioner) {
  throw new Error('Practitioner PRACT001 not found in mock practitioners');
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
      presentingComplaint: 'Recurrent epigastric pain and heartburn for 3 months',
      historyOfPresentingComplaint: 'Patient reports burning sensation in upper abdomen, worse after meals. Associated with acid reflux symptoms. No weight loss or dysphagia.',
      relevantHistory: 'Previous H. pylori treatment 2 years ago. Family history of gastric ulcers.',
      currentMedications: 'Omeprazole 20mg daily, Gaviscon as needed',
      allergies: 'Penicillin - rash',
      socialHistory: 'Non-smoker, moderate alcohol consumption (2-3 units/week)',
      examinationFindings: 'Mild epigastric tenderness on palpation. No masses or organomegaly.',
      investigations: 'FBC, U&E, LFTs normal. H. pylori stool antigen negative.',
      workingDiagnosis: 'GERD with possible peptic ulcer disease',
      questionForSpecialist: 'Please assess for endoscopy and consider PPI optimization',
      additionalInfo: 'Patient anxious about procedure. Prefers morning appointments.'
    },
    attachments: [],
    triageStatus: 'triaged',
    calculatedReferralAge: 12,
    calculatedPatientAge: 68,
    calculatedLocation: 'London',
    rttPathway: {
      clockStart: '2024-01-15T10:30:00Z',
      currentWeek: 12,
      targetWeeks: 18,
      breachDate: '2024-05-13T10:30:00Z',
      status: 'active',
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
      presentingComplaint: 'Abnormal liver function tests and fatigue',
      historyOfPresentingComplaint: 'Patient presents with 6-week history of fatigue and malaise. Incidental finding of deranged LFTs on routine blood work.',
      relevantHistory: 'No significant past medical history. No alcohol excess. No recent travel.',
      currentMedications: 'None',
      allergies: 'NKDA',
      socialHistory: 'Non-smoker, minimal alcohol consumption',
      examinationFindings: 'Mild hepatomegaly. No jaundice or stigmata of chronic liver disease.',
      investigations: 'ALT 120 U/L, AST 95 U/L, ALP 180 U/L, Bilirubin 25 μmol/L',
      workingDiagnosis: 'Hepatitis - cause unknown',
      questionForSpecialist: 'Please investigate cause of hepatitis and advise on management',
      additionalInfo: 'Patient concerned about family history of liver disease in father'
    },
    attachments: [],
    triageStatus: 'pre-assessment',
    calculatedReferralAge: 8,
    calculatedPatientAge: 32,
    calculatedLocation: 'Manchester',
    rttPathway: {
      clockStart: '2024-02-20T14:15:00Z',
      currentWeek: 8,
      targetWeeks: 6,
      breachDate: '2024-04-02T14:15:00Z',
      status: 'breached',
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
      presentingComplaint: 'Chronic abdominal pain and altered bowel habits',
      historyOfPresentingComplaint: 'Patient reports 4-month history of crampy abdominal pain, predominantly left-sided. Associated with alternating constipation and loose stools.',
      relevantHistory: 'Previous appendectomy 2015. No significant family history of bowel disease.',
      currentMedications: 'Loperamide as needed, Buscopan 10mg TDS',
      allergies: 'No known allergies',
      socialHistory: 'Non-smoker, social drinker',
      examinationFindings: 'Mild left iliac fossa tenderness. No masses palpable.',
      investigations: 'FBC normal, CRP <5, Calprotectin 45 μg/g',
      workingDiagnosis: 'Possible IBS vs inflammatory bowel disease',
      questionForSpecialist: 'Please assess for colonoscopy and rule out IBD',
      additionalInfo: 'Patient has hearing difficulties and may need interpreter support'
    },
    attachments: [],
    triageStatus: 'pre-assessment',
    calculatedReferralAge: 7,
    calculatedPatientAge: 34,
    calculatedLocation: 'Leeds',
    rttPathway: {
      clockStart: '2024-03-10T11:45:00Z',
      currentWeek: 7,
      targetWeeks: 18,
      breachDate: '2024-07-07T11:45:00Z',
      status: 'active',
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
