
import { Button } from '@/components/ui/button';
import { Table, Grid3X3 } from 'lucide-react';

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
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="rounded-l-none"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WaitingListViewToggle;
