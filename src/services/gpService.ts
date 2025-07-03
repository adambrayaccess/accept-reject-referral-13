import { supabase } from '@/integrations/supabase/client';
import { GPDetails } from '@/types/patient';

export interface DatabaseGPDetails {
  id: string;
  name: string;
  practice: string;
  address: string;
  phone: string;
  email?: string;
  patient_id?: string;
  created_at?: string;
}

export const fetchGPDetails = async (searchTerm?: string): Promise<GPDetails[]> => {
  try {
    console.log('Fetching GP details from database...', searchTerm ? `with search: ${searchTerm}` : '');
    
    let query = supabase
      .from('gp_details')
      .select('*')
      .order('name', { ascending: true });

    if (searchTerm && searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,practice.ilike.%${searchTerm}%`);
    }

    const { data: gpDetails, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching GP details:', error);
      return [];
    }

    console.log(`Successfully fetched ${gpDetails?.length || 0} GP records`);
    
    // Map database GP details to GPDetails interface
    return gpDetails?.map(gp => ({
      id: gp.id,
      name: gp.name,
      practice: gp.practice,
      address: gp.address,
      phone: gp.phone,
      email: gp.email || undefined
    })) || [];
  } catch (error) {
    console.error('Error fetching GP details:', error);
    return [];
  }
};

export const fetchGPDetailById = async (id: string): Promise<GPDetails | null> => {
  try {
    const { data: gp, error } = await supabase
      .from('gp_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !gp) {
      console.error('Error fetching GP by ID:', error);
      return null;
    }

    return {
      id: gp.id,
      name: gp.name,
      practice: gp.practice,
      address: gp.address,
      phone: gp.phone,
      email: gp.email || undefined
    };
  } catch (error) {
    console.error('Error fetching GP by ID:', error);
    return null;
  }
};