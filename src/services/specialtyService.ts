import { supabase } from '@/integrations/supabase/client';

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export const fetchAllSpecialties = async (): Promise<Specialty[]> => {
  try {
    console.log('Fetching all specialties from database');
    
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('active', true)
      .order('display_order', { nullsFirst: false })
      .order('name');

    if (error) {
      console.error('Error fetching specialties:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} specialties`);
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching specialties:', error);
    return [];
  }
};

export const fetchSpecialtyById = async (id: string): Promise<Specialty | null> => {
  try {
    console.log('Fetching specialty by ID:', id);
    
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching specialty by ID:', error);
      return null;
    }

    console.log('Successfully fetched specialty:', data?.name);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching specialty by ID:', error);
    return null;
  }
};

export const fetchSpecialtyByName = async (name: string): Promise<Specialty | null> => {
  try {
    console.log('Fetching specialty by name:', name);
    
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      console.error('Error fetching specialty by name:', error);
      return null;
    }

    console.log('Successfully fetched specialty:', data?.name);
    return data;
  } catch (error) {
    console.error('Unexpected error fetching specialty by name:', error);
    return null;
  }
};

// Helper functions for backward compatibility
export const getAllSpecialtyNames = async (): Promise<string[]> => {
  const specialties = await fetchAllSpecialties();
  return specialties.map(s => s.name);
};

export const getSpecialtyNameById = async (id: string): Promise<string> => {
  const specialty = await fetchSpecialtyById(id);
  return specialty ? specialty.name : id;
};

export const getSpecialtyIdByName = async (name: string): Promise<string> => {
  const specialty = await fetchSpecialtyByName(name);
  return specialty ? specialty.id : name.toLowerCase().substring(0, 4);
};

export const isValidSpecialty = async (specialtyId: string): Promise<boolean> => {
  const specialty = await fetchSpecialtyById(specialtyId);
  return specialty !== null;
};

// Cached version for synchronous access (fallback)
let cachedSpecialties: Specialty[] = [];

export const initializeSpecialtyCache = async (): Promise<void> => {
  cachedSpecialties = await fetchAllSpecialties();
};

export const getCachedSpecialtyNames = (): string[] => {
  return cachedSpecialties.map(s => s.name);
};

export const getCachedSpecialtyIdByName = (name: string): string => {
  const specialty = cachedSpecialties.find(s => s.name === name);
  return specialty ? specialty.id : name.toLowerCase().substring(0, 4);
};

export const getCachedSpecialtyNameById = (id: string): string => {
  const specialty = cachedSpecialties.find(s => s.id === id);
  return specialty ? specialty.name : id;
};