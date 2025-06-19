
import { MedicationPrescription } from '@/types/medical';

export const patient001MedicationHistory: MedicationPrescription[] = [
  {
    id: 'MH001001',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    prescribedDate: '2023-01-15T00:00:00Z',
    prescribedBy: 'Dr. James Wilson',
    indication: 'Hypertension',
    status: 'active',
    notes: 'Take in the morning with food'
  },
  {
    id: 'MH001002',
    name: 'Simvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedDate: '2023-02-01T00:00:00Z',
    endDate: '2023-11-01T00:00:00Z',
    prescribedBy: 'Dr. James Wilson',
    indication: 'High cholesterol',
    status: 'discontinued',
    notes: 'Discontinued due to muscle pain - switched to alternative'
  }
];
