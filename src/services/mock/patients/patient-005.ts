
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient005: Patient = {
  id: 'P005',
  name: 'David Roberts',
  birthDate: '1955-08-22',
  gender: 'male',
  nhsNumber: '567 890 1234',
  address: '7 Church Lane, Bristol, BS1 5TR',
  phone: '07700 900567',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-06T00:00:00Z', 'monitoring'),
    testResults: [
      ...createSpecializedTestResults('005', 'Dr. Andrew Clark', 'diabetes', '2023-05-30T00:00:00Z'),
      ...createSpecializedTestResults('005', 'Dr. Andrew Clark', 'renal', '2023-05-28T00:00:00Z'),
      {
        id: 'TEST005',
        testName: 'Lipid Profile',
        testType: 'blood',
        requestedDate: '2023-06-02T00:00:00Z',
        sampleDate: '2023-06-02T09:30:00Z',
        reportDate: '2023-06-02T17:15:00Z',
        requestedBy: 'Dr. Andrew Clark',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Total Cholesterol',
            value: '6.2',
            unit: 'mmol/L',
            referenceRange: '<5.0',
            flag: 'high'
          },
          {
            parameter: 'HDL Cholesterol',
            value: '1.1',
            unit: 'mmol/L',
            referenceRange: '>1.0',
            flag: 'normal'
          },
          {
            parameter: 'LDL Cholesterol',
            value: '4.1',
            unit: 'mmol/L',
            referenceRange: '<3.0',
            flag: 'high'
          },
          {
            parameter: 'Triglycerides',
            value: '2.8',
            unit: 'mmol/L',
            referenceRange: '<2.3',
            flag: 'high'
          }
        ],
        interpretation: 'Elevated cholesterol and triglycerides. Recommend statin therapy and lifestyle modifications.',
        notes: 'Patient advised on diet and exercise'
      }
    ],
    medicationHistory: [
      ...createMedicationHistory('005', 'Dr. Andrew Clark', ['hypertension', 'cholesterol', 'diabetes'], '2023-04-01T00:00:00Z'),
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
      },
      {
        id: 'MED023',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        prescribedDate: '2023-06-05T00:00:00Z',
        prescribedBy: 'Dr. Andrew Clark',
        indication: 'Cardiovascular protection',
        status: 'active',
        notes: 'Take with food. Monitor for GI bleeding.'
      }
    ]
  }
};
