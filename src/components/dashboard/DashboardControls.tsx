
import SearchBar from './SearchBar';
import SortAndFilterControls from './SortAndFilterControls';
import ViewToggle from './ViewToggle';
import AIAssistantActions from './AIAssistantActions';
import { Referral } from '@/types/referral';

interface DashboardControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
  selectedReferrals: Referral[];
  onClearSelection: () => void;
}

const DashboardControls = ({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  view,
  onViewChange,
  selectedReferrals,
  onClearSelection
}: DashboardControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="w-full lg:flex-1">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
          <ViewToggle view={view} onViewChange={onViewChange} />
          <AIAssistantActions 
            selectedReferrals={selectedReferrals}
            onClearSelection={onClearSelection}
            context="dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;
