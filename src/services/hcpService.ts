import { supabase } from '@/integrations/supabase/client';

export interface HCP {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  contact?: string;
  active?: boolean;
  gender?: string;
  birth_date?: string;
  external_id?: string;
  fhir_id?: string;
  qualification_code?: string;
  qualification_display?: string;
  qualification_issuer?: string;
}

export const fetchAllHCPs = async (): Promise<HCP[]> => {
  try {
    console.log('Fetching all HCPs from database');
    
    const { data, error } = await supabase
      .from('hcp')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching HCPs:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} HCPs`);
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching HCPs:', error);
    return [];
  }
};

export const fetchHCPById = async (hcpId: string): Promise<HCP | null> => {
  try {
    console.log('Fetching HCP by ID:', hcpId);
    
    const { data, error } = await supabase
      .from('hcp')
      .select('*')
      .eq('id', hcpId)
      .single();

    if (error) {
      console.error('Error fetching HCP by ID:', error);
      return null;
    }

    console.log('Successfully fetched HCP:', data?.name);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching HCP by ID:', error);
    return null;
  }
};

export const fetchHCPsByRole = async (role: string): Promise<HCP[]> => {
  try {
    console.log('Fetching HCPs by role:', role);
    
    const { data, error } = await supabase
      .from('hcp')
      .select('*')
      .eq('role', role)
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching HCPs by role:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} HCPs with role: ${role}`);
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching HCPs by role:', error);
    return [];
  }
};

export const fetchHCPsByOrganization = async (organization: string): Promise<HCP[]> => {
  try {
    console.log('Fetching HCPs by organization:', organization);
    
    const { data, error } = await supabase
      .from('hcp')
      .select('*')
      .eq('organization', organization)
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching HCPs by organization:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} HCPs from organization: ${organization}`);
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching HCPs by organization:', error);
    return [];
  }
};