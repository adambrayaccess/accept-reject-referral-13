
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
      },
      {
        timestamp: '2023-06-11T09:30:00Z',
        news2: 4,
        temperature: 37.5,
        heartRate: 102,
        respiration: 20,
        oxygenSaturation: 96,
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 95
      },
      {
        timestamp: '2023-06-10T14:15:00Z',
        news2: 2,
        temperature: 36.9,
        heartRate: 88,
        respiration: 16,
        oxygenSaturation: 98,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 85
      },
      {
        timestamp: '2023-06-09T08:00:00Z',
        news2: 1,
        temperature: 36.7,
        heartRate: 78,
        respiration: 14,
        oxygenSaturation: 99,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 80
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
          },
          {
            parameter: 'Alkaline Phosphatase',
            value: '95',
            unit: 'U/L',
            referenceRange: '44-147',
            flag: 'normal'
          }
        ],
        interpretation: 'Slightly elevated ALT, possibly related to recent medication changes.',
        notes: 'Recommend repeat in 4 weeks'
      },
      {
        id: 'TEST006',
        testName: 'Full Blood Count',
        testType: 'blood',
        requestedDate: '2023-06-05T00:00:00Z',
        sampleDate: '2023-06-05T08:30:00Z',
        reportDate: '2023-06-05T14:20:00Z',
        requestedBy: 'Dr. James Mitchell',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'Haemoglobin',
            value: '13.8',
            unit: 'g/dL',
            referenceRange: '12.0-15.5',
            flag: 'normal'
          },
          {
            parameter: 'White Cell Count',
            value: '7.2',
            unit: '×10⁹/L',
            referenceRange: '4.0-11.0',
            flag: 'normal'
          },
          {
            parameter: 'Platelets',
            value: '320',
            unit: '×10⁹/L',
            referenceRange: '150-450',
            flag: 'normal'
          },
          {
            parameter: 'Haematocrit',
            value: '41.5',
            unit: '%',
            referenceRange: '36.0-46.0',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal full blood count parameters.',
        notes: 'Baseline assessment prior to starting new medication'
      },
      {
        id: 'TEST007',
        testName: 'Thyroid Function Tests',
        testType: 'blood',
        requestedDate: '2023-06-03T00:00:00Z',
        sampleDate: '2023-06-03T09:45:00Z',
        reportDate: '2023-06-03T17:10:00Z',
        requestedBy: 'Dr. Michael Thompson',
        performedBy: 'NHS Pathology Lab',
        status: 'completed',
        results: [
          {
            parameter: 'TSH',
            value: '3.2',
            unit: 'mU/L',
            referenceRange: '0.5-4.0',
            flag: 'normal'
          },
          {
            parameter: 'Free T4',
            value: '12.8',
            unit: 'pmol/L',
            referenceRange: '10-25',
            flag: 'normal'
          },
          {
            parameter: 'Free T3',
            value: '4.8',
            unit: 'pmol/L',
            referenceRange: '3.5-6.5',
            flag: 'normal'
          }
        ],
        interpretation: 'Normal thyroid function.',
        notes: 'Assessment for mood disorder workup'
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
      },
      {
        id: 'MED012',
        name: 'Sertraline',
        dosage: '100mg',
        frequency: 'Once daily in morning',
        prescribedDate: '2023-05-20T00:00:00Z',
        prescribedBy: 'Dr. Michael Thompson',
        indication: 'Depression and anxiety',
        status: 'active',
        notes: 'Increased from 50mg due to partial response. Monitor for side effects.'
      },
      {
        id: 'MED013',
        name: 'Lorazepam',
        dosage: '1mg',
        frequency: 'As needed, maximum twice daily',
        prescribedDate: '2023-06-01T00:00:00Z',
        prescribedBy: 'Dr. Michael Thompson',
        indication: 'Acute anxiety episodes',
        status: 'active',
        notes: 'Short-term use only. Review weekly to prevent dependence.'
      },
      {
        id: 'MED014',
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'Once daily before breakfast',
        prescribedDate: '2023-03-15T00:00:00Z',
        prescribedBy: 'Dr. James Mitchell',
        indication: 'GERD',
        status: 'active',
        notes: 'Take 30 minutes before first meal of the day'
      },
      {
        id: 'MED015',
        name: 'Diazepam',
        dosage: '5mg',
        frequency: 'Twice daily',
        prescribedDate: '2023-01-20T00:00:00Z',
        prescribedBy: 'Dr. Michael Thompson',
        indication: 'Anxiety disorder',
        status: 'discontinued',
        endDate: '2023-05-20T00:00:00Z',
        notes: 'Discontinued and replaced with sertraline for long-term management'
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
      },
      {
        id: 'MHA008',
        sectionNumber: '2',
        sectionTitle: 'Admission for Assessment',
        appliedDate: '2022-11-15T00:00:00Z',
        expiryDate: '2022-12-13T00:00:00Z',
        status: 'expired',
        consultantResponsible: 'Dr. Michael Thompson',
        hospital: 'Manchester Mental Health Trust',
        reason: 'Initial presentation with acute psychotic symptoms and agitation. Assessment required to determine appropriate treatment pathway.',
        reviewDate: '2022-11-29T00:00:00Z',
        notes: 'Comprehensive assessment completed. Transferred to Section 3 for ongoing treatment.'
      },
      {
        id: 'MHA009',
        sectionNumber: '5(2)',
        sectionTitle: "Doctor's Holding Power",
        appliedDate: '2023-05-10T00:00:00Z',
        expiryDate: '2023-05-13T00:00:00Z',
        status: 'discharged',
        consultantResponsible: 'Dr. Emma Clarke',
        hospital: 'Manchester Mental Health Trust',
        reason: 'Patient attempted to leave ward during voluntary admission while experiencing acute psychotic episode.',
        notes: 'Used to prevent patient leaving until formal assessment could be arranged. Patient subsequently agreed to remain voluntarily.'
      }
    ]
  }
};
