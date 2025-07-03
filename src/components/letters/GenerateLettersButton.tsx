import { Button } from '@/components/ui/button';
import { Mail, Plus } from 'lucide-react';

interface GenerateLettersButtonProps {
  onClick: () => void;
}

const GenerateLettersButton = ({ onClick }: GenerateLettersButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 font-medium"
    >
      <Mail className="h-4 w-4" />
      Generate Letters
      <Plus className="h-3 w-3" />
    </Button>
  );
};

export default GenerateLettersButton;