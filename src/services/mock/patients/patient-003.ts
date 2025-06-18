
import { Patient } from '@/types/patient';

export const patient003: Patient = {
  id: 'P003',
  name: 'Michael Brown',
  birthDate: '1965-12-08',
  gender: 'male',
  nhsNumber: '345 678 9012',
  address: '88 High Street, Birmingham, B1 1AA',
  phone: '07700 900789',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-11T16:20:00Z',
        news2: 2,
        temperature: 37.0,
        heartRate: 88,
        respiration: 17,
        oxygenSaturation: 96,
        bloodPressureSystolic: 160,
        bloodPressureDiastolic: 95
      }
    ],
    testResults: [
      {
        id: 'TEST003',
        testName: 'Chest X-Ray',
        testType: 'imaging',
        requestedDate: '2023-06-05T00:00:00Z',
        reportDate: '2023-06-05T14:45:00Z',
        requestedBy: 'Dr. Lisa Henderson',
        performedBy: 'NHS Radiology Department',
        status: 'completed',
        results: [
          {
            parameter: 'Lung Fields',
            value: 'Clear',
            flag: 'normal'
          },
          {
            parameter: 'Heart Size',
            value: 'Normal',
            flag: 'normal'
          },
          {
            parameter: 'Pleural Spaces',
            value: 'Clear',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal chest X-ray. No acute cardiopulmonary abnormalities.',
        notes: 'Routine pre-operative assessment'
      }
    ],
    medicationHistory: [
      {
        id: 'MED003',
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        prescribedDate: '2023-02-20T00:00:00Z',
        prescribedBy: 'Dr. Lisa Henderson',
        indication: 'Hypertension',
        status: 'active',
        notes: 'Monitor for ankle swelling'
      }
    ]
  }
};
