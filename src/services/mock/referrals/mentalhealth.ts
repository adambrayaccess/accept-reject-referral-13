import { Referral } from '@/types/referral';
import { mockPractitioners } from '../practitioners';
import { mockPatients } from '../patients';

export const mentalHealthReferrals: Referral[] = [
  {
    "id": "REF-MH-001",
    "ubrn": "2023-MH-001-1234",
    "created": "2023-01-15T14:30:00Z",
    "status": "pending",
    "priority": "urgent",
    "patient": {
      "id": "P001",
      "name": "John Smith",
      "birthDate": "1985-07-20",
      "gender": "male",
      "nhsNumber": "1234567890"
    },
    "referrer": {
      "id": "PRAC-001",
      "name": "Dr. Alice Johnson",
      "role": "GP",
      "organization": "City Medical Practice"
    },
    "specialty": "Mental Health",
    "service": "Adult Mental Health",
    "clinicalInfo": {
      "reason": "Severe depression and suicidal ideation",
      "history": "Previous episodes of depression, family history of mental illness",
      "diagnosis": "Major Depressive Disorder",
      "medications": ["Sertraline 100mg"],
      "allergies": ["None known"],
      "notes": "Requires immediate psychiatric evaluation"
    },
    "attachments": [],
    "tags": ["depression", "suicidal", "urgent"],
    "calculatedReferralAge": 15,
    "calculatedPatientAge": 38,
    "calculatedLocation": "City Central",
    "rttPathway": {
      "startDate": "2023-01-15T14:30:00Z",
      "targetDate": "2023-03-15T14:30:00Z",
      "daysRemaining": 45,
      "breachRisk": "high",
      "milestones": [
        {
          "name": "Referral Received",
          "date": "2023-01-15T14:30:00Z",
          "status": "completed"
        },
        {
          "name": "Triage",
          "targetDate": "2023-01-22T14:30:00Z",
          "status": "pending"
        },
        {
          "name": "Assessment",
          "targetDate": "2023-02-15T14:30:00Z",
          "status": "pending"
        }
      ]
    },
    "carePathway": {
      "name": "Crisis Intervention",
      "stage": "Initial Assessment",
      "expectedDuration": 7,
      "nextReviewDate": "2023-01-22T14:30:00Z"
    },
    "teamId": "TEAM-MH-001"
  },
  {
    "id": "REF-MH-002",
    "ubrn": "2023-MH-002-5678",
    "created": "2023-02-20T10:00:00Z",
    "status": "active",
    "priority": "routine",
    "patient": {
      "id": "P002",
      "name": "Emily White",
      "birthDate": "1992-04-10",
      "gender": "female",
      "nhsNumber": "9876543210"
    },
    "referrer": {
      "id": "PRAC-002",
      "name": "Dr. Ben Carter",
      "role": "Psychologist",
      "organization": "Private Therapy Clinic"
    },
    "specialty": "Mental Health",
    "service": "Eating Disorders",
    "clinicalInfo": {
      "reason": "Anorexia nervosa, severe weight loss",
      "history": "Long-standing eating disorder, previous hospitalizations",
      "diagnosis": "Anorexia Nervosa",
      "medications": ["None"],
      "allergies": ["None known"],
      "notes": "Requires specialized eating disorder treatment"
    },
    "attachments": [],
    "tags": ["eating disorder", "anorexia", "specialized treatment"],
    "calculatedReferralAge": 20,
    "calculatedPatientAge": 31,
    "calculatedLocation": "Suburb West",
    "rttPathway": {
      "startDate": "2023-02-20T10:00:00Z",
      "targetDate": "2023-04-20T10:00:00Z",
      "daysRemaining": 60,
      "breachRisk": "medium",
      "milestones": [
        {
          "name": "Referral Received",
          "date": "2023-02-20T10:00:00Z",
          "status": "completed"
        },
        {
          "name": "Assessment",
          "targetDate": "2023-03-10T10:00:00Z",
          "status": "pending"
        },
        {
          "name": "Therapy",
          "targetDate": "2023-04-20T10:00:00Z",
          "status": "pending"
        }
      ]
    },
    "carePathway": {
      "name": "Eating Disorder Program",
      "stage": "Assessment",
      "expectedDuration": 90,
      "nextReviewDate": "2023-03-20T10:00:00Z"
    },
    "teamId": "TEAM-ED-001"
  },
  {
    "id": "REF-MH-003",
    "ubrn": "2023-MH-003-9012",
    "created": "2023-03-10T08:45:00Z",
    "status": "rejected",
    "priority": "routine",
    "patient": {
      "id": "P003",
      "name": "David Brown",
      "birthDate": "1978-11-05",
      "gender": "male",
      "nhsNumber": "5432109876"
    },
    "referrer": {
      "id": "PRAC-003",
      "name": "Dr. Carol Davis",
      "role": "GP",
      "organization": "Rural Health Center"
    },
    "specialty": "Mental Health",
    "service": "Addiction Services",
    "clinicalInfo": {
      "reason": "Alcohol dependence, relapse after sobriety",
      "history": "Previous addiction treatment, multiple relapses",
      "diagnosis": "Alcohol Dependence Syndrome",
      "medications": ["Acamprosate"],
      "allergies": ["Sulfa drugs"],
      "notes": "Requires intensive addiction counseling and support"
    },
    "attachments": [],
    "tags": ["addiction", "alcohol", "relapse"],
    "calculatedReferralAge": 25,
    "calculatedPatientAge": 45,
    "calculatedLocation": "Rural Area",
    "rttPathway": {
      "startDate": "2023-03-10T08:45:00Z",
      "targetDate": "2023-05-10T08:45:00Z",
      "daysRemaining": 50,
      "breachRisk": "medium",
      "milestones": [
        {
          "name": "Referral Received",
          "date": "2023-03-10T08:45:00Z",
          "status": "completed"
        },
        {
          "name": "Assessment",
          "targetDate": "2023-03-25T08:45:00Z",
          "status": "pending"
        },
        {
          "name": "Group Therapy",
          "targetDate": "2023-04-15T08:45:00Z",
          "status": "pending"
        }
      ]
    },
    "carePathway": {
      "name": "Addiction Recovery Program",
      "stage": "Assessment",
      "expectedDuration": 120,
      "nextReviewDate": "2023-04-10T08:45:00Z"
    },
    "teamId": "TEAM-AS-001"
  },
  {
    id: 'REF-MH-004',
    ubrn: '2024-MH-004-7892',
    created: '2023-05-15T09:30:00Z',
    status: 'received',
    priority: 'routine',
    patient: mockPatients.find(p => p.id === 'P004')!,
    referrer: mockPractitioners.find(p => p.id === 'PRAC-003')!,
    specialty: 'Mental Health',
    service: 'Adult Mental Health',
    clinicalInfo: {
      reason: 'Depression and anxiety symptoms affecting daily functioning. Patient reports low mood, difficulty sleeping, and increased fatigue over the past 6 months.',
      history: 'Patient has a history of mild depression treated with sertraline. Recent vitamin D deficiency and iron deficiency may be contributing factors. Previous brief contact with mental health services following police section 136.',
      diagnosis: 'Mixed anxiety and depressive disorder',
      medications: ['Sertraline 50mg daily', 'Vitamin D3 4000 IU daily', 'Ferrous Fumarate 210mg twice daily'],
      allergies: ['No known drug allergies'],
      notes: 'Patient has complex history including recent MHA sections. Requires comprehensive assessment considering both mental health and physical health factors.'
    },
    attachments: [],
    tags: ['depression', 'anxiety', 'mha-history', 'vitamin-deficiency'],
    calculatedReferralAge: 45,
    calculatedPatientAge: 33,
    calculatedLocation: 'Leeds',
    rttPathway: {
      startDate: '2023-05-15T09:30:00Z',
      targetDate: '2023-07-14T09:30:00Z',
      daysRemaining: 25,
      breachRisk: 'low',
      milestones: [
        {
          name: 'Referral Received',
          date: '2023-05-15T09:30:00Z',
          status: 'completed'
        },
        {
          name: 'Triage Complete',
          targetDate: '2023-05-22T09:30:00Z',
          status: 'pending'
        },
        {
          name: 'First Appointment',
          targetDate: '2023-07-14T09:30:00Z',
          status: 'pending'
        }
      ]
    },
    carePathway: {
      name: 'Adult Mental Health Assessment',
      stage: 'Initial Assessment',
      expectedDuration: 60,
      nextReviewDate: '2023-06-15T09:30:00Z'
    },
    teamId: 'TEAM-MH-001'
  }
];
