
import { VitalSign } from '@/types/referral';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine,
  Legend
} from 'recharts';
import { formatDate, formatDetailDate } from '../utils/dateUtils';

interface TemperatureChartProps {
  vitalSigns: VitalSign[];
}

const TemperatureChart = ({ vitalSigns }: TemperatureChartProps) => {
  return (
    <ChartContainer
      config={{
        temperature: { color: '#ef4444' }
      }}
    >
      <LineChart
        data={vitalSigns}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatDate}
          minTickGap={30}
        />
        <YAxis 
          domain={[35, 40]} 
          ticks={[35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40]}
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
                    <div className="font-medium">Temperature:</div>
                    <div>{data.temperature}°C</div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <ReferenceLine y={37.8} stroke="#ef4444" strokeDasharray="3 3" label="Fever" />
        <Line
          type="monotone"
          dataKey="temperature"
          name="Temperature (°C)"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <Legend />
      </LineChart>
    </ChartContainer>
  );
};

export default TemperatureChart;
