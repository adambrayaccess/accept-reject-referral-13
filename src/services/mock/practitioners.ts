
import { FhirPractitioner } from '@/types/referral';

export const mockPractitioners: FhirPractitioner[] = [
  {
    id: 'DR001',
    name: 'Dr. Emily Johnson',
    role: 'General Practitioner',
    organization: 'Oakwood Medical Practice',
    contact: 'emily.johnson@nhs.net'
  },
  {
    id: 'DR002',
    name: 'Dr. Michael Chen',
    role: 'General Practitioner',
    organization: 'Riverside Health Centre',
    contact: 'michael.chen@nhs.net'
  },
  {
    id: 'DR003',
    name: 'Dr. Sarah Ahmed',
    role: 'Emergency Medicine',
    organization: 'City General Hospital',
    contact: 'sarah.ahmed@nhs.net'
  },
  {
    id: 'DR004',
    name: 'Dr. James Wilson',
    role: 'General Practitioner',
    organization: 'The Access Group Elemental GP',
    contact: 'james.wilson@nhs.net'
  },
  {
    id: 'DR005',
    name: 'Dr. Sophie Brown',
    role: 'General Practitioner',
    organization: 'The Access Group Elemental GP',
    contact: 'sophie.brown@nhs.net'
  }
];
