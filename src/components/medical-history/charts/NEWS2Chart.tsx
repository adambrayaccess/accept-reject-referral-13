
import { useState } from 'react';
import { VitalSign } from '@/types/referral';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine,
  Legend,
  Dot
} from 'recharts';
import { formatDate, formatDetailDate } from '../utils/dateUtils';
import { NEWS2Details } from './NEWS2Details';
import { ChartBarIcon } from 'lucide-react';

interface NEWS2ChartProps {
  vitalSigns: VitalSign[];
}

const NEWS2Chart = ({ vitalSigns }: NEWS2ChartProps) => {
  const [selectedVitalSign, setSelectedVitalSign] = useState<VitalSign | null>(null);

  // Sort vital signs by timestamp
  const sortedVitalSigns = [...vitalSigns].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const handleDotClick = (data: any) => {
    setSelectedVitalSign(data.payload);
  };

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isSelected = selectedVitalSign?.timestamp === payload.timestamp;
    
    return (
      <Dot 
        cx={cx} 
        cy={cy} 
        r={isSelected ? 6 : 4} 
        fill={isSelected ? "#ef4444" : "#6366f1"}
        stroke={isSelected ? "#fff" : "none"}
        strokeWidth={2}
        style={{ cursor: 'pointer' }}
        onClick={() => handleDotClick(props)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="h-[250px]">
        <ChartContainer
          config={{
            low: { color: '#22c55e' },
            medium: { color: '#f59e0b' },
            high: { color: '#ef4444' }
          }}
        >
          <LineChart
            data={sortedVitalSigns}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 15]}
              allowDecimals={false}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as VitalSign;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Date:</div>
                        <div>{formatDetailDate(data.timestamp)}</div>
                        <div className="font-medium">NEWS2 Score:</div>
                        <div>{data.news2}</div>
                        <div className="col-span-2 text-xs text-muted-foreground">
                          Click point to view details
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" label="Medium" />
            <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" label="High" />
            <Line
              type="monotone"
              dataKey="news2"
              name="NEWS2 Score"
              stroke="#6366f1"
              strokeWidth={2}
              dot={renderDot}
              activeDot={{ r: 6, strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Legend />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <ChartBarIcon className="h-4 w-4" />
          Observation Details
        </h3>
        {selectedVitalSign && (
          <div className="text-xs text-muted-foreground">
            Selected: {formatDetailDate(selectedVitalSign.timestamp)}
          </div>
        )}
      </div>
      
      <NEWS2Details 
        vitalSigns={
          selectedVitalSign 
            ? [selectedVitalSign] 
            : sortedVitalSigns.slice(-5).reverse()
        } 
        highlightRow={selectedVitalSign?.timestamp}
      />
    </div>
  );
};

export default NEWS2Chart;
