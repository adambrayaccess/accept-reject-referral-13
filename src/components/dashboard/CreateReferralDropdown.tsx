
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilePlus, ChevronDown, Sparkles, FileText } from 'lucide-react';
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
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white border border-gray-200 shadow-lg z-50"
        >
          <DropdownMenuItem onClick={() => setIsManualModalOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Manual Referral
            <span className="ml-auto text-xs text-muted-foreground">Traditional</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsAutoModalOpen(true)}
            className="relative bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-900 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 focus:from-purple-100 focus:to-purple-200 focus:border-purple-300 transition-all duration-200"
          >
            <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
            <span className="font-medium">Add Auto Referral</span>
            <span className="ml-auto text-xs text-purple-600 font-semibold">AI-Powered</span>
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
