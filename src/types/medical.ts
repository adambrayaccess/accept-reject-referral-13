
export interface VitalSign {
  timestamp: string;
  news2: number;
  temperature: number;
  heartRate: number;
  respiration: number;
  oxygenSaturation: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
}

export interface CardiogramDataPoint {
  time: number;
  value: number;
}

export interface Cardiogram {
  timestamp: string;
  data: CardiogramDataPoint[];
  interpretation: string;
}

export interface MedicationPrescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribedBy: string;
  indication: string;
  status: 'active' | 'discontinued' | 'completed';
  notes?: string;
  endDate?: string;
}

export interface MHASection {
  id: string;
  sectionNumber: string;
  sectionTitle: string;
  appliedDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'discharged';
  consultantResponsible: string;
  hospital: string;
  reason: string;
  reviewDate?: string;
  notes?: string;
}

export interface TestResult {
  id: string;
  testName: string;
  testType: 'blood' | 'urine' | 'imaging' | 'biopsy' | 'other';
  requestedDate: string;
  sampleDate?: string;
  reportDate: string;
  requestedBy: string;
  performedBy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  results: {
    parameter: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    flag?: 'normal' | 'high' | 'low' | 'critical';
  }[];
  interpretation?: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  recordedDate: string;
  recordedBy: string;
  status: 'active' | 'resolved' | 'unverified';
  notes?: string;
}

export interface MedicalHistory {
  vitalSigns: VitalSign[];
  cardiograms?: Cardiogram[];
  medicationHistory?: MedicationPrescription[];
  mhaSections?: MHASection[];
  testResults?: TestResult[];
  allergies?: Allergy[];
}
