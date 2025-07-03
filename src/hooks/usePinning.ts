import { useState, useEffect } from 'react';
import { PinningService } from '@/services/pinningService';
import { useToast } from '@/hooks/use-toast';

export const usePinning = () => {
  const [pinnedReferralIds, setPinnedReferralIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load pinned referrals on mount
  useEffect(() => {
    loadPinnedReferrals();
  }, []);

  const loadPinnedReferrals = async () => {
    try {
      setIsLoading(true);
      const pinnedIds = await PinningService.getPinnedReferralIds();
      setPinnedReferralIds(new Set(pinnedIds));
    } catch (error) {
      console.error('Error loading pinned referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pinned referrals',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pinReferral = async (referralId: string) => {
    const result = await PinningService.pinReferral(referralId);
    
    if (result.success) {
      setPinnedReferralIds(prev => new Set([...prev, referralId]));
      toast({
        title: 'Success',
        description: 'Referral pinned successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to pin referral',
        variant: 'destructive',
      });
    }
    
    return result.success;
  };

  const unpinReferral = async (referralId: string) => {
    const result = await PinningService.unpinReferral(referralId);
    
    if (result.success) {
      setPinnedReferralIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(referralId);
        return newSet;
      });
      toast({
        title: 'Success',
        description: 'Referral unpinned successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to unpin referral',
        variant: 'destructive',
      });
    }
    
    return result.success;
  };

  const togglePin = async (referralId: string) => {
    if (pinnedReferralIds.has(referralId)) {
      return await unpinReferral(referralId);
    } else {
      return await pinReferral(referralId);
    }
  };

  const isPinned = (referralId: string) => {
    return pinnedReferralIds.has(referralId);
  };

  return {
    pinnedReferralIds,
    isLoading,
    pinReferral,
    unpinReferral,
    togglePin,
    isPinned,
    refreshPinnedReferrals: loadPinnedReferrals
  };
};