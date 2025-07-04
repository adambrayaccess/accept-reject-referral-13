import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addToNotificationHistory } from '@/hooks/useNotificationHistory';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const useReferralNotifications = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to fetch patient name by ID
  const fetchPatientName = async (patientId: string): Promise<string> => {
    try {
      const { data: patient, error } = await supabase
        .from('patients')
        .select('name')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        return 'Unknown Patient';
      }

      return patient.name || 'Unknown Patient';
    } catch (error) {
      console.error('Error fetching patient name:', error);
      return 'Unknown Patient';
    }
  };

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
        async (payload) => {
          const newReferral = payload.new;
          
          // Fetch patient name for the notification
          const patientName = await fetchPatientName(newReferral.patient_id);
          
          // Add to notification history
          addToNotificationHistory({
            id: `new-referral-${newReferral.id}`,
            title: "New Referral Imported",
            description: `A new referral for ${patientName} has been imported into the system`,
            referralId: newReferral.id,
            actionLabel: "View Referral"
          });
          
          toast({
            title: "New Referral Imported",
            description: `A new referral for ${patientName} has been imported into the system`,
            referralId: newReferral.id,
            actionLabel: "View Referral",
            action: (
              <div className="flex shrink-0 items-center gap-2 mt-2 sm:mt-0">
                <ToastAction
                  altText="View referral"
                  onClick={() => navigate(`/referral/${newReferral.id}`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm whitespace-nowrap"
                >
                  View Referral
                </ToastAction>
              </div>
            ),
            duration: 10000,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'referrals'
        },
        async (payload) => {
          const updatedReferral = payload.new;
          const oldReferral = payload.old;
          
          // Skip if this is an internal update (has updated_at change but was triggered by our app)
          // We'll detect this by checking if the update happened very recently after a user action
          // For now, we'll show all database updates
          
          // Fetch patient name for the notification
          const patientName = await fetchPatientName(updatedReferral.patient_id);
          
          // Determine what changed to provide meaningful notification
          let changeDescription = "has been updated";
          if (oldReferral.status !== updatedReferral.status) {
            changeDescription = `status changed from ${oldReferral.status} to ${updatedReferral.status}`;
          } else if (oldReferral.priority !== updatedReferral.priority) {
            changeDescription = `priority changed from ${oldReferral.priority} to ${updatedReferral.priority}`;
          } else if (oldReferral.specialty !== updatedReferral.specialty) {
            changeDescription = `specialty changed to ${updatedReferral.specialty}`;
          } else if (oldReferral.triage_status !== updatedReferral.triage_status) {
            changeDescription = `triage status updated to ${updatedReferral.triage_status || 'none'}`;
          }
          
          // Add to notification history
          addToNotificationHistory({
            id: `updated-referral-${updatedReferral.id}-${Date.now()}`,
            title: "Referral Updated",
            description: `Referral for ${patientName} ${changeDescription}`,
            referralId: updatedReferral.id,
            actionLabel: "View Referral"
          });
          
          toast({
            title: "Referral Updated",
            description: `Referral for ${patientName} ${changeDescription}`,
            referralId: updatedReferral.id,
            actionLabel: "View Referral",
            action: (
              <div className="flex shrink-0 items-center gap-2 mt-2 sm:mt-0">
                <ToastAction
                  altText="View referral"
                  onClick={() => navigate(`/referral/${updatedReferral.id}`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm whitespace-nowrap"
                >
                  View Referral
                </ToastAction>
              </div>
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