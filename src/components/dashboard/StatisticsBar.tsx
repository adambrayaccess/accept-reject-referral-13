
import { Info, Users, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Referral } from '@/types/referral';
import { calculateDashboardStatistics } from '@/services/dashboard/dashboardStatisticsService';

interface StatisticsBarProps {
  referrals: Referral[];
}

const StatisticsBar = ({ referrals }: StatisticsBarProps) => {
  const statistics = calculateDashboardStatistics(referrals);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      case 'Clock': return Clock;
      case 'CheckCircle': return CheckCircle;
      case 'FileText': return FileText;
      default: return Users;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{stat.period}</span>
                <div className="flex items-center gap-1">
                  <button className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <span className="text-xs">‹</span>
                  </button>
                  <span className="text-xs">{stat.pagination}</span>
                  <button className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <span className="text-xs">›</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsBar;
