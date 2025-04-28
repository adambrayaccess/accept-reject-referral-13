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

interface HeartRateChartProps {
  vitalSigns: VitalSign[];
}

const HeartRateChart = ({ vitalSigns }: HeartRateChartProps) => {
  return (
    <div className="h-[250px]">
      <ChartContainer
        config={{
          heartRate: { color: '#ec4899' }
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
            domain={[40, 160]}
            ticks={[40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]}
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
                      <div className="font-medium">Heart Rate:</div>
                      <div>{data.heartRate} bpm</div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label="Tachycardia" />
          <ReferenceLine y={60} stroke="#0ea5e9" strokeDasharray="3 3" label="Bradycardia" />
          <Line
            type="monotone"
            dataKey="heartRate"
            name="Heart Rate (bpm)"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            isAnimationActive={false}
          />
          <Legend />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default HeartRateChart;
