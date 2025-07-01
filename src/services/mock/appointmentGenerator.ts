import { AppointmentDetails } from '@/types/workflow';

const appointmentTypes = ['Initial Consultation', 'Follow-up', 'Review', 'Assessment'];
const appointmentStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
const locations = ['Clinic A', 'Clinic B', 'Virtual'];
const consultants = ['Dr. Smith', 'Dr. Jones', 'Dr. Williams'];

// Function to generate a random date within a reasonable range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random time
const getRandomTime = () => {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hour}:${minute}`;
};

export const generateAppointmentDetails = (referral: any): AppointmentDetails => {
  const appointmentDate = getRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 60)));
  const appointmentTime = getRandomTime();
  const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
  const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const consultant = consultants[Math.floor(Math.random() * consultants.length)];
  const notes = `Appointment for ${referral.patient.name} - ${appointmentType} at ${location}`;
  
  return {
    id: `APT-${referral.id.slice(-8)}`,
    appointmentDate: appointmentDate.toISOString().split('T')[0],
    appointmentTime: appointmentTime,
    type: appointmentType,
    status: status,
    location: location,
    consultant: consultant,
    notes: notes
  };
};
