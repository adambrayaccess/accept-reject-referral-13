
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Referral } from '@/types/referral';
import { Badge } from '@/components/ui/badge';

interface TagInsightsDashboardProps {
  referrals: Referral[];
}

const TagInsightsDashboard = ({ referrals }: TagInsightsDashboardProps) => {
  const COLORS = [
    '#007A7A', '#4F46E5', '#059669', '#DC2626', '#EA580C', 
    '#7C3AED', '#0D9488', '#1F2937', '#F59E0B', '#EF4444'
  ];

  // Tag frequency analysis
  const allTags = referrals.flatMap(ref => ref.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tagFrequencyData = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / referrals.length) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 tags

  // Tag combinations analysis
  const tagCombinations = referrals
    .filter(ref => ref.tags && ref.tags.length > 1)
    .map(ref => ref.tags?.sort().join(' + ') || '')
    .reduce((acc, combo) => {
      acc[combo] = (acc[combo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topCombinations = Object.entries(tagCombinations)
    .map(([combo, count]) => ({ combo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Waiting time by tag analysis
  const tagWaitTimes = Object.entries(tagCounts).map(([tag, count]) => {
    const taggedReferrals = referrals.filter(ref => ref.tags?.includes(tag));
    const avgWaitTime = taggedReferrals.length > 0 
      ? Math.round(taggedReferrals.reduce((acc, ref) => acc + (ref.calculatedReferralAge || 0), 0) / taggedReferrals.length)
      : 0;
    
    return {
      tag,
      avgWaitTime,
      count
    };
  }).sort((a, b) => b.avgWaitTime - a.avgWaitTime).slice(0, 8);

  const chartConfig = {
    count: {
      label: "Count",
      color: COLORS[0],
    },
    avgWaitTime: {
      label: "Avg Wait Time",
      color: COLORS[1],
    },
  };

  if (referrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tag Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No tagged patients to analyze
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tag frequency and combinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Frequency Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Common Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={tagFrequencyData}>
                <XAxis 
                  dataKey="tag" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                  tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} patients (${tagFrequencyData.find(d => d.tag === name)?.percentage}%)`, name]}
                  />} 
                />
                <Bar dataKey="count" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tag Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tag Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={tagFrequencyData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ tag, percentage }) => `${tag} (${percentage}%)`}
                  labelLine={false}
                  fontSize={10}
                >
                  {tagFrequencyData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent 
                    nameKey="tag" 
                    formatter={(value, name) => [`${value} patients`, name]}
                  />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tag combinations and wait times */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Tag Combinations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Tag Combinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCombinations.length > 0 ? (
                topCombinations.map((combo, index) => (
                  <div key={combo.combo} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {combo.combo.split(' + ').map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">{combo.count} patients</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No tag combinations found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wait Times by Tag */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Wait Time by Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={tagWaitTimes} layout="horizontal">
                <XAxis type="number" />
                <YAxis 
                  dataKey="tag" 
                  type="category" 
                  width={80} 
                  fontSize={11}
                  tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 12)}...` : value}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [`${value} days`, name]}
                  />} 
                />
                <Bar dataKey="avgWaitTime" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TagInsightsDashboard;
