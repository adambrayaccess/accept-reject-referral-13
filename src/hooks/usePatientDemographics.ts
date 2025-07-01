
import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';
import { fetchPatientDemographics } from '@/services/patientDemographicsService';
import { useToast } from '@/hooks/use-toast';

export const usePatientDemographics = (patientId: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPatientDemographics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const patientData = await fetchPatientDemographics(patientId);
      
      if (!patientData) {
        setError('Patient not found');
        toast({
          title: 'Error',
          description: 'Could not load patient demographics',
          variant: 'destructive',
        });
        return;
      }
      
      setPatient(patientData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patient demographics';
      setError(errorMessage);
      console.error('Error loading patient demographics:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadPatientDemographics();
    }
  }, [patientId]);

  return {
    patient,
    isLoading,
    error,
    refetch: loadPatientDemographics
  };
};
