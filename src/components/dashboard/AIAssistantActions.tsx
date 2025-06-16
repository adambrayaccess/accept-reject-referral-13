
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    // TODO: Implement AI-assisted waiting list addition
    console.log('Auto add to waiting list triggered');
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        onClick={handleAutoAddReferral}
        className="bg-[#007A7A] hover:bg-[#007A7A]/90 text-white border-[#007A7A] flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        Auto add a new referral
      </Button>
      
      <Button
        variant="outline"
        onClick={handleAutoAddToCaseload}
        className="bg-[#007A7A] hover:bg-[#007A7A]/90 text-white border-[#007A7A] flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        Auto add a patient to a caseload
      </Button>
      
      <Button
        variant="outline"
        onClick={handleAutoAddToWaitingList}
        className="bg-[#007A7A] hover:bg-[#007A7A]/90 text-white border-[#007A7A] flex items-center gap-2"
      >
        <Bot className="h-4 w-4" />
        Auto add a patient to a waiting list
      </Button>
    </div>
  );
};

export default AIAssistantActions;
