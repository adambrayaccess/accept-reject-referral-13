
import { Referral } from '@/types/referral';
import { mockPatients } from '../patients';

// Find patients for psychiatry referrals
const johnSmith = mockPatients.find(p => p.id === 'P001')!;
const sarahDavis = mockPatients.find(p => p.id === 'P002')!;
const aliceJohnson = mockPatients.find(p => p.id === 'P003')!;
const davidWilson = mockPatients.find(p => p.id === 'P005')!;
const emmaThompson = mockPatients.find(p => p.id === 'P004')!;

export const psychiatryReferrals: Referral[] = [
  {
    id: 'PSY-2024-001',
    ubrn: 'RFR-2024-PSY-001',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'urgent',
    specialty: 'Psychiatry',
    service: 'Adult Psychiatry Service',
    patient: sarahDavis,
    referrer: {
      id: 'REF014',
      name: 'Dr. Robert Jones',
      role: 'Emergency Medicine Consultant',
      organization: 'Birmingham Emergency Department',
      contact: 'robert.jones@birmingham.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Acute manic episode with psychotic features - first episode',
      history: 'Patient brought by family after 1 week of elevated mood, decreased sleep (2-3 hours/night), grandiose delusions, hypersexuality, and reckless spending. No previous psychiatric history. Family history of bipolar disorder (mother).',
      diagnosis: 'Query Bipolar Affective Disorder - first manic episode',
      medications: ['Sertraline 50mg - stopped 2 weeks ago', 'Haloperidol 5mg IM - given in ED'],
      allergies: ['Aspirin - LIFE-THREATENING anaphylaxis, carries EpiPen', 'Latex - contact dermatitis', 'Peanuts - severe breathing difficulty']
    },
    created: '2024-02-18T03:20:00Z',
    attachments: [
      {
        id: 'DOC-PSY-001-001',
        title: 'Emergency Department Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-18T03:20:00Z',
        size: 187654
      },
      {
        id: 'DOC-PSY-001-002',
        title: 'Young Mania Rating Scale',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-18T04:00:00Z',
        size: 76543
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-18T03:20:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Urgent psychiatry referral from Emergency Department - first episode mania'
      }
    ],
    tags: ['bipolar', 'mania', 'psychosis', 'first-episode', 'family-history']
  },
  {
    id: 'PSY-2024-002',
    ubrn: 'RFR-2024-PSY-002',
    status: 'accepted',
    triageStatus: 'assessed',
    priority: 'routine',
    specialty: 'Psychiatry',
    service: 'Mood Disorders Clinic',
    patient: johnSmith,
    referrer: {
      id: 'REF015',
      name: 'Dr. Helen Carter',
      role: 'GP',
      organization: 'Manchester Central Practice',
      contact: 'helen.carter@manchester.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Treatment-resistant depression - multiple medication failures',
      history: 'Patient with 8-year history of major depression. Failed trials of sertraline, fluoxetine, venlafaxine, and mirtazapine. Current episode 18 months duration. Previous good response to CBT but depression returned. Considering ECT or alternative treatments.',
      diagnosis: 'Major Depressive Disorder - treatment resistant',
      medications: ['Lisinopril 10mg OD', 'Metformin 500mg BD', 'Venlafaxine 225mg OD', 'Quetiapine 50mg ON'],
      allergies: []
    },
    created: '2024-01-10T09:30:00Z',
    attachments: [
      {
        id: 'DOC-PSY-002-001',
        title: 'Medication History Summary',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-01-10T09:30:00Z',
        size: 145678
      }
    ],
    auditLog: [
      {
        timestamp: '2024-01-10T09:30:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Treatment-resistant depression referral'
      },
      {
        timestamp: '2024-01-15T14:20:00Z',
        action: 'referral_accepted',
        user: 'Dr. Amanda Wilson',
        notes: 'Accepted for mood disorders clinic assessment'
      }
    ],
    tags: ['treatment-resistant', 'depression', 'medication-failure', 'ect-consideration']
  },
  {
    id: 'PSY-2024-003',
    ubrn: 'RFR-2024-PSY-003',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'routine',
    specialty: 'Psychiatry',
    service: 'Adult ADHD Service',
    patient: emmaThompson,
    referrer: {
      id: 'REF016',
      name: 'Dr. Paul Thompson',
      role: 'Clinical Psychologist',
      organization: 'Leeds Psychology Service',
      contact: 'paul.thompson@leeds.nhs.uk'
    },
    clinicalInfo: {
      reason: 'ADHD assessment following positive screening - medication consideration',
      history: 'Patient completed ADHD screening with psychology service. Significant scores on attention and hyperactivity scales. Lifelong pattern of inattention, impulsivity. Academic underachievement despite high IQ. Requesting psychiatric assessment for medication.',
      diagnosis: 'Query ADHD - Combined Type',
      medications: ['Microgynon 30 - contraceptive'],
      allergies: []
    },
    created: '2024-02-22T16:15:00Z',
    attachments: [
      {
        id: 'DOC-PSY-003-001',
        title: 'Psychology ADHD Assessment Report',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-22T16:15:00Z',
        size: 234567
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-22T16:15:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'ADHD medication assessment referral from psychology'
      }
    ],
    tags: ['adhd', 'medication-assessment', 'psychology-referral']
  },
  {
    id: 'PSY-2024-004',
    ubrn: 'RFR-2024-PSY-004',
    status: 'accepted',
    triageStatus: 'waiting-list',
    priority: 'urgent',
    specialty: 'Psychiatry',
    service: 'Personality Disorder Service',
    patient: aliceJohnson,
    referrer: {
      id: 'REF017',
      name: 'Dr. Mark Stevens',
      role: 'Crisis Team Psychiatrist',
      organization: 'Liverpool Mental Health Trust',
      contact: 'mark.stevens@liverpool.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Suspected Borderline Personality Disorder - recurrent self-harm and interpersonal difficulties',
      history: 'Patient with pattern of unstable relationships, identity disturbance, recurrent self-harm (cutting), and fear of abandonment. Multiple crisis team contacts. Previous diagnosis of anxiety and depression. Pattern evident since teenage years.',
      diagnosis: 'Query Emotionally Unstable Personality Disorder',
      medications: ['Fluoxetine 40mg OD', 'Lorazepam 1mg PRN'],
      allergies: ['Latex - contact dermatitis']
    },
    created: '2024-02-05T13:45:00Z',
    attachments: [
      {
        id: 'DOC-PSY-004-001',
        title: 'Crisis Team Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-05T13:45:00Z',
        size: 198765
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-05T13:45:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Personality disorder assessment referral from crisis team'
      },
      {
        timestamp: '2024-02-12T10:30:00Z',
        action: 'referral_accepted',
        user: 'Dr. Sarah Mitchell',
        notes: 'Accepted for personality disorder service assessment'
      }
    ],
    tags: ['personality-disorder', 'borderline', 'self-harm', 'crisis-team']
  },
  {
    id: 'PSY-2024-005',
    ubrn: 'RFR-2024-PSY-005',
    status: 'new',
    triageStatus: 'pre-assessment',
    priority: 'routine',
    specialty: 'Psychiatry',
    service: 'Older Adult Psychiatry',
    patient: davidWilson,
    referrer: {
      id: 'REF018',
      name: 'Dr. Jennifer White',
      role: 'Geriatrician',
      organization: 'Bristol Royal Infirmary',
      contact: 'jennifer.white@bristol.nhs.uk'
    },
    clinicalInfo: {
      reason: 'Cognitive decline with behavioral changes - query dementia vs depression',
      history: 'Patient\'s family report 12-month history of memory problems, confusion, and personality changes. Previously sociable but now withdrawn and irritable. Some paranoid thoughts about neighbors. Scored 22/30 on MMSE. Query pseudodementia vs early dementia.',
      diagnosis: 'Query Dementia vs Depressive Pseudodementia',
      medications: ['Ramipril 5mg OD', 'Simvastatin 20mg ON - discontinued due to muscle pain'],
      allergies: []
    },
    created: '2024-02-25T11:20:00Z',
    attachments: [
      {
        id: 'DOC-PSY-005-001',
        title: 'Geriatric Assessment',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-25T11:20:00Z',
        size: 156789
      },
      {
        id: 'DOC-PSY-005-002',
        title: 'MMSE Results',
        contentType: 'application/pdf',
        url: '#',
        date: '2024-02-25T11:20:00Z',
        size: 89012
      }
    ],
    auditLog: [
      {
        timestamp: '2024-02-25T11:20:00Z',
        action: 'referral_received',
        user: 'System',
        notes: 'Cognitive assessment referral from geriatrics'
      }
    ],
    tags: ['cognitive-decline', 'dementia', 'behavioral-changes', 'older-adult']
  }
];

export const allPsychiatryReferrals = psychiatryReferrals;
