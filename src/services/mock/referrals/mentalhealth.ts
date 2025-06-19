
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';

// Find patients for mental health referrals
const johnSmith = mockPatients.find(p => p.id === 'P001')!;
const sarahDavis = mockPatients.find(p => p.id === 'P002')!;
const aliceJohnson = mockPatients.find(p => p.id === 'P003')!;
const davidWilson = mockPatients.find(p => p.id === 'P005')!;

export const mentalHealthReferrals: Referral[] = [
  {
    id: 'MH-2024-007',
    ubrn: 'RFR-2024-MH-007',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Mental Health',
    service: 'Adult Mental Health Services',
    patient: davidWilson, // Patient P005 with amoxicillin and pollen allergies
    referrer: {
      id: 'REF010',
      name: 'Dr. Rachel Green',
      role: 'GP',
      organization: 'Community Health Centre',
      contact: 'rachel.green@community.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Severe depression with suicidal ideation following relationship breakdown',
      history: 'Patient reports low mood for 3 months following end of long-term relationship. Sleep disturbance, loss of appetite, feelings of worthlessness. Recent increase in alcohol consumption. Expressed passive suicidal thoughts.',
      diagnosis: 'Major depressive episode, moderate to severe',
      medications: ['Amoxicillin - CONTRAINDICATED severe allergic reaction', 'Sertraline 50mg OD started last week', 'Lorazepam 1mg PRN for anxiety'],
      allergies: ['Amoxicillin - severe rash and breathing difficulty', 'Tree Pollen - seasonal rhinitis']
    },
    created: '2024-02-08T16:20:00Z',
    updated: '2024-02-08T16:20:00Z',
    documents: [
      {
        id: 'DOC-MH-007-001',
        name: 'Mental Health Referral',
        type: 'referral_letter',
        uploadedAt: '2024-02-08T16:20:00Z',
        size: 134567,
        analysisStatus: 'completed'
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-08T16:20:00Z',
        action: 'referral_received',
        user: 'System',
        details: 'Urgent mental health referral received from Dr. Rachel Green'
      }
    ],
    tags: ['suicide-risk', 'depression', 'urgent-assessment']
  },
  {
    id: 'MH-2024-002',
    ubrn: 'RFR-2024-MH-002',
    status: 'accepted',
    triageStatus: 'urgent',
    priority: 'critical',
    specialty: 'Mental Health',
    service: 'Crisis Intervention Team',
    patient: sarahDavis, // Patient P002 with life-threatening aspirin allergy
    referrer: {
      id: 'REF006',
      name: 'Dr. Thomas Clark',
      role: 'Emergency Medicine Consultant',
      organization: 'Manchester Royal Infirmary',
      contact: 'thomas.clark@mri.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Acute psychotic episode with risk to self and others, brought in by police',
      history: 'Patient found by police in distressed state, exhibiting paranoid delusions and auditory hallucinations. Previous mental health history unknown. Family reports 2-week decline in mental state.',
      diagnosis: 'Acute psychotic episode - cause unknown',
      medications: ['Aspirin - LIFE-THREATENING ALLERGY - anaphylaxis risk', 'Haloperidol 5mg IM administered in ED', 'Lorazepam 2mg IM for agitation'],
      allergies: ['Aspirin - LIFE-THREATENING anaphylaxis, carries EpiPen', 'Latex - contact dermatitis', 'Peanuts - severe breathing difficulty']
    },
    created: '2024-01-20T22:45:00Z',
    updated: '2024-01-21T08:30:00Z',
    documents: [
      {
        id: 'DOC-MH-002-001',
        name: 'Emergency Department Assessment',
        type: 'clinical_notes',
        uploadedAt: '2024-01-20T22:45:00Z',
        size: 198765,
        analysisStatus: 'completed'
      },
      {
        id: 'DOC-MH-002-002',
        name: 'Police Section 136 Report',
        type: 'legal_document',
        uploadedAt: '2024-01-20T23:00:00Z',
        size: 87654,
        analysisStatus: 'completed'
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-20T22:45:00Z',
        action: 'referral_received',
        user: 'System',
        details: 'Critical mental health referral from Emergency Department'
      },
      {
        timestamp: '2024-01-21T08:30:00Z',
        action: 'referral_accepted',
        user: 'Dr. Patricia Moore',
        details: 'Critical referral accepted by Crisis Intervention Team'
      }
    ],
    tags: ['crisis', 'psychosis', 'police-involvement', 'life-threatening-allergies']
  }
];
