
export interface Allergy {
  id: string;
  allergen: string;
  type: 'medication' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  reactions?: string[];
  onsetDate?: string;
  lastReactionDate?: string;
  status: 'active' | 'inactive' | 'resolved';
  verificationStatus: 'unconfirmed' | 'confirmed' | 'refuted' | 'entered-in-error';
  recordedDate?: string;
  recordedBy?: string;
  notes?: string;
}
