
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';

// Find patients for mental health referrals
const johnSmith = mockPatients.find(p => p.id === 'P001')!;
const sarahDavis = mockPatients.find(p => p.id === 'P002')!;
const aliceJohnson = mockPatients.find(p => p.id === 'P003')!;
const davidWilson = mockPatients.find(p => p.id === 'P005')!;
const emmaThompson = mockPatients.find(p => p.id === 'P004')!;

export const mentalHealthReferrals: Referral[] = [
  {
    id: 'MH-2024-007',
    ubrn: 'RFR-2024-MH-007',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Mental Health',
    service: 'Adult Mental Health Services',
    patient: davidWilson,
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
    attachments: [
      {
        id: 'DOC-MH-007-001',
        title: 'Mental Health Referral',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-08T16:20:00Z',
        size: 134567
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-08T16:20:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Urgent mental health referral received from Dr. Rachel Green'
      }
    ],
    tags: ['suicide-risk', 'depression', 'urgent-assessment']
  },
  {
    id: 'MH-2024-002',
    ubrn: 'RFR-2024-MH-002',
    status: 'accepted',
    triageStatus: 'assessed',
    priority: 'urgent',
    specialty: 'Mental Health',
    service: 'Crisis Intervention Team',
    patient: sarahDavis,
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
    attachments: [
      {
        id: 'DOC-MH-002-001',
        title: 'Emergency Department Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-01-20T22:45:00Z',
        size: 198765
      },
      {
        id: 'DOC-MH-002-002',
        title: 'Police Section 136 Report',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-01-20T23:00:00Z',
        size: 87654
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-20T22:45:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Critical mental health referral from Emergency Department'
      },
      {
        timestamp: '2024-01-21T08:30:00Z',
        action: 'referral_accepted',
        user: 'Dr. Patricia Moore',
        notes: 'Critical referral accepted by Crisis Intervention Team'
      }
    ],
    tags: ['crisis', 'psychosis', 'police-involvement', 'life-threatening-allergies']
  },
  {
    id: 'MH-2024-008',
    ubrn: 'RFR-2024-MH-008',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'routine',
    specialty: 'Mental Health',
    service: 'ADHD Assessment Service',
    patient: emmaThompson,
    referrer: {
      id: 'REF011',
      name: 'Dr. Sarah Mitchell',
      role: 'GP',
      organization: 'Leeds Medical Centre',
      contact: 'sarah.mitchell@leeds.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Suspected ADHD - difficulty concentrating at work, impulsivity, restlessness',
      history: 'Patient reports lifelong difficulties with attention and concentration. Problems at work with meeting deadlines, frequent job changes. Impulsive spending habits. Sleep difficulties. No previous psychiatric history.',
      diagnosis: 'Query ADHD',
      medications: ['Microgynon 30 - contraceptive'],
      allergies: []
    },
    created: '2024-02-15T10:30:00Z',
    attachments: [
      {
        id: 'DOC-MH-008-001',
        title: 'ADHD Screening Questionnaire',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-15T10:30:00Z',
        size: 89432
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-15T10:30:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'ADHD assessment referral received from Dr. Sarah Mitchell'
      }
    ],
    tags: ['adhd', 'assessment', 'attention-deficit']
  },
  {
    id: 'MH-2024-009',
    ubrn: 'RFR-2024-MH-009',
    status: 'accepted',
    triageStatus: 'waiting-list',
    priority: 'routine',
    specialty: 'Mental Health',
    service: 'Anxiety and Depression Service',
    patient: johnSmith,
    referrer: {
      id: 'REF012',
      name: 'Dr. Michael Brown',
      role: 'GP',
      organization: 'Manchester Family Practice',
      contact: 'michael.brown@manchester.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Generalized anxiety disorder with panic attacks affecting daily functioning',
      history: 'Patient experiencing increasing anxiety over past 6 months. Daily panic attacks, avoidance behaviors, affecting work performance. Sleep disturbance. Previous episode 5 years ago responded well to CBT.',
      diagnosis: 'Generalized Anxiety Disorder with Panic Disorder',
      medications: ['Lisinopril 10mg OD - hypertension', 'Metformin 500mg BD - diabetes', 'Propranolol 40mg PRN - anxiety'],
      allergies: []
    },
    created: '2024-01-25T14:20:00Z',
    attachments: [
      {
        id: 'DOC-MH-009-001',
        title: 'GAD-7 Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-01-25T14:20:00Z',
        size: 67890
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-25T14:20:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Anxiety assessment referral received'
      },
      {
        timestamp: '2024-01-30T09:15:00Z',
        action: 'referral_accepted',
        user: 'Dr. Jennifer White',
        notes: 'Accepted for CBT assessment'
      }
    ],
    tags: ['anxiety', 'panic-attacks', 'cbt']
  },
  {
    id: 'MH-2024-010',
    ubrn: 'RFR-2024-MH-010',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Mental Health',
    service: 'Eating Disorders Service',
    patient: aliceJohnson,
    referrer: {
      id: 'REF013',
      name: 'Dr. Lisa Anderson',
      role: 'GP',
      organization: 'Liverpool Central Practice',
      contact: 'lisa.anderson@liverpool.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Suspected anorexia nervosa - significant weight loss, restrictive eating',
      history: 'Patient has lost 15kg over past 4 months. Restrictive eating patterns, excessive exercise, body dysmorphia. Family concerned about rapid weight loss. Previous history of anxiety.',
      diagnosis: 'Query Anorexia Nervosa',
      medications: [],
      allergies: ['Latex - contact dermatitis']
    },
    created: '2024-02-20T11:45:00Z',
    attachments: [
      {
        id: 'DOC-MH-010-001',
        title: 'Eating Disorder Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-20T11:45:00Z',
        size: 123456
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-20T11:45:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Urgent eating disorder referral received'
      }
    ],
    tags: ['eating-disorder', 'anorexia', 'weight-loss', 'urgent']
  }
];

// Export as allMentalHealthReferrals for consistency with index file
export const allMentalHealthReferrals = mentalHealthReferrals;
