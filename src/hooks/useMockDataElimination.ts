
import { useState, useCallback } from 'react';
import { MockDataEliminationService, EliminationResult } from '@/services/mockDataElimination/mockDataEliminationService';
import { PostEliminationCleanup } from '@/services/mockDataElimination/postEliminationCleanup';

export const useMockDataElimination = () => {
  const [isEliminating, setIsEliminating] = useState(false);
  const [eliminationResult, setEliminationResult] = useState<EliminationResult | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const eliminateAllData = useCallback(async () => {
    setIsEliminating(true);
    setEliminationResult(null);

    try {
      const result = await MockDataEliminationService.eliminateAllMockData();
      setEliminationResult(result);

      // If successful, perform cleanup
      if (result.success) {
        setIsCleaningUp(true);
        await PostEliminationCleanup.performCleanup();
        setIsCleaningUp(false);
      }

      return result;
    } catch (error) {
      const errorResult: EliminationResult = {
        success: false,
        error: error.message,
        tablesCleared: [],
        totalRecordsRemoved: 0,
        duration: 0,
        details: {}
      };
      setEliminationResult(errorResult);
      return errorResult;
    } finally {
      setIsEliminating(false);
    }
  }, []);

  const eliminateSelectiveData = useCallback(async (options: {
    patients?: boolean;
    referrals?: boolean;
    medicalHistory?: boolean;
    fhirData?: boolean;
  }) => {
    setIsEliminating(true);
    setEliminationResult(null);

    try {
      const result = await MockDataEliminationService.eliminateSpecificData(options);
      setEliminationResult(result);
      return result;
    } catch (error) {
      const errorResult: EliminationResult = {
        success: false,
        error: error.message,
        tablesCleared: [],
        totalRecordsRemoved: 0,
        duration: 0,
        details: {}
      };
      setEliminationResult(errorResult);
      return errorResult;
    } finally {
      setIsEliminating(false);
    }
  }, []);

  const resetResults = useCallback(() => {
    setEliminationResult(null);
  }, []);

  return {
    isEliminating,
    isCleaningUp,
    eliminationResult,
    eliminateAllData,
    eliminateSelectiveData,
    resetResults
  };
};
