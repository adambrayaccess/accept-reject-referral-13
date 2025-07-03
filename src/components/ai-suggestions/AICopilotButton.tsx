import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Referral } from '@/types/referral';
import AISuggestionsPanel from '@/components/ai-suggestions/AISuggestionsPanel';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AICopilotButtonProps {
  referral: Referral;
  onSuggestionApplied: () => void;
}

const AICopilotButton = ({ referral, onSuggestionApplied }: AICopilotButtonProps) => {
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
              AI Copilot Suggestions
            </SheetTitle>
            <SheetDescription className="text-base">
              AI-powered suggestions for {referral.patient.name}'s referral
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="pr-4">
              <AISuggestionsPanel 
                referral={referral} 
                onSuggestionApplied={onSuggestionApplied}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AICopilotButton;