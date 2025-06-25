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
import DataMigration from '@/components/DataMigration';

const Dashboard = () => {
  const {
    referrals,
    isLoading,
    specialtyNames,
    reloadData
  } = useDashboardData();

  const {
    selectedSpecialties,
    statusFilter,
    priorityFilter,
    searchQuery,
    handleSpecialtySelectionChange,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleSearchChange,
    applyFilters
  } = useDashboardFilters();

  const {
    sortField,
    sortDirection,
    handleSortChange
  } = useDashboardSorting();

  const {
    selectedIds,
    isAllSelected,
    isIndeterminate,
    handleToggleSelection,
    handleSelectAll,
    handleClearSelection
  } = useReferralSelection(referrals);

  const handleReferralCreated = (newReferral: Partial<Referral>) => {
    reloadData();
  };

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
          isLoading={isLoading}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          searchQuery={searchQuery}
          sortField={sortField}
          sortDirection={sortDirection}
          selectedIds={selectedIds}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
          onStatusFilterChange={handleStatusFilterChange}
          onPriorityFilterChange={handlePriorityFilterChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onToggleSelection={handleToggleSelection}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          filteredReferrals={applyFilters(referrals)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
