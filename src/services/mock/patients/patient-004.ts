
import { Patient } from '@/types/referral';

export const patient004: Patient = {
  id: 'P004',
  name: 'Emma Thompson',
  birthDate: '1990-03-15',
  gender: 'female',
  nhsNumber: '456 789 0123',
  address: '25 High Street, Leeds, LS1 4HG',
  phone: '07700 900234',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-10T10:30:00Z',
        news2: 0,
        temperature: 36.7,
        heartRate: 70,
        respiration: 14,
        oxygenSaturation: 98,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 75
      }
    ],
    medicationHistory: [
      {
        id: 'MED009',
        name: 'Microgynon 30',
        dosage: '1 tablet',
        frequency: 'Once daily',
        prescribedDate: '2023-01-05T00:00:00Z',
        prescribedBy: 'Dr. Helen Roberts',
        indication: 'Contraception',
        status: 'active',
        notes: 'Take at the same time each day'
      }
    ]
  }
};
