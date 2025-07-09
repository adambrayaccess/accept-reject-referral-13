import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { Referral } from '@/types/referral';
import { useMemo } from 'react';
import { format, startOfWeek, addWeeks, differenceInWeeks } from 'date-fns';

interface ReferralTrendAnalysisProps {
  referrals: Referral[];
}

const ReferralTrendAnalysis = ({ referrals }: ReferralTrendAnalysisProps) => {
  const trendData = useMemo(() => {
    const now = new Date();
    const weeksAgo = 12;
    const startDate = addWeeks(startOfWeek(now), -weeksAgo);
    
    // Initialize weeks data
    const weeklyData: any[] = [];
    for (let i = 0; i <= weeksAgo; i++) {
      const weekStart = addWeeks(startDate, i);
      weeklyData.push({
        week: format(weekStart, 'MMM dd'),
        weekStart,
        total: 0,
        urgent: 0,
        routine: 0,
        accepted: 0,
        waitingList: 0
      });
    }
    
    // Count referrals by week
    referrals.forEach(referral => {
      const createdDate = new Date(referral.created);
      const weekIndex = differenceInWeeks(startOfWeek(createdDate), startDate);
      
      if (weekIndex >= 0 && weekIndex < weeklyData.length) {
        const weekData = weeklyData[weekIndex];
        weekData.total++;
        
        if (referral.priority === 'urgent' || referral.priority === 'emergency') {
          weekData.urgent++;
        } else {
          weekData.routine++;
        }
        
        if (referral.status === 'accepted') {
          weekData.accepted++;
        }
        
        if (referral.triageStatus === 'waiting-list') {
          weekData.waitingList++;
        }
      }
    });
    
    return weeklyData;
  }, [referrals]);

  const chartConfig = {
    total: {
      label: 'Total Referrals',
      color: 'hsl(var(--primary))'
    },
    urgent: {
      label: 'Urgent/Emergency',
      color: 'hsl(var(--destructive))'
    },
    accepted: {
      label: 'Accepted',
      color: 'hsl(var(--success))'
    },
    waitingList: {
      label: 'Waiting List',
      color: 'hsl(var(--warning))'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>12-Week Referral Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 11 }}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="var(--color-total)" 
              strokeWidth={3}
              name="Total Referrals"
            />
            <Line 
              type="monotone" 
              dataKey="urgent" 
              stroke="var(--color-urgent)" 
              strokeWidth={2}
              name="Urgent/Emergency"
            />
            <Line 
              type="monotone" 
              dataKey="accepted" 
              stroke="var(--color-accepted)" 
              strokeWidth={2}
              name="Accepted"
            />
            <Line 
              type="monotone" 
              dataKey="waitingList" 
              stroke="var(--color-waitingList)" 
              strokeWidth={2}
              name="Waiting List"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReferralTrendAnalysis;