import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Referral } from '@/types/referral';
import { useMemo } from 'react';

interface SpecialtyVolumeChartProps {
  referrals: Referral[];
}

const SpecialtyVolumeChart = ({ referrals }: SpecialtyVolumeChartProps) => {
  const volumeData = useMemo(() => {
    const specialtyMap = new Map<string, { 
      total: number; 
      thisMonth: number; 
      lastMonth: number; 
    }>();
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    referrals.forEach(referral => {
      const specialty = referral.specialty;
      const createdDate = new Date(referral.created);
      
      if (!specialtyMap.has(specialty)) {
        specialtyMap.set(specialty, { total: 0, thisMonth: 0, lastMonth: 0 });
      }
      
      const stats = specialtyMap.get(specialty)!;
      stats.total++;
      
      if (createdDate >= thisMonthStart) {
        stats.thisMonth++;
      } else if (createdDate >= lastMonthStart && createdDate <= lastMonthEnd) {
        stats.lastMonth++;
      }
    });
    
    return Array.from(specialtyMap.entries())
      .map(([specialty, data]) => ({
        specialty: specialty.length > 15 ? specialty.substring(0, 15) + '...' : specialty,
        fullSpecialty: specialty,
        thisMonth: data.thisMonth,
        lastMonth: data.lastMonth,
        total: data.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 specialties
  }, [referrals]);

  const chartConfig = {
    thisMonth: {
      label: 'This Month',
      color: 'hsl(var(--primary))'
    },
    lastMonth: {
      label: 'Last Month',
      color: 'hsl(var(--secondary))'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Volume by Specialty (Monthly Comparison)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <BarChart
            data={volumeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="specialty" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: any, name: any, props: any) => [
                `${value} referrals`,
                name === 'thisMonth' ? 'This Month' : 'Last Month'
              ]}
              labelFormatter={(label: any, payload: any) => 
                payload?.[0]?.payload?.fullSpecialty || label
              }
            />
            <Legend />
            <Bar 
              dataKey="thisMonth" 
              fill="var(--color-thisMonth)" 
              name="This Month"
            />
            <Bar 
              dataKey="lastMonth" 
              fill="var(--color-lastMonth)" 
              name="Last Month"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpecialtyVolumeChart;