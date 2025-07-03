import { supabase } from '@/integrations/supabase/client';

export interface ClinicalNote {
  id: string;
  referralId: string;
  noteContent: string;
  noteType: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isInternal: boolean;
}

export interface CreateClinicalNoteData {
  referralId: string;
  noteContent: string;
  noteType?: string;
  isInternal?: boolean;
}

export class ClinicalNotesService {
  // Create a new clinical note
  static async createNote(data: CreateClinicalNoteData): Promise<{ success: boolean; error?: string; note?: ClinicalNote }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: note, error } = await supabase
        .from('clinical_notes')
        .insert({
          referral_id: data.referralId,
          note_content: data.noteContent,
          note_type: data.noteType || 'clinical',
          is_internal: data.isInternal ?? true,
          created_by: user?.email || 'Unknown User'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        note: {
          id: note.id,
          referralId: note.referral_id,
          noteContent: note.note_content,
          noteType: note.note_type,
          createdAt: note.created_at,
          updatedAt: note.updated_at,
          createdBy: note.created_by,
          isInternal: note.is_internal
        }
      };
    } catch (error) {
      console.error('Error creating clinical note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create clinical note' 
      };
    }
  }

  // Get all clinical notes for a referral
  static async getNotesByReferralId(referralId: string): Promise<ClinicalNote[]> {
    try {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('referral_id', referralId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(note => ({
        id: note.id,
        referralId: note.referral_id,
        noteContent: note.note_content,
        noteType: note.note_type,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        createdBy: note.created_by,
        isInternal: note.is_internal
      }));
    } catch (error) {
      console.error('Error fetching clinical notes:', error);
      return [];
    }
  }

  // Update a clinical note
  static async updateNote(noteId: string, noteContent: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('clinical_notes')
        .update({
          note_content: noteContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating clinical note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update clinical note' 
      };
    }
  }

  // Delete a clinical note
  static async deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('clinical_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting clinical note:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete clinical note' 
      };
    }
  }
}