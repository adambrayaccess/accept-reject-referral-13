
import { Patient } from '@/types/referral';

export const patient005: Patient = {
  id: 'P005',
  name: 'David Roberts',
  birthDate: '1955-08-22',
  gender: 'male',
  nhsNumber: '567 890 1234',
  address: '7 Church Lane, Bristol, BS1 5TR',
  phone: '07700 900567',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-09T11:00:00Z',
        news2: 2,
        temperature: 37.1,
        heartRate: 82,
        respiration: 16,
        oxygenSaturation: 96,
        bloodPressureSystolic: 142,
        bloodPressureDiastolic: 88
      }
    ],
    medicationHistory: [
      {
        id: 'MED010',
        name: 'Ramipril',
        dosage: '5mg',
        frequency: 'Once daily',
        prescribedDate: '2023-04-10T00:00:00Z',
        prescribedBy: 'Dr. Andrew Clark',
        indication: 'Hypertension',
        status: 'active',
        notes: 'Monitor blood pressure and kidney function'
      },
      {
        id: 'MED011',
        name: 'Simvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        prescribedDate: '2023-04-10T00:00:00Z',
        prescribedBy: 'Dr. Andrew Clark',
        indication: 'High cholesterol',
        status: 'discontinued',
        endDate: '2023-05-15T00:00:00Z',
        notes: 'Discontinued due to muscle pain, switched to atorvastatin'
      }
    ]
  }
};
