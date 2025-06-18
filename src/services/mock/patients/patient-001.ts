import { Patient } from '@/types/patient';

export const patient001: Patient = {
  id: 'P001',
  name: 'John Smith',
  birthDate: '1975-04-12',
  gender: 'male',
  nhsNumber: '123 456 7890',
  address: '15 London Road, Manchester, M1 4BT',
  phone: '07700 900123',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-01T09:30:00Z',
        news2: 1,
        temperature: 36.8,
        heartRate: 72,
        respiration: 14,
        oxygenSaturation: 97,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 80
      },
      {
        timestamp: '2023-06-05T14:15:00Z',
        news2: 3,
        temperature: 37.2,
        heartRate: 88,
        respiration: 18,
        oxygenSaturation: 95,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-10T11:45:00Z',
        news2: 5,
        temperature: 37.9,
        heartRate: 96,
        respiration: 22,
        oxygenSaturation: 94,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 90
      },
      {
        timestamp: '2023-06-12T08:30:00Z',
        news2: 4,
        temperature: 37.6,
        heartRate: 92,
        respiration: 20,
        oxygenSaturation: 95,
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-14T16:00:00Z',
        news2: 2,
        temperature: 37.1,
        heartRate: 80,
        respiration: 16,
        oxygenSaturation: 96,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 80
      }
    ],
    cardiograms: [
      {
        timestamp: '2023-06-10T12:30:00Z',
        data: [],
        interpretation: 'Sinus rhythm with occasional premature ventricular complexes. No ST segment changes.'
      },
      {
        timestamp: '2023-06-14T09:15:00Z',
        data: [],
        interpretation: 'Normal sinus rhythm. No significant changes from previous ECG.'
      }
    ],
    medicationHistory: [
      {
        id: 'MED001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedDate: '2023-05-15T00:00:00Z',
        prescribedBy: 'Dr. Sarah Wilson',
        indication: 'Hypertension',
        status: 'active',
        notes: 'Monitor blood pressure regularly'
      },
      {
        id: 'MED002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        prescribedDate: '2023-04-20T00:00:00Z',
        prescribedBy: 'Dr. James Brown',
        indication: 'Type 2 Diabetes',
        status: 'active',
        notes: 'Take with food to reduce gastric upset'
      },
      {
        id: 'MED003',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        prescribedDate: '2023-06-01T00:00:00Z',
        prescribedBy: 'Dr. Emily Davis',
        indication: 'Respiratory tract infection',
        status: 'completed',
        endDate: '2023-06-08T00:00:00Z',
        notes: 'Complete full course even if feeling better'
      }
    ],
    testResults: [
      {
        id: 'TEST001',
        testName: 'Full Blood Count',
        testType: 'blood',
        requestedDate: '2023-06-01T00:00:00Z',
        sampleDate: '2023-06-02T08:30:00Z',
        reportDate: '2023-06-02T16:45:00Z',
        requestedBy: 'Dr. Sarah Wilson',
        performedBy: 'NHS Laboratory Services',
        status: 'completed',
        results: [
          { parameter: 'Haemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5-17.5', flag: 'normal' },
          { parameter: 'White Blood Cells', value: '8.5', unit: '×10⁹/L', referenceRange: '4.0-11.0', flag: 'normal' },
          { parameter: 'Platelets', value: '250', unit: '×10⁹/L', referenceRange: '150-450', flag: 'normal' },
          { parameter: 'Haematocrit', value: '42.1', unit: '%', referenceRange: '40.0-50.0', flag: 'normal' }
        ],
        interpretation: 'Normal full blood count with no evidence of anaemia or infection.'
      },
      {
        id: 'TEST002',
        testName: 'HbA1c',
        testType: 'blood',
        requestedDate: '2023-06-01T00:00:00Z',
        sampleDate: '2023-06-02T08:30:00Z',
        reportDate: '2023-06-02T16:45:00Z',
        requestedBy: 'Dr. James Brown',
        performedBy: 'NHS Laboratory Services',
        status: 'completed',
        results: [
          { parameter: 'HbA1c', value: '58', unit: 'mmol/mol', referenceRange: '<42', flag: 'high' }
        ],
        interpretation: 'Elevated HbA1c indicating suboptimal diabetes control. Consider medication adjustment.',
        notes: 'Patient advised on lifestyle modifications and medication compliance.'
      }
    ]
  }
};
