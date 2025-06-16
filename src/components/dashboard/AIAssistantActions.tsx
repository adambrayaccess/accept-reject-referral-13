
import { Button } from '@/components/ui/button';
import { Bot, ChevronDown, Users } from 'lucide-react';
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
          variant="outline"
          className={`font-medium rounded-lg px-6 py-3 flex items-center gap-3 transition-all duration-200 ${
            hasSelection 
              ? 'bg-gradient-to-r from-blue-200 to-green-300 hover:from-blue-300 hover:to-green-400 text-blue-800 border-blue-300'
              : 'bg-gradient-to-r from-pink-200 to-purple-300 hover:from-pink-300 hover:to-purple-400 text-purple-800 border-none'
          }`}
        >
          <Bot className="h-5 w-5" />
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
        className="w-80 bg-white border border-purple-200 shadow-lg rounded-lg p-2" 
        align="start"
        sideOffset={5}
      >
        {hasSelection ? (
          <>
            <DropdownMenuItem
              onClick={handleBulkTriage}
              className="bg-gradient-to-r from-blue-100 to-green-200 hover:from-blue-200 hover:to-green-300 text-blue-800 border border-blue-200 font-medium rounded-full px-6 py-3 mb-2 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Auto-triage selected referrals
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={handleBulkAddToCaseload}
              className="bg-gradient-to-r from-blue-100 to-green-200 hover:from-blue-200 hover:to-green-300 text-blue-800 border border-blue-200 font-medium rounded-full px-6 py-3 mb-2 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Bulk add to caseload
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={handleBulkAddToWaitingList}
              className="bg-gradient-to-r from-blue-100 to-green-200 hover:from-blue-200 hover:to-green-300 text-blue-800 border border-blue-200 font-medium rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Bulk add to waiting list
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={handleAutoAddReferral}
              className="bg-gradient-to-r from-orange-100 to-purple-200 hover:from-orange-200 hover:to-purple-300 text-purple-800 border border-purple-200 font-medium rounded-full px-6 py-3 mb-2 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Auto add a new referral
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={handleAutoAddToCaseload}
              className="bg-gradient-to-r from-orange-100 to-purple-200 hover:from-orange-200 hover:to-purple-300 text-purple-800 border border-purple-200 font-medium rounded-full px-6 py-3 mb-2 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Auto add a patient to a caseload
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={handleAutoAddToWaitingList}
              className="bg-gradient-to-r from-orange-100 to-purple-200 hover:from-orange-200 hover:to-purple-300 text-purple-800 border border-purple-200 font-medium rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <Bot className="h-4 w-4" />
              Auto add a patient to a waiting list
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIAssistantActions;
