
import { useMemo } from 'react';
import { Referral } from '@/types/referral';
import { differenceInDays } from 'date-fns';

interface SpecialtyStats {
  specialty: string;
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

interface OverallStats {
  total: number;
  new: number;
  accepted: number;
  rejected: number;
  waitingList: number;
}

export const useAdminStatistics = (referrals: Referral[]) => {
  const calculateWaitingListStats = (waitingListReferrals: Referral[]) => {
    if (waitingListReferrals.length === 0) {
      return { averageWaitDays: 0, longestWaitDays: 0 };
    }

    const waitDays = waitingListReferrals.map(ref => 
      differenceInDays(new Date(), new Date(ref.created))
    );

    const averageWaitDays = Math.round(
      waitDays.reduce((sum, days) => sum + days, 0) / waitDays.length
    );
    const longestWaitDays = Math.max(...waitDays);

    return { averageWaitDays, longestWaitDays };
  };

  const specialtyStats = useMemo((): SpecialtyStats[] => {
    const specialtyMap = new Map<string, SpecialtyStats>();

    referrals.forEach(referral => {
      const specialty = referral.specialty;
      
      if (!specialtyMap.has(specialty)) {
        specialtyMap.set(specialty, {
          specialty,
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
          longestWaitDays: 0
        });
      }

      const stats = specialtyMap.get(specialty)!;
      stats.total++;

      // Count by status
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

      // Count by triage status
      switch (referral.triageStatus) {
        case 'pre-assessment':
          stats.preAssessment++;
          break;
        case 'assessed':
          stats.assessed++;
          break;
        case 'waiting-list':
          stats.waitingList++;
          break;
        case 'pre-admission-assessment':
          stats.preAdmission++;
          break;
        case 'refer-to-another-specialty':
          stats.referToOther++;
          break;
      }
    });

    // Calculate waiting list stats for each specialty
    specialtyMap.forEach((stats, specialty) => {
      const waitingListReferrals = referrals.filter(
        ref => ref.specialty === specialty && ref.triageStatus === 'waiting-list'
      );
      const waitStats = calculateWaitingListStats(waitingListReferrals);
      stats.averageWaitDays = waitStats.averageWaitDays;
      stats.longestWaitDays = waitStats.longestWaitDays;
    });

    return Array.from(specialtyMap.values()).sort((a, b) => b.total - a.total);
  }, [referrals]);

  const overallStats = useMemo((): OverallStats => {
    const total = referrals.length;
    const new_ = referrals.filter(r => r.status === 'new').length;
    const accepted = referrals.filter(r => r.status === 'accepted').length;
    const rejected = referrals.filter(r => r.status === 'rejected').length;
    const waitingList = referrals.filter(r => r.triageStatus === 'waiting-list').length;

    return { total, new: new_, accepted, rejected, waitingList };
  }, [referrals]);

  return { specialtyStats, overallStats };
};

export type { SpecialtyStats, OverallStats };
