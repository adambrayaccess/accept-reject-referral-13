
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpecialtyStats } from '@/hooks/useAdminStatistics';

interface SpecialtyBreakdownProps {
  specialtyStats: SpecialtyStats[];
  currentSpecialty: string | null;
}

const SpecialtyBreakdown = ({ specialtyStats, currentSpecialty }: SpecialtyBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {currentSpecialty ? `${currentSpecialty} Breakdown` : 'Service Breakdown'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {specialtyStats.map((stats) => (
            <div key={stats.specialty} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">{stats.specialty}</h3>
                <div className="flex items-center gap-3">
                  {stats.waitingList > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Avg wait: <span className="font-medium text-warning">{stats.averageWaitDays}d</span>
                      {' '} | Longest: <span className="font-medium text-destructive">{stats.longestWaitDays}d</span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {stats.total} total
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
                <div className="text-center p-2 bg-waiting-list/10 border border-waiting-list/20 rounded">
                  <div className="text-sm text-muted-foreground">New</div>
                  <div className="text-xl font-bold text-waiting-list">{stats.new}</div>
                </div>
                
                <div className="text-center p-2 bg-success/10 border border-success/20 rounded">
                  <div className="text-sm text-muted-foreground">Accepted</div>
                  <div className="text-xl font-bold text-success">{stats.accepted}</div>
                </div>
                
                <div className="text-center p-2 bg-destructive/10 border border-destructive/20 rounded">
                  <div className="text-sm text-muted-foreground">Rejected</div>
                  <div className="text-xl font-bold text-destructive">{stats.rejected}</div>
                </div>
                
                <div className="text-center p-2 bg-purple/10 border border-purple/20 rounded">
                  <div className="text-sm text-muted-foreground">Pre-Assessment</div>
                  <div className="text-xl font-bold text-purple">{stats.preAssessment}</div>
                </div>
                
                <div className="text-center p-2 bg-primary/10 border border-primary/20 rounded">
                  <div className="text-sm text-muted-foreground">Assessed</div>
                  <div className="text-xl font-bold text-primary">{stats.assessed}</div>
                </div>
                
                <div className="text-center p-2 bg-warning/10 border border-warning/20 rounded">
                  <div className="text-sm text-muted-foreground">Waiting List</div>
                  <div className="text-xl font-bold text-warning">{stats.waitingList}</div>
                </div>
                
                <div className="text-center p-2 bg-secondary border border-secondary rounded">
                  <div className="text-sm text-muted-foreground">Pre-Admission</div>
                  <div className="text-xl font-bold text-secondary-foreground">{stats.preAdmission}</div>
                </div>
                
                <div className="text-center p-2 bg-accent border border-accent rounded">
                  <div className="text-sm text-muted-foreground">Refer Other</div>
                  <div className="text-xl font-bold text-accent-foreground">{stats.referToOther}</div>
                </div>
                
                <div className="text-center p-2 bg-muted border border-border rounded">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-xl font-bold text-muted-foreground">
                    {Math.round((stats.accepted / stats.total) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialtyBreakdown;
