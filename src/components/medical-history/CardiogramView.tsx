
import { format } from 'date-fns';
import { Cardiogram } from '@/types/referral';
import { ChartContainer } from '@/components/ui/chart';
import { Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  YAxis
} from 'recharts';

interface CardiogramViewProps {
  cardiograms: Cardiogram[];
}

const CardiogramView = ({ cardiograms }: CardiogramViewProps) => {
  if (!cardiograms || cardiograms.length === 0) {
    return (
      <p className="text-muted-foreground">No cardiogram data available for this patient.</p>
    );
  }
  
  return (
    <div className="space-y-6">
      {cardiograms.map((cardiogram, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-medium">
              {format(new Date(cardiogram.timestamp), 'dd MMM yyyy HH:mm')}
            </h3>
          </div>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                ecg: { color: '#ef4444' }
              }}
            >
              <LineChart
                data={cardiogram.data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <div className="text-sm text-muted-foreground">
            {cardiogram.interpretation}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardiogramView;
