
import { Patient } from '@/types/patient';
import { patient004ReasonableAdjustments } from './patient-004/reasonable-adjustments';
import { patient004MedicalHistory } from './patient-004/medical-history';

export const patient004: Patient = {
  id: 'P004',
  name: 'Emma Thompson',
  birthDate: '1990-03-15',
  gender: 'female',
  nhsNumber: '456 789 0123',
  address: '25 High Street, Leeds, LS1 4HG',
  phone: '07700 900234',
  pronouns: 'she/her',
  ethnicity: 'Asian British - Pakistani',
  accommodationType: 'Rented - Private',
  gpDetails: {
    id: 'GP004',
    name: 'Dr. Helen Roberts',
    practice: 'Leeds Community Health Centre',
    address: '789 Community Road, Leeds, LS1 5EE',
    phone: '0113 234 5678',
    email: 'helen.roberts@leedscommunity.nhs.uk'
  },
  pharmacies: [
    {
      id: 'PH004',
      name: 'Superdrug Pharmacy',
      address: '12 High Street, Leeds, LS1 6FF',
      phone: '0113 345 6789',
      type: 'nominated'
    },
    {
      id: 'PH005',
      name: 'Independent Pharmacy',
      address: '45 Local Road, Leeds, LS1 7GG',
      phone: '0113 456 7890',
      type: 'linked'
    }
  ],
  relatedPeople: [
    {
      id: 'RP005',
      name: 'Sarah Thompson',
      relationship: 'daughter',
      phone: '07700 123456',
      email: 'sarah.thompson@email.com',
      isPrimaryContact: true,
      isNextOfKin: true,
      isEmergencyContact: true
    },
    {
      id: 'RP006',
      name: 'Ahmed Thompson',
      relationship: 'husband',
      phone: '07700 900235',
      isPrimaryContact: false,
      isNextOfKin: false,
      isEmergencyContact: true
    }
  ],
  historicAddresses: [
    {
      id: 'HA004',
      address: '123 Previous Avenue, Bradford, BD1 1AA',
      dateFrom: '2015-01-01T00:00:00Z',
      dateTo: '2020-06-30T00:00:00Z',
      type: 'residential'
    },
    {
      id: 'HA005',
      address: '456 Student Halls, Leeds, LS2 9AA',
      dateFrom: '2008-09-01T00:00:00Z',
      dateTo: '2012-07-31T00:00:00Z',
      type: 'temporary'
    }
  ],
  medicalHistory: patient004MedicalHistory,
  reasonableAdjustments: patient004ReasonableAdjustments,
  accessRestriction: {
    isRestricted: false
  }
};
