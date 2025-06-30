
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Referral } from '@/types/referral';
import { specialties } from '@/data/specialtyOptions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useReferralSelection } from '@/hooks/useReferralSelection';
import PageHeader from './PageHeader';
import StatisticsBar from './dashboard/StatisticsBar';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardControls from './dashboard/DashboardControls';
import SelectionBanner from './dashboard/SelectionBanner';
import DashboardTabs from './dashboard/DashboardTabs';

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

  const selectedReferrals = getSelectedReferrals(filteredReferrals);
  const specialtyNames = specialties.map(s => s.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="space-y-6">
        <DashboardHeader
          selectedSpecialties={selectedSpecialties}
          specialtyNames={specialtyNames}
          onSpecialtySelectionChange={handleSpecialtySelectionChange}
          onReferralCreated={handleCreateReferral}
        />

        <div className="px-6">
          <StatisticsBar />
        </div>

        <div className="px-6 space-y-6">
          <SelectionBanner
            selectedCount={selectedCount}
            onClearSelection={clearSelection}
          />

          <DashboardControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            view={view}
            onViewChange={setView}
            selectedReferrals={selectedReferrals}
            onClearSelection={clearSelection}
          />

          <DashboardTabs
            referrals={referrals}
            filteredReferrals={filteredReferrals}
            isLoading={isLoading}
            isReordering={isReordering}
            view={view}
            onReorder={handleReorderReferrals}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSelectAll={() => selectAll(filteredReferrals)}
            onClearSelection={clearSelection}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
