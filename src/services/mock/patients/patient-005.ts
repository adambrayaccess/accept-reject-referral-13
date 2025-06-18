
import { Patient } from '@/types/patient';

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
      },
      {
        timestamp: '2023-06-08T14:30:00Z',
        news2: 3,
        temperature: 37.3,
        heartRate: 88,
        respiration: 18,
        oxygenSaturation: 95,
        bloodPressureSystolic: 148,
        bloodPressureDiastolic: 92
      },
      {
        timestamp: '2023-06-07T09:45:00Z',
        news2: 1,
        temperature: 36.9,
        heartRate: 78,
        respiration: 15,
        oxygenSaturation: 97,
        bloodPressureSystolic: 138,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-06T16:15:00Z',
        news2: 2,
        temperature: 37.0,
        heartRate: 85,
        respiration: 17,
        oxygenSaturation: 96,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 90
      }
    ],
    testResults: [
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
      },
      {
        id: 'TEST014',
        testName: 'HbA1c',
        testType: 'blood',
        requestedDate: '2023-05-30T00:00:00Z',
        sampleDate: '2023-05-30T08:45:00Z',
        reportDate: '2023-05-30T16:20:00Z',
        requestedBy: 'Dr. Andrew Clark',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'HbA1c',
            value: '52',
            unit: 'mmol/mol',
            referenceRange: '<42',
            flag: 'high'
          }
        ],
        interpretation: 'Diabetes range. Requires medication and lifestyle interventions.',
        notes: 'Newly diagnosed Type 2 diabetes'
      },
      {
        id: 'TEST015',
        testName: 'Renal Function Tests',
        testType: 'blood',
        requestedDate: '2023-05-28T00:00:00Z',
        sampleDate: '2023-05-28T09:15:00Z',
        reportDate: '2023-05-28T15:40:00Z',
        requestedBy: 'Dr. Andrew Clark',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Creatinine',
            value: '105',
            unit: 'μmol/L',
            referenceRange: '60-120',
            flag: 'normal'
          },
          {
            parameter: 'eGFR',
            value: '68',
            unit: 'mL/min/1.73m²',
            referenceRange: '>60',
            flag: 'normal'
          },
          {
            parameter: 'Urea',
            value: '7.2',
            unit: 'mmol/L',
            referenceRange: '2.5-7.8',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal kidney function. Safe to start ACE inhibitor.',
        notes: 'Baseline before starting diabetes medications'
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
      },
      {
        id: 'MED021',
        name: 'Atorvastatin',
        dosage: '40mg',
        frequency: 'Once daily at bedtime',
        prescribedDate: '2023-05-15T00:00:00Z',
        prescribedBy: 'Dr. Andrew Clark',
        indication: 'High cholesterol',
        status: 'active',
        notes: 'Switched from simvastatin due to muscle pain. Monitor liver function.'
      },
      {
        id: 'MED022',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        prescribedDate: '2023-06-02T00:00:00Z',
        prescribedBy: 'Dr. Andrew Clark',
        indication: 'Type 2 Diabetes',
        status: 'active',
        notes: 'Start with once daily, increase gradually. Take with food to reduce GI side effects.'
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
