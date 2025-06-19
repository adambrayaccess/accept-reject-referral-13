
import { VitalSigns } from '@/types/medical';

export const patient001VitalSigns: VitalSigns[] = [
  {
    id: 'VS001001',
    bloodPressure: { systolic: 145, diastolic: 90 },
    heartRate: 78,
    temperature: 36.8,
    respirationRate: 16,
    oxygenSaturation: 98,
    dateRecorded: '2023-12-01T09:30:00Z',
    recordedBy: 'Dr. James Wilson',
    location: 'GP Surgery'
  },
  {
    id: 'VS001002',
    bloodPressure: { systolic: 150, diastolic: 95 },
    heartRate: 82,
    temperature: 37.1,
    respirationRate: 18,
    oxygenSaturation: 97,
    dateRecorded: '2023-11-15T14:20:00Z',
    recordedBy: 'Nurse Sarah Johnson',
    location: 'GP Surgery'
  }
];
