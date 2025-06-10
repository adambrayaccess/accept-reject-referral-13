
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
          {currentSpecialty ? `${currentSpecialty} Breakdown` : 'Specialty Breakdown'}
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
                      Avg wait: <span className="font-medium text-orange-600">{stats.averageWaitDays}d</span>
                      {' '} | Longest: <span className="font-medium text-red-600">{stats.longestWaitDays}d</span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {stats.total} total
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm text-muted-foreground">New</div>
                  <div className="text-xl font-bold text-blue-600">{stats.new}</div>
                </div>
                
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-sm text-muted-foreground">Accepted</div>
                  <div className="text-xl font-bold text-green-600">{stats.accepted}</div>
                </div>
                
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-sm text-muted-foreground">Rejected</div>
                  <div className="text-xl font-bold text-red-600">{stats.rejected}</div>
                </div>
                
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="text-sm text-muted-foreground">Pre-Assessment</div>
                  <div className="text-xl font-bold text-purple-600">{stats.preAssessment}</div>
                </div>
                
                <div className="text-center p-2 bg-indigo-50 rounded">
                  <div className="text-sm text-muted-foreground">Assessed</div>
                  <div className="text-xl font-bold text-indigo-600">{stats.assessed}</div>
                </div>
                
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="text-sm text-muted-foreground">Waiting List</div>
                  <div className="text-xl font-bold text-orange-600">{stats.waitingList}</div>
                </div>
                
                <div className="text-center p-2 bg-teal-50 rounded">
                  <div className="text-sm text-muted-foreground">Pre-Admission</div>
                  <div className="text-xl font-bold text-teal-600">{stats.preAdmission}</div>
                </div>
                
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-sm text-muted-foreground">Refer Other</div>
                  <div className="text-xl font-bold text-yellow-600">{stats.referToOther}</div>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-xl font-bold text-gray-600">
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
