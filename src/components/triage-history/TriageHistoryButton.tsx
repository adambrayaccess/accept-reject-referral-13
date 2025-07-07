import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface TriageHistoryButtonProps {
  onClick: () => void;
}

const TriageHistoryButton = ({ onClick }: TriageHistoryButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 font-medium"
    >
      <History className="h-4 w-4" />
      View Triage History
    </Button>
  );
};

export default TriageHistoryButton;
