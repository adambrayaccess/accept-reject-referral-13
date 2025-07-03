import { Button } from '@/components/ui/button';
import { Pin, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PinButtonProps {
  isPinned: boolean;
  onTogglePin: () => void;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  variant?: 'ghost' | 'outline' | 'secondary';
  className?: string;
  disabled?: boolean;
}

const PinButton = ({ 
  isPinned, 
  onTogglePin, 
  size = 'sm', 
  variant = 'ghost',
  className,
  disabled = false
}: PinButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when used inside Link components
    e.stopPropagation(); // Prevent event bubbling
    onTogglePin();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "transition-all duration-200",
        isPinned 
          ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className
      )}
      title={isPinned ? "Unpin referral" : "Pin referral"}
    >
      {isPinned ? (
        <Pin className="h-4 w-4 fill-current" />
      ) : (
        <PinOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export default PinButton;