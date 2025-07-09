
import { useState, useEffect } from 'react';
import { useNotificationService } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { Referral } from '@/types/referral';
import { useSpecialtyData } from '@/hooks/useSpecialtyData';
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
  const { showSpecialtyFilterChange } = useNotificationService();
  const navigate = useNavigate();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isSpecialtiesLoaded, setIsSpecialtiesLoaded] = useState(false);
  
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
  } = useDashboardData(isSpecialtiesLoaded ? selectedSpecialties : []);

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
          setIsSpecialtiesLoaded(true);
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
    console.log('Referral created in dashboard:', newReferral);
    
    // Referral is already saved to database by the modal
    // Just refresh the dashboard to show the new referral
    handleRefresh();
  };

  const handleSpecialtySelectionChange = (newSelection: string[]) => {
    setSelectedSpecialties(newSelection);
    if (newSelection.length > 0) {
      localStorage.setItem('selectedSpecialties', JSON.stringify(newSelection));
      showSpecialtyFilterChange(newSelection);
    } else {
      localStorage.removeItem('selectedSpecialties');
    }
  };

  const selectedReferrals = getSelectedReferrals(filteredReferrals);
  const { getSpecialtyNames } = useSpecialtyData();
  const specialtyNames = getSpecialtyNames();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="space-y-6">
        <DashboardHeader
          selectedSpecialties={selectedSpecialties}
          specialtyNames={specialtyNames}
          onSpecialtySelectionChange={handleSpecialtySelectionChange}
          onReferralCreated={handleCreateReferral}
          onRefresh={handleRefresh}
        />

        <div className="px-6">
          <StatisticsBar referrals={filteredReferrals} selectedSpecialties={selectedSpecialties} />
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
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
