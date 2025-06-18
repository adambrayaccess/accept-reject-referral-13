
import { Patient } from '@/types/patient';

export const patient002: Patient = {
  id: 'P002',
  name: 'Sarah Johnson',
  birthDate: '1975-09-22',
  gender: 'female',
  nhsNumber: '234 567 8901',
  address: '15 Oak Avenue, Manchester, M1 2AB',
  phone: '07700 900456',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-12T11:45:00Z',
        news2: 3,
        temperature: 37.2,
        heartRate: 95,
        respiration: 18,
        oxygenSaturation: 97,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 90
      }
    ],
    testResults: [
      {
        id: 'TEST002',
        testName: 'Liver Function Tests',
        testType: 'blood',
        requestedDate: '2023-06-08T00:00:00Z',
        sampleDate: '2023-06-08T09:15:00Z',
        reportDate: '2023-06-08T16:30:00Z',
        requestedBy: 'Dr. James Mitchell',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'ALT',
            value: '42',
            unit: 'U/L',
            referenceRange: '7-40',
            flag: 'high'
          },
          {
            parameter: 'AST',
            value: '38',
            unit: 'U/L',
            referenceRange: '10-40',
            flag: 'normal'
          },
          {
            parameter: 'Bilirubin',
            value: '18',
            unit: 'μmol/L',
            referenceRange: '3-20',
            flag: 'normal'
          }
        ],
        interpretation: 'Slightly elevated ALT, possibly related to recent medication changes.',
        notes: 'Recommend repeat in 4 weeks'
      }
    ],
    medicationHistory: [
      {
        id: 'MED002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        prescribedDate: '2023-01-10T00:00:00Z',
        prescribedBy: 'Dr. James Mitchell',
        indication: 'Type 2 Diabetes',
        status: 'active',
        notes: 'Take with meals to reduce GI side effects'
      }
    ],
    mhaSections: [
      {
        id: 'MHA002',
        sectionNumber: '3',
        sectionTitle: 'Admission for Treatment',
        appliedDate: '2023-01-20T00:00:00Z',
        expiryDate: '2023-07-20T00:00:00Z',
        status: 'active',
        consultantResponsible: 'Dr. Emma Clarke',
        hospital: 'Manchester Mental Health Trust',
        reason: 'Severe depression with psychotic features. Patient lacks capacity to consent to treatment and poses significant risk of self-harm.',
        reviewDate: '2023-04-20T00:00:00Z',
        notes: 'Patient showing gradual improvement with antipsychotic medication. Regular review meetings with family.'
      }
    ]
  }
};
