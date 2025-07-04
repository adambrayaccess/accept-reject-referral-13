import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export const useReferralNotifications = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const channel = supabase
      .channel('referral-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals'
        },
        (payload) => {
          const newReferral = payload.new;
          
          toast({
            title: "New Referral Imported",
            description: "A new referral has been imported into the system",
            action: (
              <ToastAction
                altText="View referral"
                onClick={() => navigate(`/referral/${newReferral.id}`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                View Referral
              </ToastAction>
            ),
            duration: 10000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, navigate]);
};