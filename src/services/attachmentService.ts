
import { Attachment } from '@/types/referral';
import { mockReferrals } from './mockData';

const MOCK_DELAY = 1000;

// Get attachment content (in a real app, this would fetch the actual file)
export const fetchAttachment = async (referralId: string, attachmentId: string): Promise<Attachment | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const referral = mockReferrals.find(ref => ref.id === referralId);
      const attachment = referral?.attachments.find(att => att.id === attachmentId);
      resolve(attachment || null);
    }, MOCK_DELAY);
  });
};

