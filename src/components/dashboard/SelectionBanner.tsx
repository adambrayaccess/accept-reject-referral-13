
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface SelectionBannerProps {
  selectedCount: number;
  onClearSelection: () => void;
}

const SelectionBanner = ({ selectedCount, onClearSelection }: SelectionBannerProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          {selectedCount} referral{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-blue-600 hover:text-blue-800"
      >
        Clear selection
      </Button>
    </div>
  );
};

export default SelectionBanner;
