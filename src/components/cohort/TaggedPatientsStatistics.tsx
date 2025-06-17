
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Referral } from '@/types/referral';
import { Tag, TrendingUp, Clock, AlertTriangle, Users, Calendar } from 'lucide-react';

interface TaggedPatientsStatisticsProps {
  referrals: Referral[];
}

const TaggedPatientsStatistics = ({ referrals }: TaggedPatientsStatisticsProps) => {
  // Calculate tag-specific metrics
  const totalTaggedReferrals = referrals.length;
  
  // Get all unique tags
  const allTags = referrals.flatMap(ref => ref.tags || []);
  const uniqueTags = [...new Set(allTags)].length;
  
  // Most common tags
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonTag = Object.entries(tagCounts).reduce((a, b) => 
    tagCounts[a[0]] > tagCounts[b[0]] ? a : b, ['', 0]
  )[0] || 'None';
  
  // Critical tags analysis
  const criticalTags = ['urgent', 'emergency', 'two-week-wait', 'cancer-pathway', 'high-risk'];
  const criticalTaggedReferrals = referrals.filter(ref => 
    ref.tags?.some(tag => criticalTags.includes(tag.toLowerCase()))
  ).length;
  
  // Average waiting time for tagged patients
  const avgWaitTime = totalTaggedReferrals > 0 
    ? Math.round(referrals.reduce((acc, ref) => acc + (ref.calculatedReferralAge || 0), 0) / totalTaggedReferrals)
    : 0;
  
  // Multiple tags analysis
  const multipleTagsCount = referrals.filter(ref => (ref.tags?.length || 0) > 1).length;
  
  // Recent tagging activity (last 7 days)
  const recentlyTagged = referrals.filter(ref => {
    const createdDate = new Date(ref.created);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo && ref.tags && ref.tags.length > 0;
  }).length;

  const stats = [
    {
      title: 'Tagged Patients',
      value: totalTaggedReferrals.toString(),
      change: recentlyTagged > 0 ? `+${recentlyTagged} this week` : 'No new tags',
      icon: Tag,
      description: 'Patients with assigned tags',
      color: 'text-blue-600'
    },
    {
      title: 'Unique Tags',
      value: uniqueTags.toString(),
      change: mostCommonTag ? `"${mostCommonTag}" most used` : 'No tags',
      icon: Users,
      description: 'Different tag categories',
      color: 'text-green-600'
    },
    {
      title: 'Critical Tags',
      value: criticalTaggedReferrals.toString(),
      change: `${Math.round((criticalTaggedReferrals / totalTaggedReferrals) * 100)}% of tagged`,
      icon: AlertTriangle,
      description: 'High priority tagged patients',
      color: 'text-red-600'
    },
    {
      title: 'Multiple Tags',
      value: multipleTagsCount.toString(),
      change: `${Math.round((multipleTagsCount / totalTaggedReferrals) * 100)}% of tagged`,
      icon: TrendingUp,
      description: 'Patients with multiple tags',
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Wait Time',
      value: `${avgWaitTime} days`,
      change: avgWaitTime > 60 ? 'Above target' : 'Within target',
      icon: Clock,
      description: 'For tagged patients',
      color: 'text-orange-600'
    },
    {
      title: 'Recent Activity',
      value: recentlyTagged.toString(),
      change: 'Last 7 days',
      icon: Calendar,
      description: 'Newly tagged patients',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-medium text-muted-foreground">
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaggedPatientsStatistics;
