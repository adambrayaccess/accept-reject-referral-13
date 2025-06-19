
import { Patient } from '@/types/patient';
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';
import { createPatientAllergies } from '../shared/allergies';
import { MedicalHistory } from '@/types/medical';

const patient003ReasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'standard',
  adjustments: [
    {
      id: 'RA003001',
      category: 'sensory',
      description: 'Large print materials required',
      specificNeeds: 'Patient has visual impairment and requires all written materials in large print (minimum 16pt font).',
      implementationNotes: 'Prepare appointment letters and information sheets in large print format. Ensure good lighting in consultation room.',
      dateRecorded: '2023-03-10T00:00:00Z',
      recordedBy: 'Dr. Michael Thompson',
      reviewDate: '2024-03-10T00:00:00Z',
      status: 'active'
    }
  ],
  lastUpdated: '2023-03-10T00:00:00Z',
  updatedBy: 'Dr. Michael Thompson'
};

const patient003MedicalHistory: MedicalHistory = {
  vitalSigns: [],
  allergies: createPatientAllergies('P003', 'Dr. Michael Thompson', '2023-03-10T00:00:00Z')
};

export const patient003: Patient = {
  id: 'P003',
  name: 'Alice Johnson',
  birthDate: '1978-11-30',
  gender: 'female',
  nhsNumber: '345 678 9012',
  address: '789 King Road, Birmingham, B1 2BB',
  phone: '07700 900456',
  reasonableAdjustments: patient003ReasonableAdjustments,
  medicalHistory: patient003MedicalHistory
};
