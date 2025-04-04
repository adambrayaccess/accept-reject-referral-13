import { useState, useEffect } from 'react';
import { Referral } from '@/types/referral';
import { fetchReferrals } from '@/services/apiService';
import ReferralCard from './ReferralCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const { toast } = useToast();

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReferrals();
      setReferrals(data);
      setFilteredReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referrals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [searchTerm, statusFilter, priorityFilter, specialtyFilter, referrals]);

  const filterReferrals = () => {
    let filtered = [...referrals];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ref => ref.priority === priorityFilter);
    }

    // Filter by specialty
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(ref => ref.specialty === specialtyFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        ref =>
          ref.patient.name.toLowerCase().includes(term) ||
          ref.patient.nhsNumber.toLowerCase().includes(term) ||
          ref.ubrn.toLowerCase().includes(term) ||
          ref.id.toLowerCase().includes(term)
      );
    }

    setFilteredReferrals(filtered);
  };

  const handleRefresh = () => {
    loadReferrals();
    toast({
      title: 'Refreshed',
      description: 'Referral list has been updated',
    });
  };

  const specialties = ['all', ...new Set(referrals.map(ref => ref.specialty))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Referral Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name, NHS number, UBRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty, index) => (
                <SelectItem key={index} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All Referrals</TabsTrigger>
          <TabsTrigger value="new">Pending ({referrals.filter(r => r.status === 'new').length})</TabsTrigger>
          <TabsTrigger value="processed">Processed ({referrals.filter(r => r.status !== 'new').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : filteredReferrals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {filteredReferrals.map((referral) => (
                <ReferralCard key={referral.id} referral={referral} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No referrals match your search criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {filteredReferrals
                .filter(r => r.status === 'new')
                .map((referral) => (
                  <ReferralCard key={referral.id} referral={referral} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {filteredReferrals
                .filter(r => r.status !== 'new')
                .map((referral) => (
                  <ReferralCard key={referral.id} referral={referral} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
