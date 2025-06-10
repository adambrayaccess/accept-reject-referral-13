
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Referral } from '@/types/referral';
import { subDays, format, eachDayOfInterval } from 'date-fns';

interface ReferralTrendsChartProps {
  referrals: Referral[];
}

const ReferralTrendsChart = ({ referrals }: ReferralTrendsChartProps) => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // Generate data for the last 30 days
  const dateRange = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
  
  const chartData = dateRange.map(date => {
    // Count referrals created on this date
    const referralsOnDate = referrals.filter(ref => {
      const createdDate = new Date(ref.created);
      return format(createdDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }).length;

    // Count cumulative referrals up to this date
    const cumulativeReferrals = referrals.filter(ref => {
      const createdDate = new Date(ref.created);
      return createdDate <= date;
    }).length;

    return {
      date: format(date, 'MMM dd'),
      fullDate: format(date, 'yyyy-MM-dd'),
      newReferrals: referralsOnDate,
      totalReferrals: cumulativeReferrals
    };
  });

  const chartConfig = {
    newReferrals: {
      label: "New Referrals",
      color: "hsl(var(--chart-1))",
    },
    totalReferrals: {
      label: "Total Referrals",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Trends (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value, payload) => {
                const data = payload?.[0]?.payload;
                return data ? `Date: ${data.fullDate}` : value;
              }}
            />
            <Line
              type="monotone"
              dataKey="newReferrals"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="New Referrals"
            />
            <Line
              type="monotone"
              dataKey="totalReferrals"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Total Referrals"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReferralTrendsChart;
