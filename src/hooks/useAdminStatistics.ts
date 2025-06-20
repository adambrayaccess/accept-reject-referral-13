
import { useMemo } from 'react';
import { Referral } from '@/types/referral';

export interface ServiceStats {
  service: string;
  total: number;
  new: number;
  accepted: number;
  rejected: number;
  preAssessment: number;
  assessed: number;
  waitingList: number;
  preAdmission: number;
  referToOther: number;
  averageWaitDays: number;
  longestWaitDays: number;
}

export interface OverallStats {
  totalReferrals: number;
  total: number;
  newReferrals: number;
  new: number;
  acceptedReferrals: number;
  accepted: number;
  rejectedReferrals: number;
  rejected: number;
  totalServices: number;
  waitingList: number;
  preAssessment: number;
  assessed: number;
  preAdmission: number;
  referToOther: number;
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
          preAssessment: 0,
          assessed: 0,
          waitingList: 0,
          preAdmission: 0,
          referToOther: 0,
          averageWaitDays: 0,
          longestWaitDays: 0,
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
        case 'pre-assessment':
          stats.preAssessment++;
          break;
        case 'assessed':
          stats.assessed++;
          break;
        case 'waiting-list':
          stats.waitingList++;
          break;
        case 'pre-admission':
          stats.preAdmission++;
          break;
        case 'refer-to-other':
          stats.referToOther++;
          break;
      }
    });
    
    // Calculate wait times for each service
    Array.from(statsMap.values()).forEach(stats => {
      const serviceReferrals = referrals.filter(r => (r.specialty || 'Unknown') === stats.service && r.status === 'waiting-list');
      if (serviceReferrals.length > 0) {
        const waitDays = serviceReferrals.map(r => {
          const created = new Date(r.created);
          const now = new Date();
          return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        });
        stats.averageWaitDays = Math.round(waitDays.reduce((a, b) => a + b, 0) / waitDays.length);
        stats.longestWaitDays = Math.max(...waitDays);
      }
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.total - a.total);
  }, [referrals]);
  
  const overallStats = useMemo(() => {
    const stats: OverallStats = {
      totalReferrals: referrals.length,
      total: referrals.length,
      newReferrals: 0,
      new: 0,
      acceptedReferrals: 0,
      accepted: 0,
      rejectedReferrals: 0,
      rejected: 0,
      totalServices: new Set(referrals.map(r => r.specialty)).size,
      waitingList: 0,
      preAssessment: 0,
      assessed: 0,
      preAdmission: 0,
      referToOther: 0,
    };
    
    referrals.forEach(referral => {
      switch (referral.status) {
        case 'new':
          stats.newReferrals++;
          stats.new++;
          break;
        case 'accepted':
          stats.acceptedReferrals++;
          stats.accepted++;
          break;
        case 'rejected':
          stats.rejectedReferrals++;
          stats.rejected++;
          break;
        case 'pre-assessment':
          stats.preAssessment++;
          break;
        case 'assessed':
          stats.assessed++;
          break;
        case 'waiting-list':
          stats.waitingList++;
          break;
        case 'pre-admission':
          stats.preAdmission++;
          break;
        case 'refer-to-other':
          stats.referToOther++;
          break;
      }
    });
    
    return stats;
  }, [referrals]);
  
  return { serviceStats, overallStats };
};

// Legacy exports for backward compatibility
export type SpecialtyStats = ServiceStats;
