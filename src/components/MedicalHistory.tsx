
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Patient, VitalSign, Cardiogram } from '@/types/referral';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface MedicalHistoryProps {
  patient: Patient;
}

const MedicalHistory = ({ patient }: MedicalHistoryProps) => {
  const [selectedVitalType, setSelectedVitalType] = useState<string>('news2');

  // NEWS2 color scale based on severity
  const getNews2Color = (value: number) => {
    if (value <= 4) return '#22c55e'; // green
    if (value <= 6) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  // Format the date for the X axis
  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM');
  };

  if (!patient.medicalHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No medical history available for this patient.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="cardiogram">Cardiogram Data</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
            <div className="flex gap-4 mb-4">
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
                    data={patient.medicalHistory.vitalSigns}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatDate}
                      minTickGap={30}
                    />
                    <YAxis domain={[0, 20]} allowDecimals={false} />
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
                    <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" />
                    <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="news2"
                      name="NEWS2 Score"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
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
                    data={patient.medicalHistory.vitalSigns}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatDate}
                      minTickGap={30}
                    />
                    <YAxis domain={[35, 40]} ticks={[35, 36, 37, 38, 39, 40]} />
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
                    data={patient.medicalHistory.vitalSigns}
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
                    data={patient.medicalHistory.vitalSigns}
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
                    <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="respiration"
                      name="Respiration Rate"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Legend />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cardiogram" className="space-y-4">
            {patient.medicalHistory.cardiograms && patient.medicalHistory.cardiograms.length > 0 ? (
              <div className="space-y-6">
                {patient.medicalHistory.cardiograms.map((cardiogram, index) => (
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
            ) : (
              <p className="text-muted-foreground">No cardiogram data available for this patient.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;
