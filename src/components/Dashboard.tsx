
import React, { useState, useEffect } from 'react';
import { mockReferrals } from '@/services/mock/referrals';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';
import { Referral } from '@/types/referral';
import { toast } from 'sonner';
import Titlebar from './Titlebar';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardControls from './dashboard/DashboardControls';
import DashboardTabs from './dashboard/DashboardTabs';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/dashboard/useDashboardFilters';
import { useDashboardSorting } from '@/hooks/dashboard/useDashboardSorting';
import { useReferralSelection } from '@/hooks/useReferralSelection';

const Dashboard = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedSpecialties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['Cardiology'];
      }
    }
    return ['Cardiology'];
  });

  const [view, setView] = useState<'card' | 'list'>('card');
  const [isReordering, setIsReordering] = useState(false);
  const specialtyNames = getAllSpecialtyNames();

  const {
    referrals,
    isLoading,
    error,
    refreshReferrals,
    updateReferralOrder
  } = useDashboardData(selectedSpecialties);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredReferrals
  } = useDashboardFilters(referrals);

  const {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  } = useDashboardSorting();

  const {
    selectedIds,
    selectedReferrals,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate
  } = useReferralSelection(filteredReferrals);

  const handleSpecialtySelectionChange = (newSelection: string[]) => {
    setSelectedSpecialties(newSelection);
    localStorage.setItem('selectedSpecialties', JSON.stringify(newSelection));
  };

  const handleReferralCreated = (newReferral: Partial<Referral>) => {
    toast.success('Referral created successfully');
    refreshReferrals();
  };

  const handleReorder = async (sourceIndex: number, destinationIndex: number) => {
    if (isReordering) return;
    
    setIsReordering(true);
    try {
      await updateReferralOrder(sourceIndex, destinationIndex);
      toast.success('Referral order updated');
    } catch (error) {
      console.error('Failed to reorder referrals:', error);
      toast.error('Failed to update referral order');
    } finally {
      setIsReordering(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Titlebar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={refreshReferrals}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Titlebar />
      
      <div className="flex flex-col h-[calc(100vh-3rem)]">
        <DashboardHeader
          selectedSpecialties={selectedSpecialties}
          specialtyNames={specialtyNames}
          onSpecialtySelectionChange={handleSpecialtySelectionChange}
          onReferralCreated={handleReferralCreated}
        />

        <div className="px-6 pb-2">
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
        </div>

        <div className="flex-1 px-6 pb-6">
          <DashboardTabs
            referrals={referrals}
            filteredReferrals={filteredReferrals}
            isLoading={isLoading}
            isReordering={isReordering}
            view={view}
            onReorder={handleReorder}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onSelectAll={selectAll}
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
