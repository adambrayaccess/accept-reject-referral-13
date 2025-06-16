
import { RefreshCw, Info, Users, AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatisticsBarProps {
  onRefresh?: () => void;
}

const StatisticsBar = ({ onRefresh }: StatisticsBarProps) => {
  // Mock data - in a real app this would come from props or a hook
  const statistics = [
    {
      title: 'New Referrals',
      value: '56',
      period: 'Last 7 days',
      pagination: '1/3',
      icon: Users,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
      valueColor: 'text-teal-600'
    },
    {
      title: 'Urgent Referrals',
      value: '09',
      period: 'Last 7 days',
      pagination: '1/3',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      valueColor: 'text-red-600'
    },
    {
      title: 'Waiting To Be Reviewed',
      value: '19',
      period: 'Last 7 days',
      pagination: '1/3',
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      valueColor: 'text-purple-600'
    },
    {
      title: 'Ready For Discharge',
      value: '28',
      period: 'Last 7 days',
      pagination: '1/3',
      icon: CheckCircle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      valueColor: 'text-orange-600'
    },
    {
      title: 'No. Of Appointments',
      value: '12',
      period: 'Next 7 days',
      pagination: '1/3',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      valueColor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Today's Statistics</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
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
    </div>
  );
};

export default StatisticsBar;
