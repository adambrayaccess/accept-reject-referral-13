
import { Referral } from '@/types/referral';

export const getPriorityVariant = (priority: Referral['priority']) => {
  switch (priority) {
    case 'emergency':
      return 'destructive';
    case 'urgent':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getPriorityCustomStyles = (priority: Referral['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-[#973060] text-white hover:bg-[#973060]/80';
    default:
      return '';
  }
};

export const getPriorityLabel = (priority: Referral['priority']) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};
