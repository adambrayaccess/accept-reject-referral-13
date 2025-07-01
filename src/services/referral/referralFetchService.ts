
import { supabase } from '@/integrations/supabase/client';
import { Referral, Patient, AppointmentDetails, Practitioner } from '@/types/referral';

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
        referrer:referrer_id (
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
      ubrn: referral.ubrn,
      created: referral.created_at,
      status: referral.status,
      priority: referral.priority,
      patient: mapPatient(referral.patient),
      referrer: mapPractitioner(referral.referrer),
      specialty: referral.specialty,
      service: referral.service,
      clinicalInfo: {
        reason: referral.reason,
        history: referral.history,
        diagnosis: referral.diagnosis,
        medications: referral.medications ? referral.medications.split(',') : [],
        allergies: referral.allergies_info ? referral.allergies_info.split(',') : [],
        notes: referral.notes
      },
      attachments: [],
      triageStatus: referral.triage_status,
      parentReferralId: referral.parent_referral_id,
      isSubReferral: referral.is_sub_referral,
      aiGenerated: referral.ai_generated,
      confidence: referral.confidence,
      teamId: referral.team_id,
      assignedHCPId: referral.assigned_hcp_id,
      allocatedDate: referral.allocated_date,
      allocatedBy: referral.allocated_by
    };

    return mappedReferral;
  } catch (error) {
    console.error('Error fetching referral:', error);
    return null;
  }
};

export const fetchReferrals = async (): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patient_id (
          *
        ),
        referrer:referrer_id (
          *
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }

    return referrals.map(referral => ({
      id: referral.id,
      ubrn: referral.ubrn,
      created: referral.created_at,
      status: referral.status,
      priority: referral.priority,
      patient: mapPatient(referral.patient),
      referrer: mapPractitioner(referral.referrer),
      specialty: referral.specialty,
      service: referral.service,
      clinicalInfo: {
        reason: referral.reason,
        history: referral.history,
        diagnosis: referral.diagnosis,
        medications: referral.medications ? referral.medications.split(',') : [],
        allergies: referral.allergies_info ? referral.allergies_info.split(',') : [],
        notes: referral.notes
      },
      attachments: [],
      triageStatus: referral.triage_status,
      parentReferralId: referral.parent_referral_id,
      isSubReferral: referral.is_sub_referral,
      aiGenerated: referral.ai_generated,
      confidence: referral.confidence,
      teamId: referral.team_id,
      assignedHCPId: referral.assigned_hcp_id,
      allocatedDate: referral.allocated_date,
      allocatedBy: referral.allocated_by
    }));
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return [];
  }
};

export const fetchPatientReferrals = async (patientId: string): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patient_id (
          *
        ),
        referrer:referrer_id (
          *
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patient referrals:', error);
      return [];
    }

    return referrals.map(referral => ({
      id: referral.id,
      ubrn: referral.ubrn,
      created: referral.created_at,
      status: referral.status,
      priority: referral.priority,
      patient: mapPatient(referral.patient),
      referrer: mapPractitioner(referral.referrer),
      specialty: referral.specialty,
      service: referral.service,
      clinicalInfo: {
        reason: referral.reason,
        history: referral.history,
        diagnosis: referral.diagnosis,
        medications: referral.medications ? referral.medications.split(',') : [],
        allergies: referral.allergies_info ? referral.allergies_info.split(',') : [],
        notes: referral.notes
      },
      attachments: [],
      triageStatus: referral.triage_status,
      parentReferralId: referral.parent_referral_id,
      isSubReferral: referral.is_sub_referral,
      aiGenerated: referral.ai_generated,
      confidence: referral.confidence,
      teamId: referral.team_id,
      assignedHCPId: referral.assigned_hcp_id,
      allocatedDate: referral.allocated_date,
      allocatedBy: referral.allocated_by
    }));
  } catch (error) {
    console.error('Error fetching patient referrals:', error);
    return [];
  }
};

export const fetchChildReferrals = async (parentReferralId: string): Promise<Referral[]> => {
  try {
    const { data: referrals, error } = await supabase
      .from('referrals')
      .select(`
        *,
        patient:patient_id (
          *
        ),
        referrer:referrer_id (
          *
        )
      `)
      .eq('parent_referral_id', parentReferralId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching child referrals:', error);
      return [];
    }

    return referrals.map(referral => ({
      id: referral.id,
      ubrn: referral.ubrn,
      created: referral.created_at,
      status: referral.status,
      priority: referral.priority,
      patient: mapPatient(referral.patient),
      referrer: mapPractitioner(referral.referrer),
      specialty: referral.specialty,
      service: referral.service,
      clinicalInfo: {
        reason: referral.reason,
        history: referral.history,
        diagnosis: referral.diagnosis,
        medications: referral.medications ? referral.medications.split(',') : [],
        allergies: referral.allergies_info ? referral.allergies_info.split(',') : [],
        notes: referral.notes
      },
      attachments: [],
      triageStatus: referral.triage_status,
      parentReferralId: referral.parent_referral_id,
      isSubReferral: referral.is_sub_referral,
      aiGenerated: referral.ai_generated,
      confidence: referral.confidence,
      teamId: referral.team_id,
      assignedHCPId: referral.assigned_hcp_id,
      allocatedDate: referral.allocated_date,
      allocatedBy: referral.allocated_by
    }));
  } catch (error) {
    console.error('Error fetching child referrals:', error);
    return [];
  }
};

export const fetchParentReferral = async (childReferralId: string): Promise<Referral | null> => {
  try {
    // First get the child referral to find its parent
    const { data: childReferral, error: childError } = await supabase
      .from('referrals')
      .select('parent_referral_id')
      .eq('id', childReferralId)
      .single();

    if (childError || !childReferral?.parent_referral_id) {
      return null;
    }

    return await fetchReferralById(childReferral.parent_referral_id);
  } catch (error) {
    console.error('Error fetching parent referral:', error);
    return null;
  }
};
