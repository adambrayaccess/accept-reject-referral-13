import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Referral } from '@/types/referral';
import { useMemo } from 'react';

interface ReferralSourceChartProps {
  referrals: Referral[];
}

const ReferralSourceChart = ({ referrals }: ReferralSourceChartProps) => {
  const sourceData = useMemo(() => {
    const sourceMap = new Map<string, number>();
    
    referrals.forEach(referral => {
      // Use referralSource or fall back to referralType or categorize by organization
      const source = referral.referralSource || 
                    referral.referralType || 
                    (referral.referrer?.organization ? 'GP Practice' : 'Other');
      
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    
    return Array.from(sourceMap.entries())
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / referrals.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [referrals]);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
    'hsl(var(--purple))',
    'hsl(var(--accent))',
  ];

  const chartConfig = sourceData.reduce((config, item, index) => {
    config[item.source] = {
      label: item.source,
      color: COLORS[index % COLORS.length]
    };
    return config;
  }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrals by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
              label={({ source, percentage }) => `${source}: ${percentage}%`}
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: any, name: any, props: any) => [
                `${value} referrals (${props.payload.percentage}%)`,
                props.payload.source
              ]}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReferralSourceChart;