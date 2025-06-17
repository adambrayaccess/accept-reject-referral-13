
import { mockPatients } from '@/services/mock/patients';
import { Patient } from '@/types/referral';

export interface PatientSearchResult {
  patient: Patient;
  score: number;
}

// Simple fuzzy search implementation
const fuzzySearch = (query: string, text: string): number => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return 1;
  }
  
  // Character-by-character fuzzy matching
  let queryIndex = 0;
  let textIndex = 0;
  let matches = 0;
  
  while (queryIndex < queryLower.length && textIndex < textLower.length) {
    if (queryLower[queryIndex] === textLower[textIndex]) {
      matches++;
      queryIndex++;
    }
    textIndex++;
  }
  
  return matches / queryLower.length;
};

export const searchPatients = (query: string): PatientSearchResult[] => {
  if (!query || query.length < 2) {
    return [];
  }

  const results = mockPatients
    .map(patient => {
      // Search in name, NHS number, and phone
      const nameScore = fuzzySearch(query, patient.name);
      const nhsScore = fuzzySearch(query, patient.nhsNumber);
      const phoneScore = patient.phone ? fuzzySearch(query, patient.phone) : 0;
      
      // Take the highest score
      const score = Math.max(nameScore, nhsScore, phoneScore);
      
      return { patient, score };
    })
    .filter(result => result.score > 0.3) // Minimum threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Limit to top 5 results

  return results;
};
