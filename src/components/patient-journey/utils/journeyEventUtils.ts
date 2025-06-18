
import { Referral } from '@/types/referral';
import { format } from 'date-fns';

export interface JourneyEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'referral' | 'document' | 'appointment' | 'triage' | 'pathway' | 'phone-call' | 'letter' | 'communication' | 'booking' | 'assessment';
  status?: 'completed' | 'active' | 'scheduled' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export const generateJourneyEvents = (referral: Referral): JourneyEvent[] => {
  const events: JourneyEvent[] = [];

  // Referral creation
  events.push({
    id: 'referral-created',
    title: 'Referral Created',
    description: `Referral to ${referral.specialty} created`,
    date: referral.created,
    type: 'referral',
    status: 'completed',
    priority: referral.priority === 'emergency' ? 'high' : referral.priority === 'urgent' ? 'medium' : 'low'
  });

  // Generate sample patient interactions based on referral data
  const createDate = new Date(referral.created);
  
  // Phone call to confirm receipt (1 day after referral)
  const confirmCallDate = new Date(createDate);
  confirmCallDate.setDate(confirmCallDate.getDate() + 1);
  events.push({
    id: 'confirm-call',
    title: 'Phone Call: Referral Confirmation',
    description: 'Outbound call to patient confirming receipt of referral and initial triage assessment',
    date: confirmCallDate.toISOString(),
    type: 'phone-call',
    status: 'completed',
    metadata: { direction: 'outbound', duration: '5 minutes', outcome: 'confirmed' }
  });

  // Initial appointment booking (3 days after referral)
  const bookingDate = new Date(createDate);
  bookingDate.setDate(bookingDate.getDate() + 3);
  events.push({
    id: 'appointment-booking',
    title: 'Appointment Booking: Initial Assessment',
    description: 'Appointment booked for initial consultation and assessment',
    date: bookingDate.toISOString(),
    type: 'booking',
    status: 'completed',
    metadata: { 
      appointmentType: 'initial_consultation',
      bookedBy: 'Booking Team',
      method: 'online_system'
    }
  });

  // Letter sent with appointment details
  if (referral.appointmentDetails) {
    const letterDate = new Date(referral.appointmentDetails.date);
    letterDate.setDate(letterDate.getDate() - 14); // 2 weeks before appointment
    events.push({
      id: 'appointment-letter',
      title: 'Letter Sent: Appointment Details',
      description: `Appointment letter sent for ${referral.appointmentDetails.type} on ${format(new Date(referral.appointmentDetails.date), 'dd/MM/yyyy')}`,
      date: letterDate.toISOString(),
      type: 'letter',
      status: 'completed',
      metadata: { type: 'appointment_confirmation', method: 'post' }
    });
  }

  // Phone call from patient with query (based on priority)
  if (referral.priority === 'urgent' || referral.priority === 'emergency') {
    const queryCallDate = new Date(createDate);
    queryCallDate.setDate(queryCallDate.getDate() + 3);
    events.push({
      id: 'patient-query-call',
      title: 'Phone Call: Patient Query',
      description: 'Inbound call from patient asking about appointment timing due to urgent symptoms',
      date: queryCallDate.toISOString(),
      type: 'phone-call',
      status: 'completed',
      priority: referral.priority === 'emergency' ? 'high' : 'medium',
      metadata: { direction: 'inbound', duration: '8 minutes', outcome: 'reassured' }
    });
  }

  // Pre-assessment questionnaire sent
  if (referral.triageStatus === 'pre-assessment' || referral.triageStatus === 'assessed') {
    const preAssessmentDate = new Date(createDate);
    preAssessmentDate.setDate(preAssessmentDate.getDate() + 7);
    events.push({
      id: 'pre-assessment-letter',
      title: 'Letter Sent: Pre-Assessment Information',
      description: 'Information pack sent with pre-assessment questionnaire and preparation instructions',
      date: preAssessmentDate.toISOString(),
      type: 'letter',
      status: 'completed',
      metadata: { type: 'pre_assessment', method: 'post' }
    });
  }

  // Pre-assessment conducted (if applicable)
  if (referral.triageStatus === 'assessed' || referral.triageStatus === 'pre-admission-assessment') {
    const assessmentDate = new Date(createDate);
    assessmentDate.setDate(assessmentDate.getDate() + 14);
    events.push({
      id: 'pre-assessment-conducted',
      title: 'Pre-Assessment Conducted',
      description: 'Comprehensive pre-assessment completed including health questionnaire and baseline measurements',
      date: assessmentDate.toISOString(),
      type: 'assessment',
      status: 'completed',
      metadata: {
        assessmentType: 'pre_admission',
        duration: '45 minutes',
        outcome: 'suitable_for_procedure'
      }
    });
  }

  // Specialty-specific assessments
  if (referral.specialty === 'Mental Health') {
    const mentalHealthCallDate = new Date(createDate);
    mentalHealthCallDate.setDate(mentalHealthCallDate.getDate() + 5);
    events.push({
      id: 'mental-health-check',
      title: 'Phone Call: Welfare Check',
      description: 'Outbound welfare check call to assess current mental state and provide support',
      date: mentalHealthCallDate.toISOString(),
      type: 'phone-call',
      status: 'completed',
      metadata: { direction: 'outbound', duration: '15 minutes', outcome: 'stable' }
    });

    // Mental health assessment
    const mentalHealthAssessmentDate = new Date(createDate);
    mentalHealthAssessmentDate.setDate(mentalHealthAssessmentDate.getDate() + 10);
    events.push({
      id: 'mental-health-assessment',
      title: 'Mental Health Assessment',
      description: 'Comprehensive mental health assessment conducted by specialist clinician',
      date: mentalHealthAssessmentDate.toISOString(),
      type: 'assessment',
      status: 'completed',
      metadata: {
        assessmentType: 'psychological_evaluation',
        duration: '60 minutes',
        outcome: 'treatment_plan_developed'
      }
    });
  }

  // Cardiology-specific assessments
  if (referral.specialty === 'Cardiology') {
    const cardioAssessmentDate = new Date(createDate);
    cardioAssessmentDate.setDate(cardioAssessmentDate.getDate() + 12);
    events.push({
      id: 'cardiology-assessment',
      title: 'Cardiology Assessment',
      description: 'Comprehensive cardiac assessment including ECG and exercise stress test',
      date: cardioAssessmentDate.toISOString(),
      type: 'assessment',
      status: 'completed',
      metadata: {
        assessmentType: 'cardiac_evaluation',
        duration: '90 minutes',
        outcome: 'further_investigations_required'
      }
    });
  }

  // Follow-up appointment booking (after initial assessment)
  const followUpBookingDate = new Date(createDate);
  followUpBookingDate.setDate(followUpBookingDate.getDate() + 21);
  events.push({
    id: 'followup-booking',
    title: 'Appointment Booking: Follow-up',
    description: 'Follow-up appointment booked to review assessment results and discuss treatment options',
    date: followUpBookingDate.toISOString(),
    type: 'booking',
    status: 'scheduled',
    metadata: {
      appointmentType: 'follow_up',
      bookedBy: 'Consultant Secretary',
      method: 'phone_booking'
    }
  });

  // Appointment reminder call
  if (referral.appointmentDetails) {
    const reminderDate = new Date(referral.appointmentDetails.date);
    reminderDate.setDate(reminderDate.getDate() - 2); // 2 days before
    events.push({
      id: 'appointment-reminder',
      title: 'Phone Call: Appointment Reminder',
      description: `Reminder call for upcoming ${referral.appointmentDetails.type} appointment`,
      date: reminderDate.toISOString(),
      type: 'phone-call',
      status: 'completed',
      metadata: { direction: 'outbound', duration: '3 minutes', outcome: 'confirmed' }
    });
  }

  // Audit log events (triage actions)
  referral.auditLog?.forEach((entry, index) => {
    events.push({
      id: `audit-${index}`,
      title: entry.action,
      description: entry.notes,
      date: entry.timestamp,
      type: 'triage',
      status: 'completed'
    });
  });

  // Attachments/Documents
  referral.attachments?.forEach((attachment) => {
    events.push({
      id: `doc-${attachment.id}`,
      title: `Document Added: ${attachment.title}`,
      description: `File type: ${attachment.contentType}`,
      date: attachment.date,
      type: 'document',
      status: 'completed'
    });
  });

  // Appointment details
  if (referral.appointmentDetails) {
    events.push({
      id: 'appointment',
      title: `${referral.appointmentDetails.type.charAt(0).toUpperCase() + referral.appointmentDetails.type.slice(1)} Appointment`,
      description: `${referral.appointmentDetails.location}${referral.appointmentDetails.consultant ? ` with ${referral.appointmentDetails.consultant}` : ''}`,
      date: `${referral.appointmentDetails.date}T${referral.appointmentDetails.time}`,
      type: 'appointment',
      status: referral.appointmentDetails.status === 'scheduled' ? 'scheduled' : 
             referral.appointmentDetails.status === 'confirmed' ? 'active' : 
             referral.appointmentDetails.status
    });
  }

  // RTT Pathway milestones
  if (referral.rttPathway) {
    events.push({
      id: 'rtt-start',
      title: 'RTT Clock Started',
      description: `18-week pathway initiated`,
      date: referral.rttPathway.clockStart,
      type: 'pathway',
      status: 'completed'
    });

    // Add RTT target date as future event
    events.push({
      id: 'rtt-target',
      title: 'RTT Target Date',
      description: `18-week deadline (${referral.rttPathway.daysRemaining} days remaining)`,
      date: referral.rttPathway.targetDate,
      type: 'pathway',
      status: 'scheduled',
      priority: referral.rttPathway.breachRisk === 'breached' ? 'high' : 
               referral.rttPathway.breachRisk === 'high' ? 'medium' : 'low'
    });
  }

  // Sort events by date
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
