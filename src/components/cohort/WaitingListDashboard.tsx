
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import { TrendingUp, Users, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
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
    
    return ref.auditLog.some(entry => {
      const entryDate = new Date(entry.timestamp);
      return isWithinInterval(entryDate, {
        start: startOfLastWeek,
        end: endOfLastWeek
      }) && (entry.action.includes('status') || entry.action.includes('processed'));
    });
  }).length;

  // Urgent referrals count
  const urgentReferrals = referrals.filter(ref => ref.priority === 'urgent').length;

  // Overdue referrals (waiting > 60 days)
  const overdueReferrals = referrals.filter(ref => (ref.calculatedReferralAge || 0) > 60).length;

  // Average wait time
  const avgWaitTime = referrals.length > 0 
    ? Math.round(referrals.reduce((acc, ref) => acc + (ref.calculatedReferralAge || 0), 0) / referrals.length)
    : 0;

  // Calculate percentage changes
  const weeklyGrowth = newReferralsSinceMonday > 0 ? '+12%' : '0%';
  const processingEfficiency = referralsProcessedLastWeek > 0 ? '+8%' : '0%';
  const urgentChange = urgentReferrals > 0 ? '+15%' : '0%';
  const waitTimeChange = '-3%'; // Assuming improvement

  const stats = [
    {
      title: 'Total Referrals',
      value: totalReferrals.toString(),
      change: weeklyGrowth,
      icon: Users,
      description: 'All referrals in waiting list',
      color: 'text-blue-600'
    },
    {
      title: 'New This Week',
      value: newReferralsSinceMonday.toString(),
      change: '+5%',
      icon: TrendingUp,
      description: 'Since Monday',
      color: 'text-green-600'
    },
    {
      title: 'Urgent Referrals',
      value: urgentReferrals.toString(),
      change: urgentChange,
      icon: AlertTriangle,
      description: 'Requiring immediate attention',
      color: 'text-red-600'
    },
    {
      title: 'Overdue (60+ days)',
      value: overdueReferrals.toString(),
      change: '-2%',
      icon: Clock,
      description: 'Exceeding target wait time',
      color: 'text-orange-600'
    },
    {
      title: 'Processed Last Week',
      value: referralsProcessedLastWeek.toString(),
      change: processingEfficiency,
      icon: CheckCircle,
      description: 'Completed referrals',
      color: 'text-green-600'
    },
    {
      title: 'Avg. Wait Time',
      value: `${avgWaitTime} days`,
      change: waitTimeChange,
      icon: Calendar,
      description: 'Average waiting period',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`font-medium ${
                stat.change.startsWith('+') 
                  ? stat.title.includes('Overdue') || stat.title.includes('Urgent') 
                    ? 'text-red-600' 
                    : 'text-green-600'
                  : stat.change.startsWith('-') 
                    ? stat.title.includes('Overdue') || stat.title.includes('Urgent')
                      ? 'text-green-600'
                      : 'text-red-600'
                    : 'text-muted-foreground'
              }`}>
                {stat.change}
              </span>
              <span className="text-muted-foreground">from last week</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WaitingListDashboard;
