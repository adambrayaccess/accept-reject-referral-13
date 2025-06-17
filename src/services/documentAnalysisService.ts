
export interface DocumentAnalysisResult {
  patientInfo: {
    name?: string;
    birthDate?: string;
    gender?: string;
    nhsNumber?: string;
    address?: string;
    phone?: string;
  };
  clinicalInfo: {
    reason?: string;
    history?: string;
    diagnosis?: string;
    medications?: string[];
    allergies?: string[];
    notes?: string;
  };
  referralInfo: {
    specialty?: string;
    priority?: 'routine' | 'urgent';
    urgency?: string;
  };
  confidence: number;
  extractedText: string;
  processingTime: number;
}

const MOCK_DELAY = 2000; // Simulate AI processing time

// Simulate AI document analysis
export const analyzeDocument = async (file: File): Promise<DocumentAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startTime = Date.now();
      
      // Mock extraction based on file type and name
      const fileName = file.name.toLowerCase();
      const mockResult = generateMockAnalysisResult(fileName);
      
      const processingTime = Date.now() - startTime;
      
      resolve({
        ...mockResult,
        processingTime
      });
    }, MOCK_DELAY);
  });
};

const generateMockAnalysisResult = (fileName: string): Omit<DocumentAnalysisResult, 'processingTime'> => {
  // Mock different analysis results based on file characteristics
  let mockData: Partial<DocumentAnalysisResult> = {
    confidence: 0.85,
    extractedText: 'Mock extracted text from document analysis...'
  };

  // Simulate different document types
  if (fileName.includes('referral') || fileName.includes('letter')) {
    mockData = {
      patientInfo: {
        name: 'John Smith',
        birthDate: '1975-06-15',
        gender: 'male',
        nhsNumber: '123 456 7890',
        address: '123 Main Street, London, SW1A 1AA',
        phone: '020 7946 0958'
      },
      clinicalInfo: {
        reason: 'Chest pain and shortness of breath on exertion',
        history: 'Patient reports 3-month history of chest discomfort, particularly on climbing stairs. No previous cardiac history.',
        diagnosis: 'Suspected angina pectoris',
        medications: ['Aspirin 75mg daily', 'Atorvastatin 20mg daily'],
        allergies: ['Penicillin'],
        notes: 'Requires urgent cardiology assessment'
      },
      referralInfo: {
        specialty: 'Cardiology',
        priority: 'urgent',
        urgency: 'Symptoms suggestive of cardiac etiology'
      },
      confidence: 0.92,
      extractedText: 'Dear Colleague,\n\nI am writing to refer Mr John Smith, DOB 15/06/1975, NHS Number 123 456 7890, who presents with a 3-month history of chest pain and shortness of breath...'
    };
  } else if (fileName.includes('blood') || fileName.includes('lab')) {
    mockData = {
      patientInfo: {
        name: 'Sarah Johnson',
        birthDate: '1982-03-22',
        nhsNumber: '987 654 3210'
      },
      clinicalInfo: {
        reason: 'Abnormal blood results requiring specialist review',
        history: 'Recent blood tests show elevated inflammatory markers',
        notes: 'ESR 85, CRP 45, requires rheumatology assessment'
      },
      referralInfo: {
        specialty: 'Rheumatology',
        priority: 'routine'
      },
      confidence: 0.78,
      extractedText: 'Blood Test Results:\nESR: 85 mm/hr (elevated)\nCRP: 45 mg/L (elevated)\nRheumatoid Factor: Positive...'
    };
  } else if (fileName.includes('discharge') || fileName.includes('summary')) {
    mockData = {
      patientInfo: {
        name: 'Michael Brown',
        birthDate: '1965-11-08',
        nhsNumber: '456 789 0123'
      },
      clinicalInfo: {
        reason: 'Post-discharge follow-up required',
        history: 'Recent hospital admission for pneumonia, now requires outpatient follow-up',
        medications: ['Amoxicillin 500mg TDS', 'Prednisolone 5mg daily'],
        notes: 'Discharged yesterday, needs chest clinic review in 4 weeks'
      },
      referralInfo: {
        specialty: 'Respiratory Medicine',
        priority: 'routine'
      },
      confidence: 0.88,
      extractedText: 'Discharge Summary:\nAdmission Date: 10/01/2024\nDischarge Date: 15/01/2024\nDiagnosis: Community Acquired Pneumonia...'
    };
  } else {
    // Generic document
    mockData = {
      patientInfo: {
        name: 'Patient Name',
        birthDate: '1980-01-01'
      },
      clinicalInfo: {
        reason: 'Medical assessment required',
        history: 'Clinical history extracted from document',
        notes: 'Additional clinical information from uploaded document'
      },
      referralInfo: {
        specialty: 'General Medicine',
        priority: 'routine'
      },
      confidence: 0.65,
      extractedText: 'Document text extracted for analysis...'
    };
  }

  return mockData as Omit<DocumentAnalysisResult, 'processingTime'>;
};

