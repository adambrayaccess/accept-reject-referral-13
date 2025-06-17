
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Referral } from '@/types/referral';
import { differenceInDays, format, startOfMonth, subMonths } from 'date-fns';

interface WaitingListChartsProps {
  referrals: Referral[];
}

const WaitingListCharts = ({ referrals }: WaitingListChartsProps) => {
  // Consistent color palette matching design system
  const COLORS = [
    '#007A7A', // Primary teal
    '#4F46E5', // Indigo
    '#059669', // Emerald
    '#DC2626', // Red
    '#EA580C', // Orange
    '#7C3AED', // Violet
    '#0D9488', // Teal variant
    '#1F2937'  // Gray
  ];

  // Gender distribution with accurate data handling
  const genderData = referrals.reduce((acc, ref) => {
    const gender = ref.patient.gender?.toLowerCase();
    if (gender === 'male') acc.male = (acc.male || 0) + 1;
    else if (gender === 'female') acc.female = (acc.female || 0) + 1;
    else acc.other = (acc.other || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderChartData = [
    { gender: 'Male', count: genderData.male || 0, percentage: Math.round(((genderData.male || 0) / referrals.length) * 100) },
    { gender: 'Female', count: genderData.female || 0, percentage: Math.round(((genderData.female || 0) / referrals.length) * 100) },
    { gender: 'Other/Not specified', count: genderData.other || 0, percentage: Math.round(((genderData.other || 0) / referrals.length) * 100) }
  ].filter(item => item.count > 0);

  // Age distribution with more granular ranges
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
    count,
    percentage: Math.round((count / referrals.length) * 100)
  }));

  // Priority distribution
  const priorityData = referrals.reduce((acc, ref) => {
    const priority = ref.priority || 'routine';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    count,
    percentage: Math.round((count / referrals.length) * 100)
  }));

  // Waiting time distribution with accurate calculations
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
    count,
    percentage: Math.round((count / referrals.length) * 100)
  }));

  // Monthly trends for the last 6 months
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthEnd = startOfMonth(subMonths(new Date(), i - 1));
    
    const monthReferrals = referrals.filter(ref => {
      const createdDate = new Date(ref.created);
      return createdDate >= monthStart && createdDate < monthEnd;
    });

    monthlyTrends.push({
      month: format(monthStart, 'MMM'),
      referrals: monthReferrals.length,
      urgent: monthReferrals.filter(ref => ref.priority === 'urgent').length,
      routine: monthReferrals.filter(ref => ref.priority === 'routine').length
    });
  }

  // Specialty distribution
  const specialtyData = referrals.reduce((acc, ref) => {
    const specialty = ref.specialty || 'Other';
    acc[specialty] = (acc[specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const specialtyChartData = Object.entries(specialtyData)
    .map(([specialty, count]) => ({
      specialty,
      count,
      percentage: Math.round((count / referrals.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 specialties

  const chartConfig = {
    count: {
      label: "Count",
      color: COLORS[0],
    },
    referrals: {
      label: "Referrals",
      color: COLORS[0],
    },
    urgent: {
      label: "Urgent",
      color: COLORS[3],
    },
    routine: {
      label: "Routine",
      color: COLORS[2],
    },
  };

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
    <div className="space-y-6">
      {/* First row - Key metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Gender Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[140px] w-full">
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent 
                    nameKey="gender" 
                    formatter={(value, name) => [`${value} (${genderChartData.find(d => d.gender === name)?.percentage}%)`, name]}
                  />}
                />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 space-y-1">
              {genderChartData.map((entry, index) => (
                <div key={entry.gender} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{entry.gender}</span>
                  </div>
                  <span className="font-medium">{entry.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[140px] w-full">
              <BarChart data={priorityChartData} layout="horizontal">
                <XAxis type="number" hide />
                <YAxis dataKey="priority" type="category" width={50} fontSize={10} />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} (${priorityChartData.find(d => d.priority === name)?.percentage}%)`, name]}
                  />} 
                />
                <Bar dataKey="count" fill={COLORS[0]} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="mt-2 text-xs text-muted-foreground">
              Urgent: {priorityData.urgent || 0} | Routine: {priorityData.routine || 0}
            </div>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[140px] w-full">
              <BarChart data={ageChartData}>
                <XAxis dataKey="ageRange" fontSize={10} />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} patients`, `${name} years`]}
                  />} 
                />
                <Bar dataKey="count" fill={COLORS[1]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Waiting Time Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Waiting Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[140px] w-full">
              <BarChart data={waitingTimeChartData}>
                <XAxis 
                  dataKey="timeBlock" 
                  angle={-45}
                  textAnchor="end"
                  height={40}
                  fontSize={9}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} referrals`, name]}
                  />} 
                />
                <Bar dataKey="count" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second row - Trends and specialty breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referral Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={monthlyTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="referrals" 
                  stroke={COLORS[0]} 
                  strokeWidth={3}
                  dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="urgent" 
                  stroke={COLORS[3]} 
                  strokeWidth={2}
                  dot={{ fill: COLORS[3], strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Specialty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={specialtyChartData} layout="horizontal">
                <XAxis type="number" />
                <YAxis 
                  dataKey="specialty" 
                  type="category" 
                  width={80} 
                  fontSize={11}
                  tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} referrals (${specialtyChartData.find(d => d.specialty === name)?.percentage}%)`, name]}
                  />} 
                />
                <Bar dataKey="count" fill={COLORS[4]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaitingListCharts;
