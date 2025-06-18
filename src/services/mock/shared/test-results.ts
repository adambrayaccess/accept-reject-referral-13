
import { TestResult } from '@/types/medical';

export const createCommonTestResults = (
  patientId: string,
  doctorName: string,
  baseDate: string
): TestResult[] => {
  const baseTimestamp = new Date(baseDate);
  
  return [
    {
      id: `TEST${patientId}01`,
      testName: 'Full Blood Count',
      testType: 'blood',
      requestedDate: new Date(baseTimestamp.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      sampleDate: new Date(baseTimestamp.getTime() - 5 * 24 * 60 * 60 * 1000 + 8.5 * 60 * 60 * 1000).toISOString(),
      reportDate: new Date(baseTimestamp.getTime() - 5 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
      requestedBy: doctorName,
      performedBy: 'NHS Pathology Lab',
      status: 'completed',
      results: [
        {
          parameter: 'Haemoglobin',
          value: (Math.random() * 3 + 12.5).toFixed(1),
          unit: 'g/dL',
          referenceRange: '12.0-17.5',
          flag: 'normal'
        },
        {
          parameter: 'White Cell Count',
          value: (Math.random() * 3 + 5.5).toFixed(1),
          unit: '×10⁹/L',
          referenceRange: '4.0-11.0',
          flag: 'normal'
        },
        {
          parameter: 'Platelets',
          value: Math.floor(Math.random() * 150 + 200).toString(),
          unit: '×10⁹/L',
          referenceRange: '150-450',
          flag: 'normal'
        }
      ],
      interpretation: 'Normal blood count parameters.',
      notes: 'Routine health assessment'
    }
  ];
};

export const createSpecializedTestResults = (
  patientId: string,
  doctorName: string,
  specialty: 'cardiac' | 'diabetes' | 'thyroid' | 'renal',
  baseDate: string
): TestResult[] => {
  const baseTimestamp = new Date(baseDate);
  const testId = `TEST${patientId}${Math.floor(Math.random() * 100)}`;
  
  const specialtyTests = {
    cardiac: {
      testName: 'ECG',
      testType: 'other' as const,
      results: [
        { parameter: 'Rhythm', value: 'Sinus rhythm', flag: 'normal' as const },
        { parameter: 'Rate', value: '85 bpm', flag: 'normal' as const },
        { parameter: 'QRS Duration', value: '98 ms', flag: 'normal' as const }
      ],
      interpretation: 'Normal ECG. Regular sinus rhythm with no acute changes.'
    },
    diabetes: {
      testName: 'HbA1c',
      testType: 'blood' as const,
      results: [
        { 
          parameter: 'HbA1c', 
          value: Math.floor(Math.random() * 20 + 40).toString(), 
          unit: 'mmol/mol', 
          referenceRange: '<42', 
          flag: Math.random() > 0.5 ? 'high' as const : 'normal' as const
        }
      ],
      interpretation: 'Diabetes monitoring test.'
    },
    thyroid: {
      testName: 'Thyroid Function Tests',
      testType: 'blood' as const,
      results: [
        { parameter: 'TSH', value: '2.1', unit: 'mU/L', referenceRange: '0.5-4.0', flag: 'normal' as const },
        { parameter: 'Free T4', value: '14.8', unit: 'pmol/L', referenceRange: '10-25', flag: 'normal' as const }
      ],
      interpretation: 'Normal thyroid function.'
    },
    renal: {
      testName: 'Renal Function Tests',
      testType: 'blood' as const,
      results: [
        { parameter: 'Creatinine', value: '95', unit: 'μmol/L', referenceRange: '60-120', flag: 'normal' as const },
        { parameter: 'eGFR', value: '78', unit: 'mL/min/1.73m²', referenceRange: '>60', flag: 'normal' as const }
      ],
      interpretation: 'Normal kidney function.'
    }
  };

  const test = specialtyTests[specialty];
  
  return [{
    id: testId,
    testName: test.testName,
    testType: test.testType,
    requestedDate: new Date(baseTimestamp.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sampleDate: test.testType === 'blood' ? new Date(baseTimestamp.getTime() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString() : undefined,
    reportDate: new Date(baseTimestamp.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: doctorName,
    performedBy: test.testType === 'blood' ? 'NHS Pathology Lab' : 'Cardiology Department',
    status: 'completed',
    results: test.results,
    interpretation: test.interpretation,
    notes: 'Specialist assessment'
  }];
};