// Merge multiple document analysis results
export const mergeAnalysisResults = (results: DocumentAnalysisResult[]): DocumentAnalysisResult => {
  if (results.length === 0) {
    throw new Error('No analysis results to merge');
  }

  if (results.length === 1) {
    return results[0];
  }

  // Merge logic: take the most confident result for each field
  const merged: DocumentAnalysisResult = {
    patientInfo: {},
    clinicalInfo: {},
    referralInfo: {},
    confidence: 0,
    extractedText: '',
    processingTime: 0
  };

  // Calculate average confidence
  merged.confidence = results.reduce((sum, result) => sum + result.confidence, 0) / results.length;

  // Sum processing times
  merged.processingTime = results.reduce((sum, result) => sum + result.processingTime, 0);

  // Merge extracted text
  merged.extractedText = results.map(r => r.extractedText).join('\n\n---\n\n');

  // Merge patient info (take most confident non-empty values)
  const patientFields: (keyof DocumentAnalysisResult['patientInfo'])[] = ['name', 'birthDate', 'gender', 'nhsNumber', 'address', 'phone'];
  patientFields.forEach(field => {
    const bestResult = results
      .filter(r => r.patientInfo[field])
      .sort((a, b) => b.confidence - a.confidence)[0];
    if (bestResult?.patientInfo[field]) {
      merged.patientInfo[field] = bestResult.patientInfo[field];
    }
  });

  // Merge clinical info
  const clinicalFields: (keyof DocumentAnalysisResult['clinicalInfo'])[] = ['reason', 'history', 'diagnosis', 'notes'];
  clinicalFields.forEach(field => {
    const values = results
      .map(r => r.clinicalInfo[field])
      .filter(Boolean);
    if (values.length > 0) {
      merged.clinicalInfo[field] = values.join('; ');
    }
  });

  // Merge medications and allergies (arrays)
  const allMedications = results.flatMap(r => r.clinicalInfo.medications || []);
  const allAllergies = results.flatMap(r => r.clinicalInfo.allergies || []);
  
  if (allMedications.length > 0) {
    merged.clinicalInfo.medications = [...new Set(allMedications)]; // Remove duplicates
  }
  if (allAllergies.length > 0) {
    merged.clinicalInfo.allergies = [...new Set(allAllergies)]; // Remove duplicates
  }

  // Merge referral info (take most confident values)
  const referralFields: (keyof DocumentAnalysisResult['referralInfo'])[] = ['specialty', 'priority', 'urgency'];
  referralFields.forEach(field => {
    const bestResult = results
      .filter(r => r.referralInfo[field])
      .sort((a, b) => b.confidence - a.confidence)[0];
    if (bestResult?.referralInfo[field]) {
      merged.referralInfo[field] = bestResult.referralInfo[field];
    }
  });

  return merged;
};
