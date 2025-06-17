
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WaitingListSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const WaitingListSearchBar = ({
  searchValue,
  onSearchChange
}: WaitingListSearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search patient name, NHS number..."
        value={searchValue || ''}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default WaitingListSearchBar;
