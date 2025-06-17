
/**
 * Utility for randomly selecting referrals to have UBRN set to 'N/A'
 * Uses a deterministic approach based on referral ID for consistency
 */

export function shouldSetUbrnToNA(referralId: string, percentage: number = 0.2): boolean {
  // Use a simple hash of the referral ID to determine if UBRN should be N/A
  // This ensures consistent results across runs
  let hash = 0;
  for (let i = 0; i < referralId.length; i++) {
    const char = referralId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a value between 0 and 1
  const normalizedHash = Math.abs(hash) / 2147483647; // Max 32-bit integer
  
  return normalizedHash < percentage;
}

export function updateUbrnIfSelected(referral: any): any {
  if (shouldSetUbrnToNA(referral.id)) {
    return {
      ...referral,
      ubrn: 'N/A'
    };
  }
  return referral;
}
