
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
    <div className="space-y-2 w-full">
      <div className="h-[180px] w-full">
        <ChartContainer
          config={{
            low: { color: '#22c55e' },
            medium: { color: '#f59e0b' },
            high: { color: '#ef4444' }
          }}
        >
          <LineChart
            data={sortedVitalSigns}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              minTickGap={30}
              scale="time"
              tick={{fontSize: 10}}
            />
            <YAxis 
              domain={[0, 15]}
              allowDecimals={false}
              ticks={[0, 5, 7, 10, 15]}
              width={20}
              tick={{fontSize: 10}}
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
            <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Medium", position: "right", fill: "#f59e0b", fontSize: 10 }} />
            <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "High", position: "right", fill: "#ef4444", fontSize: 10 }} />
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
            <Legend iconSize={10} wrapperStyle={{ fontSize: '10px' }} height={15} />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-medium flex items-center gap-1">
          <ChartBarIcon className="h-3 w-3" />
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
            : sortedVitalSigns.slice(-2).reverse()
        } 
        highlightRow={selectedVitalSign?.timestamp}
      />
    </div>
  );
};

export default NEWS2Chart;
