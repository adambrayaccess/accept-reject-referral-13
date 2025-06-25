
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Titlebar from '@/components/Titlebar';
import PageHeader from '@/components/PageHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/dashboard/useDashboardFilters';
import { useDashboardSorting } from '@/hooks/dashboard/useDashboardSorting';
import { useReferralSelection } from '@/hooks/useReferralSelection';
import { Referral } from '@/types/referral';
import { getAllSpecialtyNames } from '@/data/specialtyOptions';
import { referralService } from '@/services/supabase/referralService';
import DataMigration from '@/components/DataMigration';
import { toast } from 'sonner';

const Dashboard = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  // Load selected specialties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedSpecialties');
    if (saved) {
      setSelectedSpecialties(JSON.parse(saved));
    }
  }, []);

  const {
    referrals,
    filteredReferrals,
    isLoading,
    isReordering,
    handleRefresh,
    handleReorderReferrals
  } = useDashboardData(selectedSpecialties);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    applyFilters
  } = useDashboardFilters();

  const {
    sortField,
    setSortField,
    sortDirection,
    setSortDirection
  } = useDashboardSorting();

  const {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate
  } = useReferralSelection();

  const specialtyNames = getAllSpecialtyNames();

  const handleSpecialtySelectionChange = (newSelection: string[]) => {
    setSelectedSpecialties(newSelection);
    localStorage.setItem('selectedSpecialties', JSON.stringify(newSelection));
  };

  const handleReferralCreated = async (newReferral: Partial<Referral>) => {
    handleRefresh();
    toast.success('Referral created successfully');
  };

  // Apply filters to get the current filtered referrals
  const currentFilteredReferrals = applyFilters(referrals);

  return (
    <div className="min-h-screen bg-gray-50">
      <Titlebar />
      <PageHeader />
      
      <div className="container mx-auto max-w-none">
        <DashboardHeader
          selectedSpecialties={selectedSpecialties}
          specialtyNames={specialtyNames}
          onSpecialtySelectionChange={handleSpecialtySelectionChange}
          onReferralCreated={handleReferralCreated}
        />

        {/* Add Data Migration Component */}
        <div className="px-6 pb-4">
          <DataMigration />
        </div>

        <DashboardTabs
          referrals={referrals}
          filteredReferrals={currentFilteredReferrals}
          isLoading={isLoading}
          isReordering={isReordering}
          view="card"
          onReorder={handleReorderReferrals}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onSelectAll={() => selectAll(currentFilteredReferrals)}
          onClearSelection={clearSelection}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
        />
      </div>
    </div>
  );
};

export default Dashboard;
