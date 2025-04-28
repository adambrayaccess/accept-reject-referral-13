
import { ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortControlsProps {
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const SortControls = ({ 
  sortField, 
  setSortField, 
  sortDirection, 
  setSortDirection 
}: SortControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={sortField} onValueChange={setSortField}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Time</SelectItem>
          <SelectItem value="status">Status</SelectItem>
          <SelectItem value="referrer.organization">Source</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
      >
        {sortDirection === 'asc' ? (
          <ArrowUpAZ className="h-4 w-4" />
        ) : (
          <ArrowDownAZ className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SortControls;
