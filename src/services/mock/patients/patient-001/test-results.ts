
import { TestResult } from '@/types/medical';

export const patient001TestResults: TestResult[] = [
  {
    id: 'TR001001',
    testName: 'Full Blood Count',
    testDate: '2023-11-20T00:00:00Z',
    results: [
      { parameter: 'Haemoglobin', value: '12.5', unit: 'g/dL', referenceRange: '12.0-15.5', status: 'normal' },
      { parameter: 'White Cell Count', value: '7.2', unit: '10^9/L', referenceRange: '4.0-11.0', status: 'normal' },
      { parameter: 'Platelets', value: '280', unit: '10^9/L', referenceRange: '150-400', status: 'normal' }
    ],
    orderedBy: 'Dr. James Wilson',
    reportedBy: 'NHS Laboratory Services',
    status: 'completed',
    notes: 'All parameters within normal limits'
  }
];
