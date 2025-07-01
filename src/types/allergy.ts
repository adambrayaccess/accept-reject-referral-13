
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life-threatening';
export type AllergyType = 'medication' | 'drug' | 'food' | 'environmental' | 'contact' | 'other';
export type AllergyStatus = 'active' | 'inactive' | 'resolved';
export type VerificationStatus = 'unconfirmed' | 'confirmed' | 'refuted' | 'entered-in-error';

export interface AllergyReaction {
  type: 'rash' | 'hives' | 'swelling' | 'breathing_difficulty' | 'anaphylaxis' | 'nausea' | 'vomiting' | 'diarrhea' | 'other';
  description?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: AllergyType;
  severity: AllergySeverity;
  reactions: AllergyReaction[];
  onsetDate?: string;
  lastReactionDate?: string;
  status: AllergyStatus;
  verificationStatus: VerificationStatus;
  recordedDate: string;
  recordedBy: string;
  notes?: string;
}

export interface AllergyAlert {
  id: string;
  allergyId: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
  isActive: boolean;
  createdDate: string;
  updatedDate?: string;
}
