
import { useState, useEffect } from 'react';
import { Users, Clock, Calendar, AlertTriangle, Target, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Referral } from '@/types/referral';
import { fetchWaitingListStatistics, WaitingListStatistics } from '@/services/waitingList/waitingListStatisticsService';

interface WaitingListStatisticsBarProps {
  referrals: Referral[];
  selectedSpecialties?: string[];
}

const WaitingListStatisticsBar = ({ referrals, selectedSpecialties = [] }: WaitingListStatisticsBarProps) => {
  const [statistics, setStatistics] = useState<WaitingListStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchWaitingListStatistics(selectedSpecialties);
        setStatistics(stats);
      } catch (error) {
        console.error('Error loading waiting list statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [selectedSpecialties]);

  if (isLoading || !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-border shadow-none bg-card">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statisticsItems = [
    {
      title: 'Total Referrals',
      value: statistics.totalReferrals.toString(),
      period: 'Currently in waiting list',
      icon: Users,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary'
    },
    {
      title: 'RTT Breaches',
      value: statistics.rttBreaches.toString(),
      period: 'Emergency priority referrals',
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      valueColor: 'text-destructive'
    },
    {
      title: 'High RTT Risk',
      value: statistics.rttHighRisk.toString(),
      period: 'Urgent priority referrals',
      icon: Timer,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning'
    },
    {
      title: 'Appointments Scheduled',
      value: statistics.appointmentsScheduled.toString(),
      period: 'Confirmed or scheduled',
      icon: Calendar,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
      valueColor: 'text-success'
    },
    {
      title: 'Awaiting Appointment',
      value: statistics.awaitingAppointment.toString(),  
      period: 'Ready for scheduling',
      icon: Clock,
      iconColor: 'text-purple',
      iconBg: 'bg-purple/10',
      valueColor: 'text-purple'
    },
    {
      title: 'Longest Wait Time',
      value: `${statistics.longestWaitDays} days`,
      period: 'Maximum duration',
      icon: Target,
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted',
      valueColor: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statisticsItems.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-border shadow-none bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-card-foreground">{stat.title}</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <span className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</span>
              </div>

              <div className="text-xs text-muted-foreground">
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
