
import { Patient } from '@/types/patient';
import { patient001 } from './patient-001';
import { patient002 } from './patient-002';
import { patient003 } from './patient-003';
import { patient004 } from './patient-004';
import { patient005 } from './patient-005';
import { patient006 } from './patient-006';
import { patient007 } from './patient-007';
import { patient008 } from './patient-008';
import { patient009 } from './patient-009';
import { patient010 } from './patient-010';
import { patient011 } from './patient-011';
import { patient012 } from './patient-012';
import { patient013 } from './patient-013';
import { patient014 } from './patient-014';
import { patient015 } from './patient-015';
import { patient016 } from './patient-016';
import { patient017 } from './patient-017';
import { patient018 } from './patient-018';
import { patient019 } from './patient-019';
import { patient020 } from './patient-020';

// Export all patients for use in referrals and other services
export const mockPatients: Patient[] = [
  patient001,  // P001 - John Smith
  patient002,  // P002 - Sarah Williams  
  patient003,  // P003 - Alice Johnson (with reasonable adjustments)
  patient004,  // P004 - Michael Brown
  patient005,  // P005 - David Wilson
  patient006,  // P006 - Generated patient (elderly male with complex conditions)
  patient007,  // P007 - Generated patient (elderly female with accessibility needs)
  patient008,  // P008 - Generated patient (middle-aged male with diabetes)
  patient009,  // P009 - Generated patient (middle-aged female with depression)
  patient010,  // P010 - Generated patient (young adult female)
  patient011,  // P011 - Generated patient (young adult male with access restrictions)
  patient012,  // P012 - Generated patient (adult female with high accessibility needs)
  patient013,  // P013 - Generated patient (adult male with complex conditions)
  patient014,  // P014 - Generated patient (young female with access restrictions)
  patient015,  // P015 - Generated patient (adult male with access restrictions)
  patient016,  // P016 - Generated patient (elderly female with comprehensive history)
  patient017,  // P017 - Generated patient (middle-aged male with complex conditions)
  patient018,  // P018 - Generated patient (young female with depression)
  patient019,  // P019 - Generated patient (young male with mental health needs)
  patient020   // P020 - Generated patient (young female student)
];

// Individual patient exports for direct use
export {
  patient001,
  patient002,
  patient003,
  patient004,
  patient005,
  patient006,
  patient007,
  patient008,
  patient009,
  patient010,
  patient011,
  patient012,
  patient013,
  patient014,
  patient015,
  patient016,
  patient017,
  patient018,
  patient019,
  patient020
};
