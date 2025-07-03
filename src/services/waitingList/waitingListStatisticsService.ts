import { supabase } from '@/integrations/supabase/client';

export interface WaitingListStatistics {
  totalReferrals: number;
  rttBreaches: number;
  rttHighRisk: number;
  appointmentsScheduled: number;
  awaitingAppointment: number;
  longestWaitDays: number;
  averageWaitDays: number;
  urgentReferrals: number;
  emergencyReferrals: number;
  bySpecialty: Array<{ specialty: string; count: number }>;
}

export const fetchWaitingListStatistics = async (selectedSpecialties: string[] = []): Promise<WaitingListStatistics> => {
  try {
    console.log('Fetching waiting list statistics for specialties:', selectedSpecialties);
    
    // Build base query conditions
    let specialtyCondition = '';
    if (selectedSpecialties.length === 1) {
      specialtyCondition = `AND r.specialty = '${selectedSpecialties[0]}'`;
    } else if (selectedSpecialties.length > 1) {
      const specialtiesList = selectedSpecialties.map(s => `'${s}'`).join(',');
      specialtyCondition = `AND r.specialty IN (${specialtiesList})`;
    }

    // Get total referrals and priority breakdown using direct database queries
    let totalReferrals = 0;
    let urgentReferrals = 0;
    let emergencyReferrals = 0;
    let longestWaitDays = 0;
    let averageWaitDays = 0;

    // Build where clause for specialty filtering
    const whereClause = selectedSpecialties.length > 0 
      ? selectedSpecialties.length === 1 
        ? `AND specialty = '${selectedSpecialties[0]}'`
        : `AND specialty IN (${selectedSpecialties.map(s => `'${s}'`).join(',')})`
      : '';

    // Get referral statistics
    const { data: referralStats } = await supabase
      .from('referrals')
      .select('priority, created_at')
      .eq('triage_status', 'waiting-list')
      .in('specialty', selectedSpecialties.length > 0 ? selectedSpecialties : ['Mental Health', 'Neurology', 'Dermatology', 'Cardiology', 'Gastroenterology', 'Rheumatology', 'Psychiatry']);

    if (referralStats && referralStats.length > 0) {
      totalReferrals = referralStats.length;
      urgentReferrals = referralStats.filter(r => r.priority === 'urgent').length;
      emergencyReferrals = referralStats.filter(r => r.priority === 'emergency').length;
      
      // Calculate wait times
      const waitTimes = referralStats.map(r => {
        const createdDate = new Date(r.created_at);
        const now = new Date();
        return Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      });
      
      longestWaitDays = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;
      averageWaitDays = waitTimes.length > 0 ? Math.ceil(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
    }

    // Get appointment statistics
    let appointmentsScheduled = 0;
    const { data: appointmentData } = await supabase
      .from('appointments')
      .select('status, referral_id')
      .in('status', ['scheduled', 'confirmed']);

    if (appointmentData) {
      // Get referral IDs that are in waiting list and match specialty filter
      const { data: waitingListReferralIds } = await supabase
        .from('referrals')
        .select('id')
        .eq('triage_status', 'waiting-list')
        .in('specialty', selectedSpecialties.length > 0 ? selectedSpecialties : ['Mental Health', 'Neurology', 'Dermatology', 'Cardiology', 'Gastroenterology', 'Rheumatology', 'Psychiatry']);

      const waitingListIds = waitingListReferralIds?.map(r => r.id) || [];
      appointmentsScheduled = appointmentData.filter(apt => 
        waitingListIds.includes(apt.referral_id)
      ).length;
    }

    // Calculate awaiting appointment (total - scheduled)
    const awaitingAppointment = totalReferrals - appointmentsScheduled;

    // Get specialty breakdown
    const { data: specialtyData } = await supabase
      .from('referrals')
      .select('specialty')
      .eq('triage_status', 'waiting-list')
      .in('specialty', selectedSpecialties.length > 0 ? selectedSpecialties : ['Mental Health', 'Neurology', 'Dermatology', 'Cardiology', 'Gastroenterology', 'Rheumatology', 'Psychiatry']);
    
    const bySpecialty = specialtyData ? 
      Object.entries(
        specialtyData.reduce((acc: Record<string, number>, ref) => {
          acc[ref.specialty] = (acc[ref.specialty] || 0) + 1;
          return acc;
        }, {})
      ).map(([specialty, count]) => ({ specialty, count: count as number }))
      .sort((a, b) => b.count - a.count)
      : [];

    // For now, using priority as a proxy for RTT risk since we don't have RTT pathway data
    const rttBreaches = emergencyReferrals; // Emergency referrals likely represent breaches
    const rttHighRisk = urgentReferrals; // Urgent referrals likely represent high risk

    const statistics: WaitingListStatistics = {
      totalReferrals,
      rttBreaches,
      rttHighRisk,
      appointmentsScheduled,
      awaitingAppointment,
      longestWaitDays,
      averageWaitDays,
      urgentReferrals,
      emergencyReferrals,
      bySpecialty
    };

    console.log('Waiting list statistics:', statistics);
    return statistics;
  } catch (error) {
    console.error('Error fetching waiting list statistics:', error);
    
    // Return default statistics on error
    return {
      totalReferrals: 0,
      rttBreaches: 0,
      rttHighRisk: 0,
      appointmentsScheduled: 0,
      awaitingAppointment: 0,
      longestWaitDays: 0,
      averageWaitDays: 0,
      urgentReferrals: 0,
      emergencyReferrals: 0,
      bySpecialty: []
    };
  }
};