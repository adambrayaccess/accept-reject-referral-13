
import { Button } from '@/components/ui/button';
import { Bot, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AIAssistantActions = () => {
  const { toast } = useToast();

  const handleAutoAddReferral = () => {
    toast({
      title: "AI Assistant",
      description: "Auto-adding a new referral...",
    });
    // TODO: Implement AI-assisted referral creation
    console.log('Auto add new referral triggered');
  };

  const handleAutoAddToCaseload = () => {
    toast({
      title: "AI Assistant", 
      description: "Auto-adding patient to caseload...",
    });
    // TODO: Implement AI-assisted caseload addition
    console.log('Auto add to caseload triggered');
  };

  const handleAutoAddToWaitingList = () => {
    toast({
      title: "AI Assistant",
      description: "Auto-adding patient to waiting list...",
    });
    // TODO: Implement AI-assistant waiting list addition
    console.log('Auto add to waiting list triggered');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-pink-200 to-purple-300 hover:from-pink-300 hover:to-purple-400 text-purple-800 border-none font-medium rounded-lg px-6 py-3 flex items-center gap-3 transition-all duration-200"
        >
          <Bot className="h-5 w-5" />
          Copilot Actions
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-white border border-purple-200 shadow-lg rounded-lg p-2" 
        align="start"
        sideOffset={5}
      >
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIAssistantActions;
