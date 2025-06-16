
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatisticsBarProps {
  onRefresh?: () => void;
}

const StatisticsBar = ({ onRefresh }: StatisticsBarProps) => {
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

      <div className="w-full">
        <img 
          src="/lovable-uploads/5f99e457-a6a8-4b8d-83eb-f05d6f1fab5d.png" 
          alt="Statistics Dashboard" 
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default StatisticsBar;
