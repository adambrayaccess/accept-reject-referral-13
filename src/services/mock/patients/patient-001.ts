
import { Patient } from '@/types/patient';

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1980-05-15',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '42 Baker Street, London, NW1 6XE',
  phone: '07700 900123',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-15T09:30:00Z',
        news2: 1,
        temperature: 36.8,
        heartRate: 75,
        respiration: 16,
        oxygenSaturation: 98,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 80
      },
      {
        timestamp: '2023-06-14T14:15:00Z',
        news2: 0,
        temperature: 36.6,
        heartRate: 72,
        respiration: 14,
        oxygenSaturation: 99,
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 78
      },
      {
        timestamp: '2023-06-13T11:20:00Z',
        news2: 2,
        temperature: 37.0,
        heartRate: 82,
        respiration: 18,
        oxygenSaturation: 97,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-12T16:45:00Z',
        news2: 1,
        temperature: 36.9,
        heartRate: 78,
        respiration: 15,
        oxygenSaturation: 98,
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 82
      }
    ],
    testResults: [
      {
        id: 'TEST001',
        testName: 'Full Blood Count',
        testType: 'blood',
        requestedDate: '2023-06-10T00:00:00Z',
        sampleDate: '2023-06-10T08:30:00Z',
        reportDate: '2023-06-10T14:00:00Z',
        requestedBy: 'Dr. Sarah Wilson',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Haemoglobin',
            value: '14.2',
            unit: 'g/dL',
            referenceRange: '13.5-17.5',
            flag: 'normal'
          },
          {
            parameter: 'White Cell Count',
            value: '6.8',
            unit: '×10⁹/L',
            referenceRange: '4.0-11.0',
            flag: 'normal'
          },
          {
            parameter: 'Platelets',
            value: '285',
            unit: '×10⁹/L',
            referenceRange: '150-450',
            flag: 'normal'
          },
          {
            parameter: 'Haematocrit',
            value: '42.1',
            unit: '%',
            referenceRange: '40.0-50.0',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal full blood count parameters.',
        notes: 'Routine annual health check'
      },
      {
        id: 'TEST008',
        testName: 'HbA1c',
        testType: 'blood',
        requestedDate: '2023-06-05T00:00:00Z',
        sampleDate: '2023-06-05T09:15:00Z',
        reportDate: '2023-06-05T15:30:00Z',
        requestedBy: 'Dr. Sarah Wilson',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'HbA1c',
            value: '45',
            unit: 'mmol/mol',
            referenceRange: '<42',
            flag: 'high'
          }
        ],
        interpretation: 'Slightly elevated HbA1c indicating pre-diabetes range.',
        notes: 'Lifestyle modifications recommended'
      },
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
    medicationHistory: [
      {
        id: 'MED001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedDate: '2023-04-15T00:00:00Z',
        prescribedBy: 'Dr. Sarah Wilson',
        indication: 'Hypertension',
        status: 'active',
        notes: 'Monitor blood pressure monthly'
      },
      {
        id: 'MED016',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        prescribedDate: '2023-06-05T00:00:00Z',
        prescribedBy: 'Dr. Sarah Wilson',
        indication: 'High cholesterol',
        status: 'active',
        notes: 'Monitor liver function tests in 6 weeks'
      },
      {
        id: 'MED017',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        prescribedDate: '2023-06-10T00:00:00Z',
        prescribedBy: 'Dr. Sarah Wilson',
        indication: 'Pre-diabetes',
        status: 'active',
        notes: 'Start with once daily, increase to twice daily if tolerated'
      }
    ],
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
