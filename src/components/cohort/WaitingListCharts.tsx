
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Referral } from '@/types/referral';
import { differenceInDays } from 'date-fns';

interface WaitingListChartsProps {
  referrals: Referral[];
}

const WaitingListCharts = ({ referrals }: WaitingListChartsProps) => {
  // Gender distribution (inclusive)
  const genderData = referrals.reduce((acc, ref) => {
    const gender = ref.patient.gender || 'Not specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderChartData = Object.entries(genderData).map(([gender, count]) => ({
    gender: gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other/Not specified',
    count
  }));

  // Age range groups
  const ageRanges = {
    '0-17': 0,
    '18-30': 0,
    '31-50': 0,
    '51-70': 0,
    '71+': 0
  };

  referrals.forEach(ref => {
    const birthDate = new Date(ref.patient.birthDate);
    const today = new Date();
    const ageInYears = Math.floor(differenceInDays(today, birthDate) / 365);
    
    if (ageInYears <= 17) ageRanges['0-17']++;
    else if (ageInYears <= 30) ageRanges['18-30']++;
    else if (ageInYears <= 50) ageRanges['31-50']++;
    else if (ageInYears <= 70) ageRanges['51-70']++;
    else ageRanges['71+']++;
  });

  const ageChartData = Object.entries(ageRanges).map(([range, count]) => ({
    ageRange: range,
    count
  }));

  // Waiting time blocks
  const waitingTimeBlocks = {
    '0-7 days': 0,
    '8-30 days': 0,
    '31-60 days': 0,
    '61-90 days': 0,
    '91+ days': 0
  };

  referrals.forEach(ref => {
    const waitingDays = ref.calculatedReferralAge || 0;
    
    if (waitingDays <= 7) waitingTimeBlocks['0-7 days']++;
    else if (waitingDays <= 30) waitingTimeBlocks['8-30 days']++;
    else if (waitingDays <= 60) waitingTimeBlocks['31-60 days']++;
    else if (waitingDays <= 90) waitingTimeBlocks['61-90 days']++;
    else waitingTimeBlocks['91+ days']++;
  });

  const waitingTimeChartData = Object.entries(waitingTimeBlocks).map(([timeBlock, count]) => ({
    timeBlock,
    count
  }));

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  if (referrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waiting List Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available for charts
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <PieChart>
              <Pie
                data={genderChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {genderChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="gender" />}
              />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {genderChartData.map((entry, index) => (
              <div key={entry.gender} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.gender}</span>
                </div>
                <span className="font-medium">{entry.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Range Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={ageChartData}>
              <XAxis dataKey="ageRange" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Waiting Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Waiting Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={waitingTimeChartData}>
              <XAxis 
                dataKey="timeBlock" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingListCharts;
