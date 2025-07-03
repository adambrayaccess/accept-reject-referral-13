import { supabase } from '@/integrations/supabase/client';

export interface ReferralLetter {
  id: string;
  referralId: string;
  letterType: string;
  letterContent: string;
  status: 'draft' | 'sent';
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  createdBy?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface CreateLetterData {
  referralId: string;
  letterType: string;
  letterContent: string;
  recipientName?: string;
  recipientEmail?: string;
}

export class LetterService {
  // Save a letter as draft
  static async saveDraft(data: CreateLetterData): Promise<{ success: boolean; error?: string; letter?: ReferralLetter }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: letter, error } = await supabase
        .from('referral_letters')
        .insert({
          referral_id: data.referralId,
          letter_type: data.letterType,
          letter_content: data.letterContent,
          status: 'draft',
          created_by: user?.email || 'Unknown User',
          recipient_name: data.recipientName,
          recipient_email: data.recipientEmail
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        letter: {
          id: letter.id,
          referralId: letter.referral_id,
          letterType: letter.letter_type,
          letterContent: letter.letter_content,
          status: letter.status,
          createdAt: letter.created_at,
          updatedAt: letter.updated_at,
          sentAt: letter.sent_at,
          createdBy: letter.created_by,
          recipientName: letter.recipient_name,
          recipientEmail: letter.recipient_email
        }
      };
    } catch (error) {
      console.error('Error saving letter draft:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save letter draft' 
      };
    }
  }

  // Send a letter (mark as sent)
  static async sendLetter(data: CreateLetterData): Promise<{ success: boolean; error?: string; letter?: ReferralLetter }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: letter, error } = await supabase
        .from('referral_letters')
        .insert({
          referral_id: data.referralId,
          letter_type: data.letterType,
          letter_content: data.letterContent,
          status: 'sent',
          sent_at: new Date().toISOString(),
          created_by: user?.email || 'Unknown User',
          recipient_name: data.recipientName,
          recipient_email: data.recipientEmail
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        letter: {
          id: letter.id,
          referralId: letter.referral_id,
          letterType: letter.letter_type,
          letterContent: letter.letter_content,
          status: letter.status,
          createdAt: letter.created_at,
          updatedAt: letter.updated_at,
          sentAt: letter.sent_at,
          createdBy: letter.created_by,
          recipientName: letter.recipient_name,
          recipientEmail: letter.recipient_email
        }
      };
    } catch (error) {
      console.error('Error sending letter:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send letter' 
      };
    }
  }

  // Get all letters for a referral
  static async getLettersByReferralId(referralId: string): Promise<ReferralLetter[]> {
    try {
      const { data, error } = await supabase
        .from('referral_letters')
        .select('*')
        .eq('referral_id', referralId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(letter => ({
        id: letter.id,
        referralId: letter.referral_id,
        letterType: letter.letter_type,
        letterContent: letter.letter_content,
        status: letter.status,
        createdAt: letter.created_at,
        updatedAt: letter.updated_at,
        sentAt: letter.sent_at,
        createdBy: letter.created_by,
        recipientName: letter.recipient_name,
        recipientEmail: letter.recipient_email
      }));
    } catch (error) {
      console.error('Error fetching letters:', error);
      return [];
    }
  }

  // Update draft letter
  static async updateDraft(letterId: string, letterContent: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('referral_letters')
        .update({
          letter_content: letterContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', letterId)
        .eq('status', 'draft'); // Only allow updating drafts

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating letter draft:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update letter draft' 
      };
    }
  }

  // Convert draft to sent
  static async markAsSent(letterId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('referral_letters')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', letterId)
        .eq('status', 'draft'); // Only allow converting drafts

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking letter as sent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark letter as sent' 
      };
    }
  }
}