
import { Attachment } from '@/types/referral';
import { supabase } from '@/integrations/supabase/client';

const MOCK_DELAY = 1000;

export interface UploadDocumentData {
  file: File;
  title: string;
  description?: string;
}

// Upload a document to a referral
export const uploadDocument = async (
  referralId: string, 
  documentData: UploadDocumentData
): Promise<Attachment> => {
  try {
    // First, verify the referral exists
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('id')
      .eq('id', referralId)
      .single();

    if (referralError || !referral) {
      throw new Error('Referral not found');
    }

    // Create attachment record in database
    const { data: attachment, error: attachmentError } = await supabase
      .from('attachments')
      .insert({
        referral_id: referralId,
        filename: documentData.file.name,
        file_type: documentData.file.type,
        file_size: documentData.file.size,
        uploaded_by: 'Current User'
      })
      .select()
      .single();

    if (attachmentError) {
      throw new Error('Failed to create attachment record');
    }

    // Add audit log entry
    await supabase
      .from('audit_log')
      .insert({
        referral_id: referralId,
        action: `Document uploaded: ${documentData.title}`,
        user_name: 'Current User',
        notes: documentData.description || null
      });

    // Convert database record to Attachment type
    const newAttachment: Attachment = {
      id: attachment.id,
      title: documentData.title,
      contentType: attachment.file_type,
      url: attachment.file_url || `mock://uploads/${documentData.file.name}`,
      date: attachment.uploaded_date || attachment.created_at,
      size: attachment.file_size || documentData.file.size
    };

    console.log(`Document uploaded to referral ${referralId}:`, newAttachment);
    return newAttachment;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Delete a document from a referral
export const deleteDocument = async (
  referralId: string, 
  attachmentId: string
): Promise<boolean> => {
  try {
    // Get attachment details before deleting
    const { data: attachment, error: fetchError } = await supabase
      .from('attachments')
      .select('filename')
      .eq('id', attachmentId)
      .eq('referral_id', referralId)
      .single();

    if (fetchError || !attachment) {
      return false;
    }

    // Delete attachment
    const { error: deleteError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', attachmentId)
      .eq('referral_id', referralId);

    if (deleteError) {
      console.error('Error deleting attachment:', deleteError);
      return false;
    }

    // Add audit log entry
    await supabase
      .from('audit_log')
      .insert({
        referral_id: referralId,
        action: `Document deleted: ${attachment.filename}`,
        user_name: 'Current User'
      });

    console.log(`Document deleted from referral ${referralId}:`, attachment.filename);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};
