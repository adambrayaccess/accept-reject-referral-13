
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'life-threatening';
export type AllergyType = 'drug' | 'food' | 'environmental' | 'contact' | 'other';
export type AllergyStatus = 'active' | 'inactive' | 'resolved';

export interface AllergyReaction {
  type: 'rash' | 'hives' | 'swelling' | 'breathing_difficulty' | 'anaphylaxis' | 'nausea' | 'vomiting' | 'diarrhea' | 'other';
  description?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: AllergyType;
  severity: AllergySeverity;
  status: AllergyStatus;
  reactions: AllergyReaction[];
  onsetDate?: string;
  lastReactionDate?: string;
  notes?: string;
  verificationStatus: 'confirmed' | 'suspected' | 'unlikely' | 'refuted';
  recordedBy: string;
  recordedDate: string;
}

export interface AllergyAlert {
  id: string;
  allergyId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  recommendations: string[];
}
