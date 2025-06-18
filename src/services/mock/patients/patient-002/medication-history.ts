
import { MedicationPrescription } from '@/types/medical';

export const patient002MedicationHistory: MedicationPrescription[] = [
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
];
