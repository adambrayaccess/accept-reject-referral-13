
import { Allergy } from '@/types/allergy';

export const createPatientAllergies = (patientId: string, recordedBy: string, baseDate: string): Allergy[] => {
  const allergies: Allergy[] = [];
  
  // 75% of patients should have allergies (only 25% have no allergies)
  const shouldHaveAllergies = Math.random() > 0.25;
  
  if (!shouldHaveAllergies) {
    return []; // 25% of patients have no allergies
  }
  
  // Different allergy profiles based on patient ID
  switch (patientId) {
    case 'P001':
      allergies.push(
        {
          id: `ALG001001`,
          allergen: 'Penicillin',
          type: 'medication',
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
          type: 'medication',
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
          type: 'other',
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
          type: 'medication',
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
          type: 'medication',
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

    case 'P004':
      allergies.push(
        {
          id: `ALG004001`,
          allergen: 'Codeine',
          type: 'medication',
          severity: 'moderate',
          status: 'active',
          reactions: [
            { type: 'nausea', description: 'Severe nausea and vomiting' },
            { type: 'other', description: 'Dizziness and confusion' }
          ],
          onsetDate: '2022-01-10T00:00:00Z',
          lastReactionDate: '2022-01-10T00:00:00Z',
          notes: 'Use alternative analgesics. Patient tolerates paracetamol and ibuprofen well.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG004002`,
          allergen: 'Eggs',
          type: 'food',
          severity: 'mild',
          status: 'active',
          reactions: [
            { type: 'other', description: 'Mild gastrointestinal upset' },
            { type: 'nausea' }
          ],
          onsetDate: '2018-05-15T00:00:00Z',
          lastReactionDate: '2023-03-20T00:00:00Z',
          notes: 'Patient can tolerate small amounts in baked goods but not raw or lightly cooked eggs.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        }
      );
      break;

    case 'P005':
      allergies.push(
        {
          id: `ALG005001`,
          allergen: 'Amoxicillin',
          type: 'medication',
          severity: 'severe',
          status: 'active',
          reactions: [
            { type: 'rash', description: 'Severe skin rash' },
            { type: 'swelling', description: 'Facial swelling' },
            { type: 'breathing_difficulty', description: 'Shortness of breath' }
          ],
          onsetDate: '2020-11-05T00:00:00Z',
          lastReactionDate: '2020-11-05T00:00:00Z',
          notes: 'Cross-reactivity with other penicillins. Use alternative antibiotics.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        },
        {
          id: `ALG005002`,
          allergen: 'Tree Pollen',
          type: 'environmental',
          severity: 'mild',
          status: 'active',
          reactions: [
            { type: 'other', description: 'Seasonal rhinitis, sneezing, watery eyes' }
          ],
          onsetDate: '2015-04-01T00:00:00Z',
          lastReactionDate: '2023-04-15T00:00:00Z',
          notes: 'Seasonal allergy, peaks in spring. Managed with antihistamines.',
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        }
      );
      break;

    default:
      // Generate random realistic allergies for other patients
      const commonAllergies = [
        {
          allergen: 'Pollen',
          type: 'environmental' as const,
          severity: 'mild' as const,
          reactions: [{ type: 'other' as const, description: 'Seasonal rhinitis and conjunctivitis' }],
          notes: 'Seasonal allergies, well controlled with antihistamines.'
        },
        {
          allergen: 'Dust Mites',
          type: 'environmental' as const,
          severity: 'mild' as const,
          reactions: [{ type: 'other' as const, description: 'Rhinitis, sneezing, itchy eyes' }],
          notes: 'Year-round symptoms, managed with regular cleaning and air purifiers.'
        },
        {
          allergen: 'Ibuprofen',
          type: 'medication' as const,
          severity: 'moderate' as const,
          reactions: [{ type: 'nausea' as const }, { type: 'other' as const, description: 'Stomach upset' }],
          notes: 'Use paracetamol as alternative. Avoid all NSAIDs.'
        },
        {
          allergen: 'Milk',
          type: 'food' as const,
          severity: 'mild' as const,
          reactions: [{ type: 'diarrhea' as const }, { type: 'nausea' as const }],
          notes: 'Lactose intolerance. Can tolerate lactose-free products.'
        },
        {
          allergen: 'Cats',
          type: 'environmental' as const,
          severity: 'moderate' as const,
          reactions: [{ type: 'other' as const, description: 'Rhinitis, sneezing, itchy eyes' }],
          notes: 'Reaction to cat dander. Symptoms improve with antihistamines.'
        },
        {
          allergen: 'Trimethoprim',
          type: 'medication' as const,
          severity: 'moderate' as const,
          reactions: [{ type: 'rash' as const, description: 'Skin rash' }],
          notes: 'Alternative antibiotics should be used for UTI treatment.'
        },
        {
          allergen: 'Plasters/Adhesive',
          type: 'other' as const,
          severity: 'mild' as const,
          reactions: [{ type: 'rash' as const, description: 'Contact dermatitis' }],
          notes: 'Use hypoallergenic adhesive products in healthcare settings.'
        }
      ];

      // Randomly select 1-3 allergies for this patient
      const numAllergies = Math.floor(Math.random() * 3) + 1;
      const selectedAllergies = [...commonAllergies].sort(() => 0.5 - Math.random()).slice(0, numAllergies);

      selectedAllergies.forEach((allergy, index) => {
        allergies.push({
          id: `ALG${patientId}${String(index + 1).padStart(3, '0')}`,
          allergen: allergy.allergen,
          type: allergy.type,
          severity: allergy.severity,
          status: 'active',
          reactions: allergy.reactions,
          onsetDate: '2020-01-01T00:00:00Z',
          notes: allergy.notes,
          verificationStatus: 'confirmed',
          recordedBy,
          recordedDate: baseDate
        });
      });
      break;
  }

  return allergies;
};
