
import { MHASection } from '@/types/medical';

export const patient002MHASections: MHASection[] = [
  {
    id: 'MHA002',
    sectionNumber: '3',
    sectionTitle: 'Admission for Treatment',
    appliedDate: '2023-01-20T00:00:00Z',
    expiryDate: '2023-07-20T00:00:00Z',
    status: 'active',
    consultantResponsible: 'Dr. Emma Clarke',
    hospital: 'Manchester Mental Health Trust',
    reason: 'Severe depression with psychotic features. Patient lacks capacity to consent to treatment and poses significant risk of self-harm.',
    reviewDate: '2023-04-20T00:00:00Z',
    notes: 'Patient showing gradual improvement with antipsychotic medication. Regular review meetings with family.'
  },
  {
    id: 'MHA008',
    sectionNumber: '2',
    sectionTitle: 'Admission for Assessment',
    appliedDate: '2022-11-15T00:00:00Z',
    expiryDate: '2022-12-13T00:00:00Z',
    status: 'expired',
    consultantResponsible: 'Dr. Michael Thompson',
    hospital: 'Manchester Mental Health Trust',
    reason: 'Initial presentation with acute psychotic symptoms and agitation. Assessment required to determine appropriate treatment pathway.',
    reviewDate: '2022-11-29T00:00:00Z',
    notes: 'Comprehensive assessment completed. Transferred to Section 3 for ongoing treatment.'
  },
  {
    id: 'MHA009',
    sectionNumber: '5(2)',
    sectionTitle: "Doctor's Holding Power",
    appliedDate: '2023-05-10T00:00:00Z',
    expiryDate: '2023-05-13T00:00:00Z',
    status: 'discharged',
    consultantResponsible: 'Dr. Emma Clarke',
    hospital: 'Manchester Mental Health Trust',
    reason: 'Patient attempted to leave ward during voluntary admission while experiencing acute psychotic episode.',
    notes: 'Used to prevent patient leaving until formal assessment could be arranged. Patient subsequently agreed to remain voluntarily.'
  }
];
