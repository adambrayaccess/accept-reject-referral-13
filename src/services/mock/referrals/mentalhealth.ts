
import { Referral } from '@/types/referral';

export const mentalHealthReferrals: Referral[] = [
  {
    "id": "REF-MH-001",
    "ubrn": "2023-MH-001-1234",
    "created": "2023-01-15T14:30:00Z",
    "status": "new",
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
      "clockStart": "2023-01-15T14:30:00Z",
      "targetDate": "2023-03-15T14:30:00Z",
      "status": "incomplete",
      "daysRemaining": 45,
      "breachRisk": "high"
    },
    "carePathway": {
      "type": "mental-health-pathway",
      "name": "Crisis Intervention",
      "priority": "urgent",
      "targetTimeframe": "7 days",
      "status": "active"
    },
    "teamId": "TEAM-MH-001"
  },
  {
    "id": "REF-MH-002",
    "ubrn": "2023-MH-002-5678",
    "created": "2023-02-20T10:00:00Z",
    "status": "accepted",
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
      "clockStart": "2023-02-20T10:00:00Z",
      "targetDate": "2023-04-20T10:00:00Z",
      "status": "incomplete",
      "daysRemaining": 60,
      "breachRisk": "medium"
    },
    "carePathway": {
      "type": "mental-health-pathway",
      "name": "Eating Disorder Program",
      "priority": "urgent",
      "targetTimeframe": "90 days",
      "status": "active"
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
      "clockStart": "2023-03-10T08:45:00Z",
      "targetDate": "2023-05-10T08:45:00Z",
      "status": "stopped",
      "daysRemaining": 50,
      "breachRisk": "medium"
    },
    "carePathway": {
      "type": "mental-health-pathway",
      "name": "Addiction Recovery Program",
      "priority": "routine",
      "targetTimeframe": "120 days",
      "status": "discontinued"
    },
    "teamId": "TEAM-AS-001"
  },
  {
    id: 'REF-MH-004',
    ubrn: '2024-MH-004-7892',
    created: '2023-05-15T09:30:00Z',
    status: 'new',
    priority: 'routine',
    patient: {
      id: 'P004',
      name: 'Emma Thompson',
      birthDate: '1990-03-15',
      gender: 'female',
      nhsNumber: '456 789 0123'
    },
    referrer: {
      id: 'PRAC-003',
      name: 'Dr. Helen Roberts',
      role: 'GP',
      organization: 'Leeds Primary Care'
    },
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
      clockStart: '2023-05-15T09:30:00Z',
      targetDate: '2023-07-14T09:30:00Z',
      status: 'incomplete',
      daysRemaining: 25,
      breachRisk: 'low'
    },
    carePathway: {
      type: 'mental-health-pathway',
      name: 'Adult Mental Health Assessment',
      priority: 'routine',
      targetTimeframe: '60 days',
      status: 'active'
    },
    teamId: 'TEAM-MH-001'
  }
];
