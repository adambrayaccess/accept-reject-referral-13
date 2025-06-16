
import { Attachment } from '@/types/referral';
import { mockReferrals } from './mockData';

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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      
      if (referralIndex === -1) {
        reject(new Error('Referral not found'));
        return;
      }

      // Create new attachment
      const newAttachment: Attachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: documentData.title,
        contentType: documentData.file.type,
        url: `mock://uploads/${documentData.file.name}`, // In real app, this would be the actual upload URL
        date: new Date().toISOString(),
        size: documentData.file.size
      };

      // Add to referral
      mockReferrals[referralIndex].attachments.push(newAttachment);

      // Add audit log entry
      if (!mockReferrals[referralIndex].auditLog) {
        mockReferrals[referralIndex].auditLog = [];
      }
      
      mockReferrals[referralIndex].auditLog.push({
        timestamp: new Date().toISOString(),
        user: 'Current User',
        action: `Document uploaded: ${documentData.title}`,
        notes: documentData.description || undefined
      });

      console.log(`Document uploaded to referral ${referralId}:`, newAttachment);
      resolve(newAttachment);
    }, MOCK_DELAY);
  });
};

// Delete a document from a referral
export const deleteDocument = async (
  referralId: string, 
  attachmentId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referralIndex = mockReferrals.findIndex(ref => ref.id === referralId);
      
      if (referralIndex === -1) {
        resolve(false);
        return;
      }

      const attachmentIndex = mockReferrals[referralIndex].attachments.findIndex(
        att => att.id === attachmentId
      );

      if (attachmentIndex === -1) {
        resolve(false);
        return;
      }

      const deletedAttachment = mockReferrals[referralIndex].attachments[attachmentIndex];
      
      // Remove attachment
      mockReferrals[referralIndex].attachments.splice(attachmentIndex, 1);

      // Add audit log entry
      if (!mockReferrals[referralIndex].auditLog) {
        mockReferrals[referralIndex].auditLog = [];
      }
      
      mockReferrals[referralIndex].auditLog.push({
        timestamp: new Date().toISOString(),
        user: 'Current User',
        action: `Document deleted: ${deletedAttachment.title}`
      });

      console.log(`Document deleted from referral ${referralId}:`, deletedAttachment.title);
      resolve(true);
    }, MOCK_DELAY);
  });
};
