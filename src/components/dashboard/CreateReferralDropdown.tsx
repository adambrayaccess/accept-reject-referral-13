
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilePlus, ChevronDown, Bot, FileText } from 'lucide-react';
import CreateReferralModal from '@/components/CreateReferralModal';
import AutoReferralModal from '@/components/AutoReferralModal';
import { Referral } from '@/types/referral';

interface CreateReferralDropdownProps {
  onReferralCreated: (referral: Partial<Referral>) => void;
}

const CreateReferralDropdown = ({ onReferralCreated }: CreateReferralDropdownProps) => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="text-white hover:bg-[#007A7A]/90 flex items-center gap-2"
            style={{ backgroundColor: '#007A7A' }}
          >
            <FilePlus className="h-4 w-4" />
            Create Referral
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setIsManualModalOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Manual Referral
            <span className="ml-auto text-xs text-muted-foreground">Traditional</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAutoModalOpen(true)}>
            <Bot className="mr-2 h-4 w-4" />
            Add Auto Referral
            <span className="ml-auto text-xs text-muted-foreground">AI-Powered</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateReferralModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={onReferralCreated}
      />

      <AutoReferralModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        onSubmit={onReferralCreated}
      />
    </>
  );
};

export default CreateReferralDropdown;
