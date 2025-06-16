
const MOCK_DELAY = 1000;

// In a real implementation, this would send an HL7 message to the EPR system
export const sendHL7Message = async (referralId: string, action: 'accept' | 'reject'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`HL7 message sent for referral ${referralId}: ${action.toUpperCase()}`);
      resolve(true);
    }, MOCK_DELAY);
  });
};
