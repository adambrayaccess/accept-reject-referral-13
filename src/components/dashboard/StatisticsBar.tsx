
import { RefreshCw, Info } from 'lucide-react';
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
      title: 'New referrals',
      value: '56',
      period: 'Last 7 days',
      pagination: '1/3'
    },
    {
      title: 'Urgent referrals',
      value: '09',
      period: 'Last 7 days',
      pagination: '1/3'
    },
    {
      title: 'Waiting to be reviewed',
      value: '19',
      period: 'Last 7 days',
      pagination: '1/3'
    },
    {
      title: 'Ready for Discharge',
      value: '28',
      period: 'Last 7 days',
      pagination: '1/3'
    },
    {
      title: 'No. of Appointments',
      value: '12',
      period: 'Next 7 days',
      pagination: '1/3'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Today's statistics</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statistics.map((stat, index) => (
          <Card key={index} className="border-0 shadow-none bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
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
              
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 border-2 border-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                </div>
                <span className="text-3xl font-bold text-teal-600">{stat.value}</span>
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
        ))}
      </div>
    </div>
  );
};

export default StatisticsBar;
