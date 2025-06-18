
import { TestResult } from '@/types/medical';

export const patient002TestResults: TestResult[] = [
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
];
