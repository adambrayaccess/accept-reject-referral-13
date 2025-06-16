
import { Users, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Referral } from '@/types/referral';

interface WaitingListStatisticsBarProps {
  referrals: Referral[];
}

const WaitingListStatisticsBar = ({ referrals }: WaitingListStatisticsBarProps) => {
  // Calculate statistics
  const totalReferrals = referrals.length;
  
  const referralAges = referrals.map(ref => ref.calculatedReferralAge || 0);
  const highestDaysWaiting = referralAges.length > 0 ? Math.max(...referralAges) : 0;
  
  const awaitingAppointment = referrals.filter(ref => 
    ref.triageStatus === 'waiting-list' || ref.status === 'new'
  ).length;
  
  const longestWaitTime = highestDaysWaiting; // Same as highest days waiting for this context

  const statistics = [
    {
      title: 'Total Referrals',
      value: totalReferrals.toString(),
      period: 'Currently in waiting list',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      valueColor: 'text-blue-600'
    },
    {
      title: 'Highest Days Waiting',
      value: highestDaysWaiting.toString(),
      period: 'Maximum wait time',
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      valueColor: 'text-orange-600'
    },
    {
      title: 'Total Awaiting Appointment',
      value: awaitingAppointment.toString(),  
      period: 'Ready for scheduling',
      icon: Calendar,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      valueColor: 'text-green-600'
    },
    {
      title: 'Longest Wait Time',
      value: `${longestWaitTime} days`,
      period: 'Maximum duration',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      valueColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border border-gray-200 shadow-none bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <span className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</span>
              </div>

              <div className="text-xs text-gray-500">
                <span>{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WaitingListStatisticsBar;
