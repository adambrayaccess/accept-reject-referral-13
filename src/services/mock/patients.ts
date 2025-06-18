import { Patient } from '@/types/referral';

export const mockPatients: Patient[] = [
  {
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
  },
  {
    id: 'P002',
    name: 'Sarah Williams',
    birthDate: '1982-09-23',
    gender: 'female',
    nhsNumber: '234 567 8901',
    address: '42 Park Avenue, Birmingham, B15 2TT',
    phone: '07700 900456',
    medicalHistory: {
      vitalSigns: [
        {
          timestamp: '2023-05-20T10:00:00Z',
          news2: 0,
          temperature: 36.6,
          heartRate: 68,
          respiration: 12,
          oxygenSaturation: 98,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 75
        },
        {
          timestamp: '2023-06-05T11:30:00Z',
          news2: 1,
          temperature: 36.9,
          heartRate: 72,
          respiration: 14,
          oxygenSaturation: 97,
          bloodPressureSystolic: 125,
          bloodPressureDiastolic: 78
        },
        {
          timestamp: '2023-06-12T15:45:00Z',
          news2: 1,
          temperature: 36.8,
          heartRate: 70,
          respiration: 14,
          oxygenSaturation: 98,
          bloodPressureSystolic: 122,
          bloodPressureDiastolic: 76
        }
      ],
      medicationHistory: [
        {
          id: 'MED004',
          name: 'Sertraline',
          dosage: '50mg',
          frequency: 'Once daily',
          prescribedDate: '2023-03-10T00:00:00Z',
          prescribedBy: 'Dr. Michael Thompson',
          indication: 'Depression',
          status: 'active',
          notes: 'Monitor mood and side effects closely'
        },
        {
          id: 'MED005',
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'As needed, maximum 3 times daily',
          prescribedDate: '2023-06-01T00:00:00Z',
          prescribedBy: 'Dr. Lisa Garcia',
          indication: 'Pain relief',
          status: 'active',
          notes: 'Take with food to avoid stomach irritation'
        }
      ],
      mhaSections: [
        {
          id: 'MHA001',
          sectionNumber: '2',
          sectionTitle: 'Admission for Assessment',
          appliedDate: '2023-05-15T00:00:00Z',
          expiryDate: '2023-06-12T00:00:00Z',
          status: 'expired',
          consultantResponsible: 'Dr. Michael Thompson',
          hospital: 'Birmingham Mental Health Trust',
          reason: 'Patient presenting with acute psychotic symptoms and risk to self. Admission required for comprehensive psychiatric assessment and medication review.',
          reviewDate: '2023-05-29T00:00:00Z',
          notes: 'Patient cooperative with assessment. Family involved in care planning.'
        },
        {
          id: 'MHA002',
          sectionNumber: '3',
          sectionTitle: 'Admission for Treatment',
          appliedDate: '2023-06-12T00:00:00Z',
          expiryDate: '2023-12-12T00:00:00Z',
          status: 'active',
          consultantResponsible: 'Dr. Michael Thompson',
          hospital: 'Birmingham Mental Health Trust',
          reason: 'Continuation of treatment following Section 2. Patient requires ongoing antipsychotic medication and therapeutic intervention.',
          reviewDate: '2023-07-12T00:00:00Z',
          notes: 'Treatment plan includes medication optimization and psychological therapies.'
        }
      ]
    }
  },
  {
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
  },
  {
    id: 'P004',
    name: 'Emma Thompson',
    birthDate: '1990-03-15',
    gender: 'female',
    nhsNumber: '456 789 0123',
    address: '25 High Street, Leeds, LS1 4HG',
    phone: '07700 900234',
    medicalHistory: {
      vitalSigns: [
        {
          timestamp: '2023-06-10T10:30:00Z',
          news2: 0,
          temperature: 36.7,
          heartRate: 70,
          respiration: 14,
          oxygenSaturation: 98,
          bloodPressureSystolic: 125,
          bloodPressureDiastolic: 75
        }
      ],
      medicationHistory: [
        {
          id: 'MED009',
          name: 'Microgynon 30',
          dosage: '1 tablet',
          frequency: 'Once daily',
          prescribedDate: '2023-01-05T00:00:00Z',
          prescribedBy: 'Dr. Helen Roberts',
          indication: 'Contraception',
          status: 'active',
          notes: 'Take at the same time each day'
        }
      ]
    }
  },
  {
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
        }
      ]
    }
  }
];
