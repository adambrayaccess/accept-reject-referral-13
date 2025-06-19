
import { TestResult } from '@/types/medical';

export const patient001TestResults: TestResult[] = [
  {
    id: 'TR001001',
    testName: 'Full Blood Count',
    testType: 'blood',
    requestedDate: '2023-11-20T00:00:00Z',
    reportDate: '2023-11-20T00:00:00Z',
    requestedBy: 'Dr. James Wilson',
    performedBy: 'NHS Laboratory Services',
    status: 'completed',
    results: [
      { parameter: 'Haemoglobin', value: '12.5', unit: 'g/dL', referenceRange: '12.0-15.5', flag: 'normal' },
      { parameter: 'White Cell Count', value: '7.2', unit: '10^9/L', referenceRange: '4.0-11.0', flag: 'normal' },
      { parameter: 'Platelets', value: '280', unit: '10^9/L', referenceRange: '150-400', flag: 'normal' }
    ],
    interpretation: 'All parameters within normal limits',
    notes: 'All parameters within normal limits'
  }
];
