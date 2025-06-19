
import { Patient } from '@/types/patient';
import { patient001 } from './patient-001';
import { patient002 } from './patient-002';
import { patient003 } from './patient-003';
import { patient004 } from './patient-004';
import { patient005 } from './patient-005';

// Export all patients for use in referrals and other services
export const mockPatients: Patient[] = [
  patient001,  // P001 - John Smith
  patient002,  // P002 - Sarah Williams  
  patient003,  // P003 - Alice Johnson (with reasonable adjustments)
  patient004,  // P004 - Michael Brown
  patient005   // P005 - David Wilson
];

// Individual patient exports for direct use
export {
  patient001,
  patient002,
  patient003,
  patient004,
  patient005
};
