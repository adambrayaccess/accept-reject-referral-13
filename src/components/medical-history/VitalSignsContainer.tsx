
import { useState } from 'react';
import { VitalSign } from '@/types/referral';
import { NEWS2Details } from './NEWS2Details';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Legend, Dot } from 'recharts';
import { formatDate, formatDetailDate } from './utils/dateUtils';

interface VitalSignsContainerProps {
  vitalSigns: VitalSign[];
}

const VitalSignsContainer = ({ vitalSigns }: VitalSignsContainerProps) => {
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
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="w-full">
        <NEWS2Details 
          vitalSigns={sortedVitalSigns}
          highlightRow={selectedVitalSign?.timestamp}
        />
      </div>

      <div className="w-full">
        <div className="h-[400px]">
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
                ticks={Array.from({length: 16}, (_, i) => i)}
                width={25}
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
              <Legend iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsContainer;
