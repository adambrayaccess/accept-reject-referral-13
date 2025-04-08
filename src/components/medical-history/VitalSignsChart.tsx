
import { useState } from 'react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine,
  Legend
} from 'recharts';
import { VitalSign } from '@/types/referral';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VitalSignsChartProps {
  vitalSigns: VitalSign[];
}

// Format the date for the X axis
const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd/MM');
  } catch (error) {
    console.error("Invalid date format:", date);
    return "Invalid";
  }
};

const VitalSignsChart = ({ vitalSigns }: VitalSignsChartProps) => {
  const [selectedVitalType, setSelectedVitalType] = useState<string>('news2');

  return (
    <>
      <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
        <TabsList className="bg-muted/50">
          <TabsTrigger 
            value="news2" 
            onClick={() => setSelectedVitalType('news2')}
            className={selectedVitalType === 'news2' ? 'bg-background' : ''}
          >
            NEWS2 Score
          </TabsTrigger>
          <TabsTrigger 
            value="temperature" 
            onClick={() => setSelectedVitalType('temperature')}
            className={selectedVitalType === 'temperature' ? 'bg-background' : ''}
          >
            Temperature
          </TabsTrigger>
          <TabsTrigger 
            value="heartRate" 
            onClick={() => setSelectedVitalType('heartRate')}
            className={selectedVitalType === 'heartRate' ? 'bg-background' : ''}
          >
            Heart Rate
          </TabsTrigger>
          <TabsTrigger 
            value="respiration" 
            onClick={() => setSelectedVitalType('respiration')}
            className={selectedVitalType === 'respiration' ? 'bg-background' : ''}
          >
            Respiration
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="h-[300px] w-full">
        {selectedVitalType === 'news2' && (
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
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as VitalSign;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Date:</div>
                          <div>{format(new Date(data.timestamp), 'dd MMM yyyy HH:mm')}</div>
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
        )}
        
        {selectedVitalType === 'temperature' && (
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
                ticks={[35, 36, 37, 38, 39, 40]}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as VitalSign;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Date:</div>
                          <div>{format(new Date(data.timestamp), 'dd MMM yyyy HH:mm')}</div>
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
        )}
        
        {selectedVitalType === 'heartRate' && (
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
              <YAxis domain={[40, 160]} />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as VitalSign;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Date:</div>
                          <div>{format(new Date(data.timestamp), 'dd MMM yyyy HH:mm')}</div>
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
        )}
        
        {selectedVitalType === 'respiration' && (
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
              <YAxis domain={[8, 30]} />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as VitalSign;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Date:</div>
                          <div>{format(new Date(data.timestamp), 'dd MMM yyyy HH:mm')}</div>
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
        )}
      </div>
    </>
  );
};

export default VitalSignsChart;
