// Legacy utility functions for components that still need synchronous access to specialty data
import { getCachedSpecialtyIdByName, getCachedSpecialtyNameById } from '@/services/specialtyService';

// Temporary wrapper functions to provide synchronous access until all components are updated
export const getSpecialtyIdByName = (name: string): string => {
  return getCachedSpecialtyIdByName(name);
};

export const getSpecialtyNameById = (id: string): string => {
  return getCachedSpecialtyNameById(id);
};