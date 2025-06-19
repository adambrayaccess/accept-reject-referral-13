
import { Referral } from '@/types/referral';
import { mockPractitioners } from '../practitioners';
import { updateUbrnIfSelected } from '../utils/ubrn-randomizer';
import { patient003 } from '../patients/patient-003'; // Import the patient with adjustments directly

// Create a specific test referral with Patient 003 (Alice Johnson) who has reasonable adjustments
export const testReferralWithAdjustments: Referral = updateUbrnIfSelected({
  id: 'NEUR-2024-003',
  ubrn: 'N45678901234',
  created: '2023-06-13T11:05:00Z',
  status: 'accepted',
  priority: 'urgent',
  patient: patient003, // Use the specific patient003 with reasonable adjustments
  referrer: mockPractitioners[2],
  specialty: 'Neurology',
  service: 'Stroke Clinic',
  triageStatus: 'pre-admission-assessment',
  tags: ['tia', 'stroke-risk', 'urgent-imaging'],
  clinicalInfo: {
    reason: 'Transient loss of speech and right-sided weakness',
    history: 'Patient experienced sudden onset speech difficulty and weakness in right arm lasting approximately 30 minutes yesterday evening.',
    diagnosis: 'Suspected TIA',
    medications: ['Amlodipine 5mg OD', 'Ramipril 5mg OD'],
    allergies: ['Latex'],
    notes: 'Patient has history of hypertension and type 2 diabetes. CT head performed in ED - no acute changes. Patient requires large print materials due to visual impairment.'
  },
  attachments: [
    {
      id: 'ATT-TEST-004',
      title: 'CT Head Report',
      contentType: 'application/pdf',
      url: '/mock-data/ct-report.pdf',
      date: '2023-06-12T22:30:00Z',
      size: 5678000
    },
    {
      id: 'ATT-TEST-005',
      title: 'Carotid Doppler Results',
      contentType: 'application/pdf',
      url: '/mock-data/doppler-results.pdf',
      date: '2023-06-13T09:15:00Z',
      size: 2345000
    }
  ]
});
