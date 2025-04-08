
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

interface RespirationChartProps {
  vitalSigns: VitalSign[];
}

const RespirationChart = ({ vitalSigns }: RespirationChartProps) => {
  return (
    <ChartContainer
      config={{
        respiration: { color: '#0ea5e9' }
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
          domain={[8, 30]}
          ticks={[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]}
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
                    <div className="font-medium">Respiration:</div>
                    <div>{data.respiration} breaths/min</div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="3 3" label="Elevated" />
        <Line
          type="monotone"
          dataKey="respiration"
          name="Respiration Rate"
          stroke="#0ea5e9"
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

export default RespirationChart;
