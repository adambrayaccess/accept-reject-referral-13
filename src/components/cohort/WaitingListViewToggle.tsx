
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid } from 'lucide-react';

interface WaitingListViewToggleProps {
  view: 'table' | 'grid';
  onViewChange: (view: 'table' | 'grid') => void;
}

const WaitingListViewToggle = ({
  view,
  onViewChange
}: WaitingListViewToggleProps) => {
  return (
    <div className="flex gap-1 border rounded-md">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="rounded-r-none"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="rounded-l-none"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WaitingListViewToggle;
