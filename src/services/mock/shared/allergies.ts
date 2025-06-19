
import { Allergy } from '@/types/allergy';

export const createPatientAllergies = (patientId: string, recordedBy: string, baseDate: string): Allergy[] => {
  const allergies: Allergy[] = [];
  
  // Different allergy profiles based on patient ID
  switch (patientId) {
    case 'P001':
      allergies.push(
        {
          id: `ALG001001`,
          allergen: 'Penicillin',
          type: 'drug',
          severity: 'severe',
          status: 'active',
          reactions: [
            { type: 'rash', description: 'Widespread urticarial rash' },
            { type: 'swelling', description: 'Facial angioedema' },
            { type: 'breathing_difficulty', description: 'Mild bronchospasm' }
          ],
          onsetDate: '2019-03-15T00:00:00Z',
          lastReactionDate: '2022-08-20T00:00:00Z',
          notes: 'Patient experienced severe reaction during treatment for pneumonia. Avoid all beta-lactam antibiotics.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG001002`,
          allergen: 'Shellfish',
          type: 'food',
          severity: 'moderate',
          status: 'active',
          reactions: [
            { type: 'hives', description: 'Localized urticaria' },
            { type: 'nausea' },
            { type: 'vomiting' }
          ],
          onsetDate: '2015-07-10T00:00:00Z',
          lastReactionDate: '2021-12-25T00:00:00Z',
          notes: 'Reaction occurs within 30 minutes of consumption. Patient carries antihistamines.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        }
      );
      break;

    case 'P002':
      allergies.push(
        {
          id: `ALG002001`,
          allergen: 'Aspirin',
          type: 'drug',
          severity: 'life-threatening',
          status: 'active',
          reactions: [
            { type: 'anaphylaxis', description: 'Systemic anaphylactic reaction' },
            { type: 'breathing_difficulty', description: 'Severe bronchospasm' },
            { type: 'swelling', description: 'Laryngeal edema' }
          ],
          onsetDate: '2020-01-15T00:00:00Z',
          lastReactionDate: '2020-01-15T00:00:00Z',
          notes: 'LIFE-THREATENING: Patient experienced anaphylaxis requiring emergency treatment. Avoid all NSAIDs and salicylates. Patient carries EpiPen.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG002002`,
          allergen: 'Latex',
          type: 'contact',
          severity: 'moderate',
          status: 'active',
          reactions: [
            { type: 'rash', description: 'Contact dermatitis' },
            { type: 'hives', description: 'Localized urticaria' }
          ],
          onsetDate: '2018-09-20T00:00:00Z',
          lastReactionDate: '2022-05-10T00:00:00Z',
          notes: 'Healthcare provider should use latex-free gloves and equipment.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG002003`,
          allergen: 'Peanuts',
          type: 'food',
          severity: 'severe',
          status: 'active',
          reactions: [
            { type: 'swelling', description: 'Lip and tongue swelling' },
            { type: 'breathing_difficulty', description: 'Wheezing' },
            { type: 'hives', description: 'Generalized urticaria' }
          ],
          onsetDate: '2016-04-12T00:00:00Z',
          lastReactionDate: '2021-11-08T00:00:00Z',
          notes: 'Severe reaction requiring emergency treatment. Patient avoids all nuts and carries EpiPen.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        }
      );
      break;

    case 'P003':
      allergies.push(
        {
          id: `ALG003001`,
          allergen: 'Morphine',
          type: 'drug',
          severity: 'moderate',
          status: 'active',
          reactions: [
            { type: 'nausea', description: 'Severe nausea' },
            { type: 'vomiting', description: 'Persistent vomiting' },
            { type: 'rash', description: 'Pruritic rash' }
          ],
          onsetDate: '2021-06-08T00:00:00Z',
          lastReactionDate: '2021-06-08T00:00:00Z',
          notes: 'Alternative analgesics should be used for pain management.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG003002`,
          allergen: 'Iodine Contrast',
          type: 'drug',
          severity: 'moderate',
          status: 'active',
          reactions: [
            { type: 'hives', description: 'Generalized urticaria' },
            { type: 'nausea' }
          ],
          onsetDate: '2019-11-22T00:00:00Z',
          lastReactionDate: '2019-11-22T00:00:00Z',
          notes: 'Premedication required before contrast studies. Consider alternative imaging methods.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        }
      );
      break;

    default:
      // Some patients have mild allergies or no allergies
      if (Math.random() > 0.3) { // 70% chance of having some allergies
        allergies.push({
          id: `ALG${patientId}001`,
          allergen: 'Pollen',
          type: 'environmental',
          severity: 'mild',
          status: 'active',
          reactions: [
            { type: 'other', description: 'Seasonal rhinitis and conjunctivitis' }
          ],
          onsetDate: '2020-01-01T00:00:00Z',
          notes: 'Seasonal allergies, well controlled with antihistamines.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        });
      }
      break;
  }

  return allergies;
};
