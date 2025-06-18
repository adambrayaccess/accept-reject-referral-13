
import { Patient } from '@/types/referral';

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Williams',
  birthDate: '1982-09-23',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '42 Park Avenue, Birmingham, B15 2TT',
  phone: '07700 900456',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-05-20T10:00:00Z',
        news2: 0,
        temperature: 36.6,
        heartRate: 68,
        respiration: 12,
        oxygenSaturation: 98,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 75
      },
      {
        timestamp: '2023-06-05T11:30:00Z',
        news2: 1,
        temperature: 36.9,
        heartRate: 72,
        respiration: 14,
        oxygenSaturation: 97,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 78
      },
      {
        timestamp: '2023-06-12T15:45:00Z',
        news2: 1,
        temperature: 36.8,
        heartRate: 70,
        respiration: 14,
        oxygenSaturation: 98,
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 76
      }
    ],
    medicationHistory: [
      {
        id: 'MED004',
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily',
        prescribedDate: '2023-03-10T00:00:00Z',
        prescribedBy: 'Dr. Michael Thompson',
        indication: 'Depression',
        status: 'active',
        notes: 'Monitor mood and side effects closely'
      },
      {
        id: 'MED005',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed, maximum 3 times daily',
        prescribedDate: '2023-06-01T00:00:00Z',
        prescribedBy: 'Dr. Lisa Garcia',
        indication: 'Pain relief',
        status: 'active',
        notes: 'Take with food to avoid stomach irritation'
      }
    ],
    mhaSections: [
      {
        id: 'MHA001',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2023-05-15T00:00:00Z',
        expiryDate: '2023-06-12T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Michael Thompson',
        hospital: 'Birmingham Mental Health Trust',
        reason: 'Patient presenting with acute psychotic symptoms and risk to self. Admission required for comprehensive psychiatric assessment and medication review.',
        reviewDate: '2023-05-29T00:00:00Z',
        notes: 'Patient cooperative with assessment. Family involved in care planning.'
      },
      {
        id: 'MHA002',
        sectionNumber: '3',
        sectionTitle: 'Admission for Treatment',
        appliedDate: '2023-06-12T00:00:00Z',
        expiryDate: '2023-12-12T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. Michael Thompson',
        hospital: 'Birmingham Mental Health Trust',
        reason: 'Continuation of treatment following Section 2. Patient requires ongoing antipsychotic medication and therapeutic intervention.',
        reviewDate: '2023-07-12T00:00:00Z',
        notes: 'Treatment plan includes medication optimization and psychological therapies.'
      }
    ]
  }
};
