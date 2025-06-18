
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
      },
      {
        timestamp: '2023-06-10T09:15:00Z',
        news2: 3,
        temperature: 37.2,
        heartRate: 92,
        respiration: 19,
        oxygenSaturation: 95,
        bloodPressureSystolic: 165,
        bloodPressureDiastolic: 98
      },
      {
        timestamp: '2023-06-09T14:30:00Z',
        news2: 1,
        temperature: 36.8,
        heartRate: 85,
        respiration: 16,
        oxygenSaturation: 97,
        bloodPressureSystolic: 155,
        bloodPressureDiastolic: 92
      },
      {
        timestamp: '2023-06-08T11:45:00Z',
        news2: 2,
        temperature: 36.9,
        heartRate: 90,
        respiration: 18,
        oxygenSaturation: 96,
        bloodPressureSystolic: 158,
        bloodPressureDiastolic: 94
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
      },
      {
        id: 'TEST010',
        testName: 'ECG',
        testType: 'other',
        requestedDate: '2023-06-06T00:00:00Z',
        reportDate: '2023-06-06T10:30:00Z',
        requestedBy: 'Dr. Lisa Henderson',
        performedBy: 'Cardiology Department',
        status: 'completed',
        results: [
          {
            parameter: 'Rhythm',
            value: 'Sinus rhythm',
            flag: 'normal'
          },
          {
            parameter: 'Rate',
            value: '85 bpm',
            flag: 'normal'
          },
          {
            parameter: 'QRS Duration',
            value: '98 ms',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal ECG. Regular sinus rhythm with no acute changes.',
        notes: 'Pre-operative cardiac assessment'
      },
      {
        id: 'TEST011',
        testName: 'Renal Function Tests',
        testType: 'blood',
        requestedDate: '2023-06-04T00:00:00Z',
        sampleDate: '2023-06-04T08:20:00Z',
        reportDate: '2023-06-04T15:45:00Z',
        requestedBy: 'Dr. Lisa Henderson',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Creatinine',
            value: '95',
            unit: 'μmol/L',
            referenceRange: '60-120',
            flag: 'normal'
          },
          {
            parameter: 'eGFR',
            value: '78',
            unit: 'mL/min/1.73m²',
            referenceRange: '>60',
            flag: 'normal'
          },
          {
            parameter: 'Urea',
            value: '6.2',
            unit: 'mmol/L',
            referenceRange: '2.5-7.8',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal kidney function.',
        notes: 'Baseline assessment for hypertension management'
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
      },
      {
        id: 'MED018',
        name: 'Ramipril',
        dosage: '2.5mg',
        frequency: 'Once daily',
        prescribedDate: '2023-06-08T00:00:00Z',
        prescribedBy: 'Dr. Lisa Henderson',
        indication: 'Hypertension',
        status: 'active',
        notes: 'Added for better blood pressure control. Monitor kidney function.'
      },
      {
        id: 'MED019',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        prescribedDate: '2023-03-15T00:00:00Z',
        prescribedBy: 'Dr. Lisa Henderson',
        indication: 'Cardiovascular protection',
        status: 'active',
        notes: 'Take with food to reduce gastric irritation'
      }
    ]
  }
};
