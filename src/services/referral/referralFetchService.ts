import { supabase } from '@/integrations/supabase/client';
import { Referral, Patient, AppointmentDetails, ServiceRequest, Practitioner } from '@/types/referral';

const mapPatient = (patient: any): Patient => ({
  id: patient.id,
  name: patient.name,
  birthDate: patient.birth_date,
  gender: patient.gender,
  nhsNumber: patient.nhs_number,
  address: patient.address,
  phone: patient.phone
});

const mapAppointmentDetails = (appointment: any): AppointmentDetails => ({
  id: appointment.id,
  date: appointment.appointment_date,
  time: appointment.appointment_time,
  location: appointment.location,
  consultant: appointment.consultant,
  type: appointment.type,
  status: appointment.status,
  notes: appointment.notes
});

const mapServiceRequest = (serviceRequest: any): ServiceRequest => ({
  id: serviceRequest.id,
  requestDetails: serviceRequest.request_details,
  priority: serviceRequest.priority,
  notes: serviceRequest.notes
});

const mapPractitioner = (practitioner: any): Practitioner => ({
  id: practitioner.id,
  name: practitioner.name,
  role: practitioner.role,
  organization: practitioner.organization,
  contact: practitioner.contact
});

export const fetchReferralById = async (referralId: string): Promise<Referral | null> => {
  try {
    const { data: referral, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patient_id (
          *
        ),
        appointment_details:appointment_id (
          *
        ),
        service_request:service_request_id (
          *
        ),
        referred_by:referred_by_id (
          *
        ),
        referred_to:referred_to_id (
          *
        )
      `)
      .eq('id', referralId)
      .single();

    if (error) {
      console.error('Error fetching referral:', error);
      return null;
    }

    if (!referral) {
      console.log('Referral not found');
      return null;
    }

    const mappedReferral: Referral = {
      id: referral.id,
      patient: mapPatient(referral.patient),
      dateReceived: referral.date_received,
      priority: referral.priority,
      status: referral.status,
      reasonForReferral: referral.reason_for_referral,
      serviceType: referral.service_type,
      specialty: referral.specialty,
      appointmentDetails: referral.appointment_details ? mapAppointmentDetails(referral.appointment_details) : null,
      serviceRequest: referral.service_request ? mapServiceRequest(referral.service_request) : null,
      referredBy: referral.referred_by ? mapPractitioner(referral.referred_by) : null,
      referredTo: referral.referred_to ? mapPractitioner(referral.referred_to) : null,
      additionalNotes: referral.additional_notes,
      attachments: referral.attachments
    };

    return mappedReferral;
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};
