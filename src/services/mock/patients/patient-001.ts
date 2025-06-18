
import { Patient } from '@/types/patient';
import { createVitalSignsSequence } from '../shared/vital-signs';
import { createCommonTestResults, createSpecializedTestResults } from '../shared/test-results';
import { createMedicationHistory } from '../shared/medications';

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1980-05-15',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '42 Baker Street, London, NW1 6XE',
  phone: '07700 900123',
  medicalHistory: {
    vitalSigns: createVitalSignsSequence('2023-06-12T00:00:00Z', 'stable'),
    testResults: [
      ...createCommonTestResults('001', 'Dr. Sarah Wilson', '2023-06-10T00:00:00Z'),
      ...createSpecializedTestResults('001', 'Dr. Sarah Wilson', 'diabetes', '2023-06-05T00:00:00Z'),
      {
        id: 'TEST009',
        testName: 'Lipid Profile',
        testType: 'blood',
        requestedDate: '2023-06-02T00:00:00Z',
        sampleDate: '2023-06-02T08:45:00Z',
        reportDate: '2023-06-02T16:20:00Z',
        requestedBy: 'Dr. Sarah Wilson',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Total Cholesterol',
            value: '5.2',
            unit: 'mmol/L',
            referenceRange: '<5.0',
            flag: 'high'
          },
          {
            parameter: 'HDL Cholesterol',
            value: '1.3',
            unit: 'mmol/L',
            referenceRange: '>1.0',
            flag: 'normal'
          },
          {
            parameter: 'LDL Cholesterol',
            value: '3.2',
            unit: 'mmol/L',
            referenceRange: '<3.0',
            flag: 'high'
          },
          {
            parameter: 'Triglycerides',
            value: '1.8',
            unit: 'mmol/L',
            referenceRange: '<2.3',
            flag: 'normal'
          }
        ],
        interpretation: 'Borderline dyslipidaemia. Consider statin therapy if other risk factors present.',
        notes: 'Dietary advice provided'
      }
    ],
    medicationHistory: createMedicationHistory('001', 'Dr. Sarah Wilson', ['hypertension', 'cholesterol', 'diabetes'], '2023-06-01T00:00:00Z'),
    mhaSections: [
      {
        id: 'MHA001',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2022-03-15T00:00:00Z',
        expiryDate: '2022-04-14T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Michael Thompson',
        hospital: 'Royal London Hospital',
        reason: 'Patient presenting with acute psychosis and risk to self and others. Unable to consent to voluntary admission.',
        reviewDate: '2022-03-22T00:00:00Z',
        notes: 'Patient responded well to treatment. Discharged to community mental health team follow-up.'
      }
    ]
  }
};
