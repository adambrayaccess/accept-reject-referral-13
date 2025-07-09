import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/types/referral';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { TrendingUp, TrendingDown, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  referrals: Referral[];
}

const PerformanceMetrics = ({ referrals }: PerformanceMetricsProps) => {
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    // Current period (last 30 days)
    const currentReferrals = referrals.filter(r => new Date(r.created) >= thirtyDaysAgo);
    // Previous period (31-60 days ago)
    const previousReferrals = referrals.filter(r => {
      const created = new Date(r.created);
      return created >= sixtyDaysAgo && created < thirtyDaysAgo;
    });
    
    // Calculate metrics
    const currentTotal = currentReferrals.length;
    const previousTotal = previousReferrals.length;
    const growthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100) : 0;
    
    // Processing time metrics
    const processedReferrals = referrals.filter(r => r.status !== 'new');
    const avgProcessingTime = processedReferrals.length > 0 
      ? processedReferrals.reduce((sum, r) => {
          return sum + differenceInDays(new Date(), new Date(r.created));
        }, 0) / processedReferrals.length
      : 0;
    
    // Acceptance rate
    const acceptedCount = referrals.filter(r => r.status === 'accepted').length;
    const acceptanceRate = referrals.length > 0 ? (acceptedCount / referrals.length * 100) : 0;
    
    // Waiting list efficiency
    const waitingListCount = referrals.filter(r => r.triageStatus === 'waiting-list').length;
    const waitingListRate = referrals.length > 0 ? (waitingListCount / referrals.length * 100) : 0;
    
    // RTT compliance (assuming 18 weeks = 126 days target)
    const rttCompliant = referrals.filter(r => {
      if (r.status === 'discharged') return true; // Completed within timeframe
      const daysSinceCreated = differenceInDays(new Date(), new Date(r.created));
      return daysSinceCreated <= 126;
    }).length;
    const rttComplianceRate = referrals.length > 0 ? (rttCompliant / referrals.length * 100) : 0;
    
    // Urgent referral processing
    const urgentReferrals = referrals.filter(r => r.priority === 'urgent' || r.priority === 'emergency');
    const urgentProcessed = urgentReferrals.filter(r => r.status !== 'new').length;
    const urgentProcessingRate = urgentReferrals.length > 0 ? (urgentProcessed / urgentReferrals.length * 100) : 0;
    
    return {
      currentTotal,
      previousTotal,
      growthRate,
      avgProcessingTime,
      acceptanceRate,
      waitingListRate,
      rttComplianceRate,
      urgentProcessingRate,
      urgentCount: urgentReferrals.length
    };
  }, [referrals]);

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (rate < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <div className="h-4 w-4" />;
  };

  const getPerformanceBadge = (rate: number, threshold: number) => {
    if (rate >= threshold) return <Badge className="bg-success text-success-foreground">Good</Badge>;
    if (rate >= threshold * 0.7) return <Badge className="bg-warning text-warning-foreground">Fair</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">Poor</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Volume Metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Volume Trends (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{metrics.currentTotal}</div>
              <div className="text-sm text-muted-foreground">Current period</div>
            </div>
            <div className="flex items-center gap-2">
              {getGrowthIcon(metrics.growthRate)}
              <span className={`text-sm font-medium ${
                metrics.growthRate > 0 ? 'text-success' : 
                metrics.growthRate < 0 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {Math.abs(metrics.growthRate).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Previous: {metrics.previousTotal} referrals
          </div>
        </CardContent>
      </Card>

      {/* Processing Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg Processing Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.avgProcessingTime.toFixed(1)} days</div>
          <div className="mt-2">
            {getPerformanceBadge(14 - metrics.avgProcessingTime, 7)} {/* Good if under 7 days */}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Target: &lt;7 days
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Acceptance Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.acceptanceRate.toFixed(1)}%</div>
          <Progress value={metrics.acceptanceRate} className="mt-2" />
          <div className="mt-2">
            {getPerformanceBadge(metrics.acceptanceRate, 80)}
          </div>
        </CardContent>
      </Card>

      {/* RTT Compliance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            RTT Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.rttComplianceRate.toFixed(1)}%</div>
          <Progress value={metrics.rttComplianceRate} className="mt-2" />
          <div className="mt-2">
            {getPerformanceBadge(metrics.rttComplianceRate, 92)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Target: &gt;92% within 18 weeks
          </div>
        </CardContent>
      </Card>

      {/* Urgent Processing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Urgent Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.urgentProcessingRate.toFixed(1)}%</div>
          <Progress value={metrics.urgentProcessingRate} className="mt-2" />
          <div className="mt-2">
            {getPerformanceBadge(metrics.urgentProcessingRate, 95)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {metrics.urgentCount} urgent referrals
          </div>
        </CardContent>
      </Card>

      {/* Waiting List Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Waiting List Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.waitingListRate.toFixed(1)}%</div>
          <Progress value={metrics.waitingListRate} className="mt-2" />
          <div className="mt-2">
            {/* Lower is better for waiting list rate */}
            {metrics.waitingListRate <= 20 ? 
              <Badge className="bg-success text-success-foreground">Good</Badge> :
              metrics.waitingListRate <= 40 ? 
              <Badge className="bg-warning text-warning-foreground">Fair</Badge> :
              <Badge className="bg-destructive text-destructive-foreground">High</Badge>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;