import { supabase } from '@/integrations/supabase/client';
import { FhirPractitioner } from '@/types/referral';

export const fetchPractitioners = async (): Promise<FhirPractitioner[]> => {
  try {
    console.log('Fetching practitioners from database...');
    
    const { data: practitioners, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching practitioners:', error);
      return [];
    }

    console.log(`Successfully fetched ${practitioners?.length || 0} practitioners`);
    
    // Map database practitioners to FhirPractitioner interface
    return practitioners?.map(practitioner => ({
      id: practitioner.id,
      name: practitioner.name,
      role: practitioner.role,
      organization: practitioner.organization,
      contact: practitioner.contact,
      fhirId: practitioner.fhir_id,
      active: practitioner.active,
      gender: practitioner.gender,
      birthDate: practitioner.birth_date
    })) || [];
  } catch (error) {
    console.error('Error fetching practitioners:', error);
    return [];
  }
};

export const fetchPractitionerById = async (id: string): Promise<FhirPractitioner | null> => {
  try {
    const { data: practitioner, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error || !practitioner) {
      console.error('Error fetching practitioner by ID:', error);
      return null;
    }

    return {
      id: practitioner.id,
      name: practitioner.name,
      role: practitioner.role,
      organization: practitioner.organization,
      contact: practitioner.contact,
      fhirId: practitioner.fhir_id,
      active: practitioner.active,
      gender: practitioner.gender,
      birthDate: practitioner.birth_date
    };
  } catch (error) {
    console.error('Error fetching practitioner by ID:', error);
    return null;
  }
};