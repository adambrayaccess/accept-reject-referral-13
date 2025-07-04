
import { useState, useEffect } from 'react';
import { Info, Users, AlertTriangle, Clock, CheckCircle, FileText, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Referral } from '@/types/referral';
import { calculateDashboardStatistics, DashboardStatistic } from '@/services/dashboard/dashboardStatisticsService';

interface StatisticsBarProps {
  referrals: Referral[];
  selectedSpecialties?: string[];
}

const StatisticsBar = ({ referrals, selectedSpecialties = [] }: StatisticsBarProps) => {
  const [statistics, setStatistics] = useState<DashboardStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const stats = await calculateDashboardStatistics(referrals, selectedSpecialties);
        setStatistics(stats);
      } catch (error) {
        console.error('Error calculating dashboard statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [referrals, selectedSpecialties]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      case 'Clock': return Clock;
      case 'CheckCircle': return CheckCircle;
      case 'FileText': return FileText;
      case 'Timer': return Timer;
      default: return Users;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border border-gray-200 shadow-none bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {statistics.map((stat, index) => {
        const IconComponent = getIconComponent(stat.icon);
        return (
          <Card key={index} className="border border-gray-200 shadow-none bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Information about {stat.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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

export default StatisticsBar;
