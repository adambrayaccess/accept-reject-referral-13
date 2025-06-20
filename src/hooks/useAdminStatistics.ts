
import { useMemo } from 'react';
import { Referral } from '@/types/referral';

export interface ServiceStats {
  service: string;
  total: number;
  new: number;
  accepted: number;
  rejected: number;
}

export interface OverallStats {
  totalReferrals: number;
  newReferrals: number;
  acceptedReferrals: number;
  rejectedReferrals: number;
  totalServices: number;
}

export const useAdminStatistics = (referrals: Referral[]) => {
  const serviceStats = useMemo(() => {
    const statsMap = new Map<string, ServiceStats>();
    
    referrals.forEach(referral => {
      const service = referral.specialty || 'Unknown';
      
      if (!statsMap.has(service)) {
        statsMap.set(service, {
          service,
          total: 0,
          new: 0,
          accepted: 0,
          rejected: 0,
        });
      }
      
      const stats = statsMap.get(service)!;
      stats.total++;
      
      switch (referral.status) {
        case 'new':
          stats.new++;
          break;
        case 'accepted':
          stats.accepted++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
      }
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.total - a.total);
  }, [referrals]);
  
  const overallStats = useMemo(() => {
    const stats: OverallStats = {
      totalReferrals: referrals.length,
      newReferrals: 0,
      acceptedReferrals: 0,
      rejectedReferrals: 0,
      totalServices: new Set(referrals.map(r => r.specialty)).size,
    };
    
    referrals.forEach(referral => {
      switch (referral.status) {
        case 'new':
          stats.newReferrals++;
          break;
        case 'accepted':
          stats.acceptedReferrals++;
          break;
        case 'rejected':
          stats.rejectedReferrals++;
          break;
      }
    });
    
    return stats;
  }, [referrals]);
  
  return { serviceStats, overallStats };
};

// Legacy exports for backward compatibility
export type SpecialtyStats = ServiceStats;
