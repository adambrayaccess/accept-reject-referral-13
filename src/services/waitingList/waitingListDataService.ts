
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { differenceInDays } from 'date-fns';

export const loadWaitingListReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  let data = await fetchReferrals();
  
  // Filter by selected specialties and waiting list status
  data = data.filter(ref => 
    (selectedSpecialties.length === 0 || selectedSpecialties.includes(ref.specialty)) && 
    ref.status === 'accepted' &&
    ref.triageStatus === 'waiting-list'
  );
  
  // Add calculated properties and ensure proper sorting
  const processedData = data.map(ref => {
    const createdDate = new Date(ref.created);
    const today = new Date();
    const ageInDays = differenceInDays(today, createdDate);
    
    const birthDate = new Date(ref.patient.birthDate);
    const ageInYears = Math.floor(differenceInDays(today, birthDate) / 365);
    
    const location = ref.patient.address ? 
      ref.patient.address.split(',').pop()?.trim() || '' : '';
    
    // Ensure tags array exists
    const tags = ref.tags || [];
    
    // Generate realistic appointment details if missing
    const appointmentDetails = ref.appointmentDetails || generateAppointmentDetails(ref, ageInDays);
      
    return {
      ...ref,
      calculatedReferralAge: ageInDays,
      calculatedPatientAge: ageInYears,
      calculatedLocation: location,
      tags,
      appointmentDetails
    };
  });
  
  // Sort by display order if available, otherwise by created date (newest first)
  const sortedData = processedData.sort((a, b) => {
    const orderA = (a as any).displayOrder;
    const orderB = (b as any).displayOrder;
    
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    
    // Fallback to date sorting if no display order
    return new Date(b.created).getTime() - new Date(a.created).getTime();
  });
  
  return sortedData;
};

// Helper function to generate realistic appointment details
const generateAppointmentDetails = (referral: Referral, ageInDays: number) => {
  const priority = referral.priority;
  const tags = referral.tags || [];
  
  // Determine appointment status based on referral characteristics
  if (ageInDays > 90) {
    return {
      status: 'overdue' as const,
      scheduledDate: null,
      location: null,
      notes: 'Appointment overdue - requires urgent scheduling'
    };
  }
  
  if (priority === 'urgent' || tags.includes('two-week-wait')) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    return {
      status: 'scheduled' as const,
      scheduledDate: scheduledDate.toISOString(),
      location: 'Outpatient Clinic 2',
      notes: 'Urgent appointment scheduled'
    };
  }
  
  if (ageInDays > 60) {
    return {
      status: 'pending' as const,
      scheduledDate: null,
      location: null,
      notes: 'Awaiting appointment scheduling'
    };
  }
  
  if (ageInDays > 30) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) + 7);
    
    return {
      status: 'confirmed' as const,
      scheduledDate: scheduledDate.toISOString(),
      location: 'Main Outpatient Department',
      notes: 'Standard appointment confirmed'
    };
  }
  
  return {
    status: 'pending' as const,
    scheduledDate: null,
    location: null,
    notes: 'Recently received - appointment to be scheduled'
  };
};
