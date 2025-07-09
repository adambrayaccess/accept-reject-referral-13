import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Referral } from '@/types/referral';
import { useMemo } from 'react';

interface DischargeAnalyticsChartProps {
  referrals: Referral[];
}

const DischargeAnalyticsChart = ({ referrals }: DischargeAnalyticsChartProps) => {
  const dischargeData = useMemo(() => {
    const specialtyMap = new Map<string, { pending: number; confirmed: number }>();
    
    referrals.forEach(referral => {
      const specialty = referral.specialty;
      
      if (!specialtyMap.has(specialty)) {
        specialtyMap.set(specialty, { pending: 0, confirmed: 0 });
      }
      
      const stats = specialtyMap.get(specialty)!;
      
      // Count pending discharges (triage status indicates discharge pending)
      if (referral.triageStatus === 'discharged' && referral.status !== 'discharged') {
        stats.pending++;
      }
      
      // Count confirmed discharges (status is discharged)
      if (referral.status === 'discharged') {
        stats.confirmed++;
      }
    });
    
    return Array.from(specialtyMap.entries())
      .map(([specialty, data]) => ({
        specialty,
        pending: data.pending,
        confirmed: data.confirmed,
        total: data.pending + data.confirmed
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [referrals]);

  const chartConfig = {
    pending: {
      label: 'Pending Discharges',
      color: 'hsl(var(--warning))'
    },
    confirmed: {
      label: 'Confirmed Discharges',
      color: 'hsl(var(--success))'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discharge Analytics by Specialty</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <BarChart
            data={dischargeData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="specialty" 
              width={90}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey="pending" 
              stackId="discharges"
              fill="var(--color-pending)" 
              name="Pending Discharges"
            />
            <Bar 
              dataKey="confirmed" 
              stackId="discharges"
              fill="var(--color-confirmed)" 
              name="Confirmed Discharges"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DischargeAnalyticsChart;