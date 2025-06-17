
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/referralService';
import { differenceInDays } from 'date-fns';

export const loadWaitingListReferrals = async (selectedSpecialties: string[] = []): Promise<Referral[]> => {
  let data = await fetchReferrals();
  
  console.log('Raw referrals loaded:', data.length);
  console.log('Sample raw referral:', data[0]);
  
  // Filter by selected specialties and waiting list status
  data = data.filter(ref => 
    (selectedSpecialties.length === 0 || selectedSpecialties.includes(ref.specialty)) && 
    ref.status === 'accepted' &&
    ref.triageStatus === 'waiting-list'
  );
  
  console.log('Filtered referrals:', data.length);
  
  // Add calculated properties and ensure proper sorting
  const processedData = data.map(ref => {
    const createdDate = new Date(ref.created);
    const today = new Date();
    const ageInDays = differenceInDays(today, createdDate);
    
    const birthDate = new Date(ref.patient.birthDate);
    const ageInYears = Math.floor(differenceInDays(today, birthDate) / 365);
    
    const location = ref.patient.address ? 
      ref.patient.address.split(',').pop()?.trim() || '' : '';
    
    // Ensure tags array exists and add some sample tags for testing
    let tags = ref.tags || [];
    
    // Add sample tags to some referrals for testing purposes
    if (!tags.length && Math.random() > 0.7) {
      const sampleTags = ['urgent', 'two-week-wait', 'complex-case', 'multidisciplinary', 'follow-up-required'];
      tags = [sampleTags[Math.floor(Math.random() * sampleTags.length)]];
    }
    
    // Generate realistic appointment details if missing
    const appointmentDetails = ref.appointmentDetails || generateAppointmentDetails(ref, ageInDays);
    
    const processedRef = {
      ...ref,
      calculatedReferralAge: ageInDays,
      calculatedPatientAge: ageInYears,
      calculatedLocation: location,
      tags,
      appointmentDetails
    };
    
    console.log(`Processed referral ${ref.id}: tags = ${JSON.stringify(tags)}`);
    return processedRef;
  });
  
  console.log('Processed referrals with tags:', processedData.filter(r => r.tags?.length).length);
  
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
  
  // Generate a unique ID for the appointment
  const appointmentId = `apt-${referral.id}-${Date.now()}`;
  
  // Determine appointment status based on referral characteristics
  if (ageInDays > 90) {
    return {
      id: appointmentId,
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      time: '09:00',
      type: 'consultation' as const,
      location: 'Outpatient Clinic',
      status: 'cancelled' as const, // Use cancelled to indicate overdue appointments
      notes: 'Appointment overdue - requires urgent scheduling'
    };
  }
  
  if (priority === 'urgent' || tags.includes('two-week-wait')) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    return {
      id: appointmentId,
      date: scheduledDate.toISOString().split('T')[0],
      time: '10:30',
      type: 'consultation' as const,
      location: 'Outpatient Clinic 2',
      status: 'scheduled' as const,
      notes: 'Urgent appointment scheduled'
    };
  }
  
  if (ageInDays > 60) {
    return {
      id: appointmentId,
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      type: 'consultation' as const,
      location: 'Outpatient Clinic',
      status: 'scheduled' as const, // Use scheduled for pending appointments
      notes: 'Awaiting appointment scheduling'
    };
  }
  
  if (ageInDays > 30) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) + 7);
    
    return {
      id: appointmentId,
      date: scheduledDate.toISOString().split('T')[0],
      time: '11:15',
      type: 'consultation' as const,
      location: 'Main Outpatient Department',
      status: 'confirmed' as const,
      notes: 'Standard appointment confirmed'
    };
  }
  
  return {
    id: appointmentId,
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    type: 'consultation' as const,
    location: 'Outpatient Clinic',
    status: 'scheduled' as const,
    notes: 'Recently received - appointment to be scheduled'
  };
};
