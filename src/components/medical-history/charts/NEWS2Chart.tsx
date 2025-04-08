
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

interface NEWS2ChartProps {
  vitalSigns: VitalSign[];
}

const NEWS2Chart = ({ vitalSigns }: NEWS2ChartProps) => {
  return (
    <ChartContainer
      config={{
        low: { color: '#22c55e' },
        medium: { color: '#f59e0b' },
        high: { color: '#ef4444' }
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
          domain={[0, 20]}
          allowDecimals={false}
          ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
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
        <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" label="Medium" />
        <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" label="High" />
        <Line
          type="monotone"
          dataKey="news2"
          name="NEWS2 Score"
          stroke="#6366f1"
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

export default NEWS2Chart;
