
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilePlus, ChevronDown, Sparkles, FileText, TestTube } from 'lucide-react';
import CreateReferralModal from '@/components/CreateReferralModal';
import AutoReferralModal from '@/components/AutoReferralModal';
import { Referral } from '@/types/referral';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateReferralDropdownProps {
  onReferralCreated: (referral: Partial<Referral>) => void;
}

const CreateReferralDropdown = ({ onReferralCreated }: CreateReferralDropdownProps) => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const { toast } = useToast();

  const createTestReferral = async () => {
    try {
      // Create a test referral to trigger the notification
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          ubrn: `TEST-${Date.now()}`,
          specialty: 'Test Specialty',
          reason: 'Test notification system',
          patient_id: '00000000-0000-0000-0000-000000000000', // placeholder
          referrer_id: '00000000-0000-0000-0000-000000000000', // placeholder
          referral_source: 'Test',
          waiting_list_priority_override: null // Explicitly set to null to avoid constraint violation
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create test referral",
          variant: "destructive"
        });
        console.error('Error creating test referral:', error);
      } else {
        toast({
          title: "Test referral created",
          description: "A notification should appear for the new referral"
        });
        // Refresh the referrals list if there's a callback
        onReferralCreated(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

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
          <DropdownMenuItem 
            onClick={createTestReferral}
            className="text-orange-700 hover:bg-orange-50 focus:bg-orange-50"
          >
            <TestTube className="mr-2 h-4 w-4 text-orange-600" />
            Create Test Referral
            <span className="ml-auto text-xs text-orange-600">For Testing</span>
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
