
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
      const timestamp = Date.now();
      const ubrn = `TEST-${timestamp}`;
      
      // Generate the SQL script that will be executed
      const sqlScript = `
INSERT INTO public.referrals (
  ubrn,
  specialty,
  reason,
  patient_id,
  referrer_id,
  referral_source,
  waiting_list_priority_override,
  status,
  priority,
  created_at,
  updated_at,
  authored_on
) VALUES (
  '${ubrn}',
  'Test Specialty',
  'Test notification system - Auto-generated for testing referral notifications',
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'Test',
  NULL,
  'new',
  'routine',
  NOW(),
  NOW(),
  NOW()
);`;

      // Log the SQL script being executed
      console.log('🔄 Executing SQL Script for Test Referral:');
      console.log(sqlScript);
      
      toast({
        title: "Generating Test Referral",
        description: "Executing SQL script to create test referral...",
      });

      // Execute the equivalent operation using Supabase client (secure approach)
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          ubrn,
          specialty: 'Test Specialty',
          reason: 'Test notification system - Auto-generated for testing referral notifications',
          patient_id: '00000000-0000-0000-0000-000000000000',
          referrer_id: '00000000-0000-0000-0000-000000000000',
          referral_source: 'Test',
          waiting_list_priority_override: null,
          status: 'new',
          priority: 'routine',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          authored_on: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ SQL Execution Failed:', error);
        toast({
          title: "SQL Execution Failed",
          description: `Error executing test referral creation: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('✅ SQL Execution Successful - New referral created:', data);
        toast({
          title: "Test Referral Created Successfully",
          description: `SQL executed successfully! New referral ${data.ubrn} created with ID: ${data.id}`,
        });
        // Refresh the referrals list if there's a callback
        onReferralCreated(data);
      }
    } catch (err) {
      console.error('💥 Unexpected SQL execution error:', err);
      toast({
        title: "SQL Execution Error",
        description: "Unexpected error during test referral creation",
        variant: "destructive"
      });
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
