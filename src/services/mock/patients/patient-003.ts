
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient003: Patient = {
  id: 'P003',
  name: 'Michael Brown',
  birthDate: '1965-12-08',
  gender: 'male',
  nhsNumber: '345 678 9012',
  address: '88 High Street, Birmingham, B1 1AA',
  phone: '07700 900789',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-08T00:00:00Z', 'hypertensive'),
    testResults: [
      ...createSpecializedTestResults('003', 'Dr. Lisa Henderson', 'cardiac', '2023-06-05T00:00:00Z'),
      ...createSpecializedTestResults('003', 'Dr. Lisa Henderson', 'renal', '2023-06-04T00:00:00Z'),
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
    medicationHistory: createMedicationHistory('003', 'Dr. Lisa Henderson', ['hypertension'], '2023-06-01T00:00:00Z')
  }
};
