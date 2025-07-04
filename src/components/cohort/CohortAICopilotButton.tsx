import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Referral } from '@/types/referral';
import AICopilotActionsPanel from '@/components/ai-copilot/AICopilotActionsPanel';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CohortAICopilotButtonProps {
  selectedReferrals: Referral[];
  onSuggestionApplied: () => void;
}

const CohortAICopilotButton = ({ selectedReferrals, onSuggestionApplied }: CohortAICopilotButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        AI Copilot
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              AI Copilot Actions
            </SheetTitle>
            <SheetDescription className="text-base">
              AI-powered suggestions and actions for selected referrals
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="pr-4">
              <AICopilotActionsPanel 
                selectedReferrals={selectedReferrals}
                onSuggestionApplied={() => {
                  onSuggestionApplied();
                  setIsOpen(false); // Close the sheet after applying suggestion
                }}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CohortAICopilotButton;