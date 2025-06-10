import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Users, FileText, Clock, ArrowLeft } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import SpecialtySelector from '@/components/SpecialtySelector';

interface SpecialtyStats {
  specialty: string;
  total: number;
  new: number;
  accepted: number;
  rejected: number;
  preAssessment: number;
  assessed: number;
  waitingList: number;
  preAdmission: number;
  referToOther: number;
  averageWaitDays: number;
  longestWaitDays: number;
}

const AdminPage = () => {
  const [currentSpecialty, setCurrentSpecialty] = useState<string | null>(null);
  const { referrals, isLoading, handleRefresh } = useDashboardData(currentSpecialty);
  const { toast } = useToast();
  const navigate = useNavigate();

  const specialties = [
    'Cardiology',
    'Dermatology', 
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Psychiatry',
    'Pulmonology',
    'Rheumatology',
    'Mental Health'
  ];

  useEffect(() => {
    // Check if specialty is selected
    const storedSpecialty = localStorage.getItem('selectedSpecialty');
    if (storedSpecialty) {
      setCurrentSpecialty(storedSpecialty);
    }
  }, []);

  const handleSpecialtySelect = (specialty: string) => {
    setCurrentSpecialty(specialty);
    localStorage.setItem('selectedSpecialty', specialty);
  };

  const handleReturnToSpecialtySelection = () => {
    navigate('/select-specialty');
  };

  const calculateWaitingListStats = (waitingListReferrals: Referral[]) => {
    if (waitingListReferrals.length === 0) {
      return { averageWaitDays: 0, longestWaitDays: 0 };
    }

    const waitDays = waitingListReferrals.map(ref => 
      differenceInDays(new Date(), new Date(ref.created))
    );

    const averageWaitDays = Math.round(
      waitDays.reduce((sum, days) => sum + days, 0) / waitDays.length
    );
    const longestWaitDays = Math.max(...waitDays);

    return { averageWaitDays, longestWaitDays };
  };

  const calculateSpecialtyStats = (): SpecialtyStats[] => {
    const specialtyMap = new Map<string, SpecialtyStats>();

    referrals.forEach(referral => {
      const specialty = referral.specialty;
      
      if (!specialtyMap.has(specialty)) {
        specialtyMap.set(specialty, {
          specialty,
          total: 0,
          new: 0,
          accepted: 0,
          rejected: 0,
          preAssessment: 0,
          assessed: 0,
          waitingList: 0,
          preAdmission: 0,
          referToOther: 0,
          averageWaitDays: 0,
          longestWaitDays: 0
        });
      }

      const stats = specialtyMap.get(specialty)!;
      stats.total++;

      // Count by status
      switch (referral.status) {
        case 'new':
          stats.new++;
          break;
        case 'accepted':
          stats.accepted++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
      }

      // Count by triage status
      switch (referral.triageStatus) {
        case 'pre-assessment':
          stats.preAssessment++;
          break;
        case 'assessed':
          stats.assessed++;
          break;
        case 'waiting-list':
          stats.waitingList++;
          break;
        case 'pre-admission-assessment':
          stats.preAdmission++;
          break;
        case 'refer-to-another-specialty':
          stats.referToOther++;
          break;
      }
    });

    // Calculate waiting list stats for each specialty
    specialtyMap.forEach((stats, specialty) => {
      const waitingListReferrals = referrals.filter(
        ref => ref.specialty === specialty && ref.triageStatus === 'waiting-list'
      );
      const waitStats = calculateWaitingListStats(waitingListReferrals);
      stats.averageWaitDays = waitStats.averageWaitDays;
      stats.longestWaitDays = waitStats.longestWaitDays;
    });

    return Array.from(specialtyMap.values()).sort((a, b) => b.total - a.total);
  };

  const getOverallStats = () => {
    const total = referrals.length;
    const new_ = referrals.filter(r => r.status === 'new').length;
    const accepted = referrals.filter(r => r.status === 'accepted').length;
    const rejected = referrals.filter(r => r.status === 'rejected').length;
    const waitingList = referrals.filter(r => r.triageStatus === 'waiting-list').length;

    return { total, new: new_, accepted, rejected, waitingList };
  };

  const specialtyStats = calculateSpecialtyStats();
  const overallStats = getOverallStats();

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Super User Dashboard</h1>
          <p className="text-muted-foreground">
            {currentSpecialty 
              ? `Overview of ${currentSpecialty} referrals` 
              : 'Overview of all referrals across specialties'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReturnToSpecialtySelection} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Specialty
          </Button>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Specialty Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Specialty Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SpecialtySelector
                specialties={['All Specialties', ...specialties]}
                onSpecialtySelect={(specialty) => {
                  if (specialty === 'All Specialties') {
                    setCurrentSpecialty(null);
                    localStorage.removeItem('selectedSpecialty');
                  } else {
                    handleSpecialtySelect(specialty);
                  }
                }}
              />
            </div>
            {currentSpecialty && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentSpecialty(null);
                  localStorage.removeItem('selectedSpecialty');
                }}
              >
                Show All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{overallStats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{overallStats.new}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <span className="text-2xl font-bold">{overallStats.accepted}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waiting List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">{overallStats.waitingList}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500 rounded-full" />
              <span className="text-2xl font-bold">{overallStats.rejected}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialty Breakdown */}
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
    </div>
  );
};

export default AdminPage;
