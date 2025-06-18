import { Patient } from '@/types/patient';

export const patient003: Patient = {
  id: 'P003',
  name: 'Robert Taylor',
  birthDate: '1968-11-30',
  gender: 'male',
  nhsNumber: '345 678 9012',
  address: '8 Queen Street, Liverpool, L1 1RH',
  phone: '07700 900789',
  medicalHistory: {
    vitalSigns: [
      {
        timestamp: '2023-06-12T08:00:00Z',
        news2: 7,
        temperature: 37.5,
        heartRate: 112,
        respiration: 24,
        oxygenSaturation: 92,
        bloodPressureSystolic: 155,
        bloodPressureDiastolic: 95
      },
      {
        timestamp: '2023-06-12T14:00:00Z',
        news2: 8,
        temperature: 37.8,
        heartRate: 118,
        respiration: 26,
        oxygenSaturation: 90,
        bloodPressureSystolic: 160,
        bloodPressureDiastolic: 100
      },
      {
        timestamp: '2023-06-12T20:00:00Z',
        news2: 6,
        temperature: 37.6,
        heartRate: 102,
        respiration: 22,
        oxygenSaturation: 93,
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 90
      },
      {
        timestamp: '2023-06-13T02:00:00Z',
        news2: 4,
        temperature: 37.2,
        heartRate: 92,
        respiration: 18,
        oxygenSaturation: 94,
        bloodPressureSystolic: 145,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-13T08:00:00Z',
        news2: 3,
        temperature: 37.0,
        heartRate: 88,
        respiration: 16,
        oxygenSaturation: 95,
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 80
      }
    ],
    cardiograms: [
      {
        timestamp: '2023-06-12T09:00:00Z',
        data: [],
        interpretation: 'Sinus tachycardia. ST segment depression in leads V4-V6, suggestive of myocardial ischemia.'
      },
      {
        timestamp: '2023-06-12T21:00:00Z',
        data: [],
        interpretation: 'Improved ST segments. Persisting sinus tachycardia.'
      },
      {
        timestamp: '2023-06-13T09:00:00Z',
        data: [],
        interpretation: 'Resolution of ST changes. Normal sinus rhythm.'
      }
    ],
    medicationHistory: [
      {
        id: 'MED006',
        name: 'Atorvastatin',
        dosage: '40mg',
        frequency: 'Once daily at bedtime',
        prescribedDate: '2023-01-15T00:00:00Z',
        prescribedBy: 'Dr. Rachel Green',
        indication: 'High cholesterol',
        status: 'active',
        notes: 'Monitor liver function tests'
      },
      {
        id: 'MED007',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        prescribedDate: '2023-02-01T00:00:00Z',
        prescribedBy: 'Dr. Rachel Green',
        indication: 'Cardiovascular protection',
        status: 'active',
        notes: 'Take with food'
      },
      {
        id: 'MED008',
        name: 'GTN Spray',
        dosage: '0.4mg',
        frequency: 'As needed for chest pain',
        prescribedDate: '2023-06-12T00:00:00Z',
        prescribedBy: 'Dr. David Martinez',
        indication: 'Angina',
        status: 'active',
        notes: 'Use under tongue when experiencing chest pain'
      }
    ],
    testResults: [
      {
        id: 'TEST003',
        testName: 'Troponin I',
        testType: 'blood',
        requestedDate: '2023-06-12T08:00:00Z',
        sampleDate: '2023-06-12T08:15:00Z',
        reportDate: '2023-06-12T10:30:00Z',
        requestedBy: 'Dr. David Martinez',
        performedBy: 'Emergency Laboratory',
        status: 'completed',
        results: [
          { parameter: 'Troponin I', value: '0.15', unit: 'ng/mL', referenceRange: '<0.04', flag: 'high' }
        ],
        interpretation: 'Elevated troponin consistent with myocardial injury. Requires cardiology review.',
        notes: 'Urgent cardiology consultation arranged.'
      },
      {
        id: 'TEST004',
        testName: 'Lipid Profile',
        testType: 'blood',
        requestedDate: '2023-06-10T00:00:00Z',
        sampleDate: '2023-06-11T08:00:00Z',
        reportDate: '2023-06-11T14:00:00Z',
        requestedBy: 'Dr. Rachel Green',
        performedBy: 'NHS Laboratory Services',
        status: 'completed',
        results: [
          { parameter: 'Total Cholesterol', value: '6.2', unit: 'mmol/L', referenceRange: '<5.0', flag: 'high' },
          { parameter: 'LDL Cholesterol', value: '4.1', unit: 'mmol/L', referenceRange: '<3.0', flag: 'high' },
          { parameter: 'HDL Cholesterol', value: '1.1', unit: 'mmol/L', referenceRange: '>1.0', flag: 'normal' },
          { parameter: 'Triglycerides', value: '2.8', unit: 'mmol/L', referenceRange: '<1.7', flag: 'high' }
        ],
        interpretation: 'Dyslipidaemia with elevated total cholesterol, LDL, and triglycerides. Statin therapy optimization required.'
      }
    ]
  }
};
