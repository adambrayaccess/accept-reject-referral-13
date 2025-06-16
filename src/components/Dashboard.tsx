
import { Button } from '@/components/ui/button';
import { Users, Shield, ChevronDown } from 'lucide-react';
import SearchBar from './dashboard/SearchBar';
import SortAndFilterControls from './dashboard/SortAndFilterControls';
import ViewToggle from './dashboard/ViewToggle';
import ReferralGrid from './dashboard/ReferralGrid';
import StatisticsBar from './dashboard/StatisticsBar';
import Titlebar from './Titlebar';
import PageHeader from './PageHeader';
import AIAssistantActions from './dashboard/AIAssistantActions';
import CreateReferralDropdown from './dashboard/CreateReferralDropdown';
import SpecialtyMultiSelector from './SpecialtyMultiSelector';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useReferralSelection } from '@/hooks/useReferralSelection';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { useNavigate } from 'react-router-dom';
import { specialties } from '@/data/specialtyOptions';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';

const Dashboard = () => {
  const [view, setView] = useState<'card' | 'list'>('card');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  const {
    filteredReferrals,
    isLoading,
    isReordering,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    handleRefresh,
    handleReorderReferrals,
    referrals,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  } = useDashboardData(selectedSpecialties);

  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedReferrals,
    isAllSelected,
    isIndeterminate
  } = useReferralSelection();

  useEffect(() => {
    const storedSpecialties = localStorage.getItem('selectedSpecialties');
    if (storedSpecialties) {
      try {
        const parsed = JSON.parse(storedSpecialties);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedSpecialties(parsed);
        } else {
          navigate('/select-specialty');
        }
      } catch {
        navigate('/select-specialty');
      }
    } else {
      navigate('/select-specialty');
    }
  }, [navigate]);

  const handleCreateReferral = (newReferral: Partial<Referral>) => {
    const referralType = newReferral.aiGenerated ? 'Auto' : 'Manual';
    toast({
      title: "Referral Created",
      description: `${referralType} referral ${newReferral.id} has been created`,
    });
    handleRefresh();
  };

  const handleSpecialtySelectionChange = (newSelection: string[]) => {
    setSelectedSpecialties(newSelection);
    if (newSelection.length > 0) {
      localStorage.setItem('selectedSpecialties', JSON.stringify(newSelection));
      toast({
        title: "Specialties Updated",
        description: `Now triaging for ${newSelection.length === 1 ? newSelection[0] : `${newSelection.length} specialties`}`,
      });
    } else {
      localStorage.removeItem('selectedSpecialties');
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected(filteredReferrals)) {
      clearSelection();
    } else {
      selectAll(filteredReferrals);
    }
  };

  const selectedReferrals = getSelectedReferrals(filteredReferrals);
  const specialtyNames = specialties.map(s => s.name);

  const getDisplayText = () => {
    if (selectedSpecialties.length === 0) {
      return 'No specialties selected';
    } else if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0];
    } else if (selectedSpecialties.length === specialtyNames.filter(s => s !== 'all').length) {
      return 'All Specialties';
    } else {
      return `${selectedSpecialties.length} specialties`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="space-y-6">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Referral Dashboard</h1>
              <div className="flex items-center mt-1">
                <span className="text-sm text-muted-foreground mr-2">Triaging for:</span>
                <span className="font-medium text-foreground">{getDisplayText()}</span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <CreateReferralDropdown onReferralCreated={handleCreateReferral} />
            </div>
          </div>
        </div>

        <div className="px-6">
          <SpecialtyMultiSelector
            specialties={specialtyNames}
            selectedSpecialties={selectedSpecialties}
            onSelectionChange={handleSpecialtySelectionChange}
            placeholder="Select specialties to triage"
            className="mb-4"
          />
        </div>

        <div className="px-6">
          <StatisticsBar />
        </div>

        <div className="px-6 space-y-6">
          {selectedCount > 0 && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {selectedCount} referral{selectedCount > 1 ? 's' : ''} selected
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear selection
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="w-full lg:flex-1">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                <AIAssistantActions 
                  selectedReferrals={selectedReferrals}
                  onClearSelection={clearSelection}
                />
              </div>
              
              <div className="flex gap-2 w-full lg:w-auto items-center lg:flex-shrink-0">
                <SortAndFilterControls
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>
          </div>

          <EnhancedTabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-3">
              <div className="w-full max-w-2xl">
                <EnhancedTabsList variant="grid" size="md">
                  <EnhancedTabsTrigger value="all" variant="grid" size="md">All Referrals</EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="new" variant="grid" size="md">Pending ({referrals.filter(r => r.status === 'new').length})</EnhancedTabsTrigger>
                  <EnhancedTabsTrigger value="processed" variant="grid" size="md">Processed ({referrals.filter(r => r.status !== 'new').length})</EnhancedTabsTrigger>
                </EnhancedTabsList>
              </div>
            </div>

            <EnhancedTabsContent value="all">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                view={view} 
                onReorder={handleReorderReferrals}
                selectedIds={selectedIds}
                onToggleSelection={toggleSelection}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
                isAllSelected={isAllSelected(filteredReferrals)}
                isIndeterminate={isIndeterminate(filteredReferrals)}
              />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="new">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                filter={(r) => r.status === 'new'}
                view={view}
                onReorder={handleReorderReferrals}
                selectedIds={selectedIds}
                onToggleSelection={toggleSelection}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
                isAllSelected={isAllSelected(filteredReferrals.filter(r => r.status === 'new'))}
                isIndeterminate={isIndeterminate(filteredReferrals.filter(r => r.status === 'new'))}
              />
            </EnhancedTabsContent>

            <EnhancedTabsContent value="processed">
              <ReferralGrid 
                referrals={filteredReferrals} 
                isLoading={isLoading} 
                isReordering={isReordering}
                filter={(r) => r.status !== 'new'}
                view={view}
                onReorder={handleReorderReferrals}
                selectedIds={selectedIds}
                onToggleSelection={toggleSelection}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
                isAllSelected={isAllSelected(filteredReferrals.filter(r => r.status !== 'new'))}
                isIndeterminate={isIndeterminate(filteredReferrals.filter(r => r.status !== 'new'))}
              />
            </EnhancedTabsContent>
          </EnhancedTabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
