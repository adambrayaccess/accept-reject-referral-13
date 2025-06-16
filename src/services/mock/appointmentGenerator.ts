
import { AppointmentDetails } from '@/types/referral';

export const generateMockAppointment = (referralId: string, createdDate: string, specialty: string): AppointmentDetails | undefined => {
  // 70% chance of having an appointment
  if (Math.random() > 0.7) return undefined;

  const appointmentTypes: AppointmentDetails['type'][] = ['consultation', 'pre-admission', 'follow-up', 'procedure'];
  const locations = [
    'Clinic Room 1',
    'Clinic Room 2', 
    'Outpatient Suite A',
    'Outpatient Suite B',
    'Day Surgery Unit',
    'Assessment Room',
    'Virtual Consultation'
  ];

  const consultants = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Watson',
    'Dr. James Thompson',
    'Dr. Lisa Anderson',
    'Dr. Robert Williams'
  ];

  const statuses: AppointmentDetails['status'][] = ['scheduled', 'confirmed', 'cancelled', 'completed'];

  // Generate appointment date (5-60 days from referral creation)
  const referralDate = new Date(createdDate);
  const daysFromReferral = Math.floor(Math.random() * 55) + 5;
  const appointmentDate = new Date(referralDate);
  appointmentDate.setDate(appointmentDate.getDate() + daysFromReferral);

  // Generate time slot
  const hours = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const time = `${hours.toString().padStart(2, '0')}:${minutes}`;

  return {
    id: `APT-${referralId}-001`,
    date: appointmentDate.toISOString().split('T')[0],
    time,
    type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    consultant: consultants[Math.floor(Math.random() * consultants.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: Math.random() > 0.7 ? 'Patient confirmed attendance' : undefined
  };
};

export const generateSubReferralData = (parentId: string): { parentReferralId?: string; childReferralIds?: string[]; isSubReferral?: boolean } => {
  // 50% chance of being involved in sub-referral relationships
  if (Math.random() > 0.5) return {};

  // 30% chance of being a sub-referral, 70% chance of having sub-referrals
  const isSubReferral = Math.random() < 0.3;
  
  if (isSubReferral) {
    return {
      parentReferralId: `PARENT-${Math.floor(Math.random() * 1000)}`,
      isSubReferral: true
    };
  } else {
    const numSubReferrals = Math.floor(Math.random() * 3) + 1;
    const childReferralIds = Array.from({ length: numSubReferrals }, (_, i) => 
      `SUB-${parentId}-${i + 1}`
    );
    return {
      childReferralIds
    };
  }
};
