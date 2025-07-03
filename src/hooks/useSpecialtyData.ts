import { useState, useEffect } from 'react';
import { Specialty, fetchAllSpecialties } from '@/services/specialtyService';

export const useSpecialtyData = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllSpecialties();
        setSpecialties(data);
        setError(null);
      } catch (err) {
        console.error('Error loading specialties:', err);
        setError('Failed to load specialties');
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  const getSpecialtyNames = (): string[] => {
    return specialties.map(s => s.name);
  };

  const getSpecialtyById = (id: string): Specialty | undefined => {
    return specialties.find(s => s.id === id);
  };

  const getSpecialtyByName = (name: string): Specialty | undefined => {
    return specialties.find(s => s.name === name);
  };

  const getSpecialtyIdByName = (name: string): string => {
    const specialty = specialties.find(s => s.name === name);
    return specialty ? specialty.id : name.toLowerCase().substring(0, 4);
  };

  const getSpecialtyNameById = (id: string): string => {
    const specialty = specialties.find(s => s.id === id);
    return specialty ? specialty.name : id;
  };

  return {
    specialties,
    isLoading,
    error,
    getSpecialtyNames,
    getSpecialtyById,
    getSpecialtyByName,
    getSpecialtyIdByName,
    getSpecialtyNameById,
  };
};