
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronDown, Users, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AIAssistantActionsProps {
  selectedReferrals?: Referral[];
  onClearSelection?: () => void;
}

const AIAssistantActions = ({ selectedReferrals = [], onClearSelection }: AIAssistantActionsProps) => {
  const { toast } = useToast();
  const hasSelection = selectedReferrals.length > 0;

  const handleAutoAddReferral = () => {
    toast({
      title: "AI Assistant",
      description: "Auto-adding a new referral...",
    });
    console.log('Auto add new referral triggered');
  };

  const handleAutoAddToCaseload = () => {
    toast({
      title: "AI Assistant", 
      description: "Auto-adding patient to caseload...",
    });
    console.log('Auto add to caseload triggered');
  };

  const handleAutoAddToWaitingList = () => {
    toast({
      title: "AI Assistant",
      description: "Auto-adding patient to waiting list...",
    });
    console.log('Auto add to waiting list triggered');
  };

  const handleBulkAddToCaseload = () => {
    toast({
      title: "AI Assistant",
      description: `Adding ${selectedReferrals.length} referrals to caseload...`,
    });
    console.log('Bulk add to caseload triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkAddToWaitingList = () => {
    toast({
      title: "AI Assistant", 
      description: `Adding ${selectedReferrals.length} referrals to waiting list...`,
    });
    console.log('Bulk add to waiting list triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  const handleBulkTriage = () => {
    toast({
      title: "AI Assistant",
      description: `Triaging ${selectedReferrals.length} referrals...`,
    });
    console.log('Bulk triage triggered for:', selectedReferrals.map(r => r.id));
    onClearSelection?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`flex items-center gap-2 ${
            hasSelection 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {hasSelection ? (
            <>
              <Users className="h-4 w-4" />
              Bulk Actions ({selectedReferrals.length})
            </>
          ) : (
            'Copilot Actions'
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-lg z-50"
      >
        {hasSelection ? (
          <>
            <DropdownMenuItem onClick={handleBulkTriage}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Auto-triage selected referrals
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBulkAddToCaseload}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Bulk add to caseload
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBulkAddToWaitingList}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Bulk add to waiting list
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleAutoAddReferral}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Auto add a new referral
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAutoAddToCaseload}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Auto add patient to caseload
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAutoAddToWaitingList}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              Auto add patient to waiting list
              <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIAssistantActions;
