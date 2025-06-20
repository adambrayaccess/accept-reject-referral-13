
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Referral } from '@/types/referral';
import { services } from '@/data/serviceOptions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useReferralSelection } from '@/hooks/useReferralSelection';
import Titlebar from './Titlebar';
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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
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
  } = useDashboardData(selectedServices);

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
    const storedServices = localStorage.getItem('selectedServices');
    if (storedServices) {
      try {
        const parsed = JSON.parse(storedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedServices(parsed);
        } else {
          navigate('/select-service');
        }
      } catch {
        navigate('/select-service');
      }
    } else {
      navigate('/select-service');
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

  const handleServiceSelectionChange = (newSelection: string[]) => {
    setSelectedServices(newSelection);
    if (newSelection.length > 0) {
      localStorage.setItem('selectedServices', JSON.stringify(newSelection));
      toast({
        title: "Services Updated",
        description: `Now triaging for ${newSelection.length === 1 ? newSelection[0] : `${newSelection.length} services`}`,
      });
    } else {
      localStorage.removeItem('selectedServices');
    }
  };

  const selectedReferrals = getSelectedReferrals(filteredReferrals);
  const serviceNames = services.map(s => s.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="space-y-6">
        <DashboardHeader
          selectedServices={selectedServices}
          serviceNames={serviceNames}
          onServiceSelectionChange={handleServiceSelectionChange}
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
