
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import { TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';
import { differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface WaitingListDashboardProps {
  referrals: Referral[];
}

const WaitingListDashboard = ({ referrals }: WaitingListDashboardProps) => {
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfLastWeek = new Date(startOfThisWeek.getTime() - 1);
  const startOfLastWeek = startOfWeek(endOfLastWeek, { weekStartsOn: 1 });

  // Total number of referrals
  const totalReferrals = referrals.length;

  // Number of new referrals added since Monday
  const newReferralsSinceMonday = referrals.filter(ref => {
    const createdDate = new Date(ref.created);
    return createdDate >= startOfThisWeek;
  }).length;

  // Referrals processed last week
  const referralsProcessedLastWeek = referrals.filter(ref => {
    const hasAuditLog = ref.auditLog && ref.auditLog.length > 0;
    if (!hasAuditLog) return false;
    
    // Check if any audit entry was from last week
    return ref.auditLog.some(entry => {
      const entryDate = new Date(entry.timestamp);
      return isWithinInterval(entryDate, {
        start: startOfLastWeek,
        end: endOfLastWeek
      }) && (entry.action.includes('status') || entry.action.includes('processed'));
    });
  }).length;

  // Calculate percentage changes (mock data for demo)
  const weeklyGrowth = newReferralsSinceMonday > 0 ? '+12%' : '0%';
  const processingEfficiency = referralsProcessedLastWeek > 0 ? '+8%' : '0%';

  const stats = [
    {
      title: 'Total Referrals',
      value: totalReferrals.toString(),
      change: weeklyGrowth,
      icon: Users,
      description: 'All referrals in waiting list'
    },
    {
      title: 'New This Week',
      value: newReferralsSinceMonday.toString(),
      change: '+5%',
      icon: TrendingUp,
      description: 'Since Monday'
    },
    {
      title: 'Processed Last Week',
      value: referralsProcessedLastWeek.toString(),
      change: processingEfficiency,
      icon: CheckCircle,
      description: 'Completed referrals'
    },
    {
      title: 'Avg. Wait Time',
      value: Math.round(referrals.reduce((acc, ref) => acc + (ref.calculatedReferralAge || 0), 0) / referrals.length || 0).toString() + ' days',
      change: '-3%',
      icon: Calendar,
      description: 'Average waiting period'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className={`${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>
                {stat.change}
              </span>
              <span>from last week</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WaitingListDashboard;
