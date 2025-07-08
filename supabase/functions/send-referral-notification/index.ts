import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferralNotificationRequest {
  referral_id: string;
  action: 'INSERT' | 'UPDATE';
  old_record?: any;
  new_record: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referral_id, action, old_record, new_record }: ReferralNotificationRequest = await req.json();
    
    console.log(`Processing ${action} notification for referral:`, referral_id);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch patient name
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('name')
      .eq('id', new_record.patient_id)
      .single();

    if (patientError) {
      console.error('Error fetching patient:', patientError);
    }

    const patientName = patient?.name || 'Unknown Patient';

    // Prepare notification data
    let notificationData;
    
    if (action === 'INSERT') {
      notificationData = {
        type: 'new_referral',
        title: 'New Referral Imported',
        message: `A new referral for ${patientName} has been imported into the system`,
        referral_id: referral_id,
        patient_name: patientName,
        specialty: new_record.specialty,
        priority: new_record.priority,
        created_at: new_record.created_at
      };
    } else if (action === 'UPDATE') {
      // Skip updates that happen within 5 seconds of creation (likely automatic system updates)
      const createdAt = new Date(new_record.created_at);
      const updatedAt = new Date(new_record.updated_at);
      const timeDifference = updatedAt.getTime() - createdAt.getTime();
      
      if (timeDifference < 5000) {
        console.log('Skipping notification for recent update after creation');
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'Recent update after creation' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Only notify for meaningful changes
      const hasStatusChange = old_record.status !== new_record.status;
      const hasPriorityChange = old_record.priority !== new_record.priority;
      const hasSpecialtyChange = old_record.specialty !== new_record.specialty;
      const hasTriageStatusChange = old_record.triage_status !== new_record.triage_status;
      
      if (!hasStatusChange && !hasPriorityChange && !hasSpecialtyChange && !hasTriageStatusChange) {
        console.log('Skipping notification for minor update');
        return new Response(
          JSON.stringify({ success: true, skipped: true, reason: 'No meaningful changes' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Determine what changed
      let changeDescription = 'has been updated';
      if (hasStatusChange) {
        changeDescription = `status changed from ${old_record.status} to ${new_record.status}`;
      } else if (hasPriorityChange) {
        changeDescription = `priority changed from ${old_record.priority} to ${new_record.priority}`;
      } else if (hasSpecialtyChange) {
        changeDescription = `specialty changed to ${new_record.specialty}`;
      } else if (hasTriageStatusChange) {
        changeDescription = `triage status updated to ${new_record.triage_status || 'none'}`;
      }

      notificationData = {
        type: 'referral_updated',
        title: 'Referral Updated',
        message: `Referral for ${patientName} ${changeDescription}`,
        referral_id: referral_id,
        patient_name: patientName,
        specialty: new_record.specialty,
        priority: new_record.priority,
        change_description: changeDescription,
        updated_at: new_record.updated_at
      };
    }

    // Send HTTP POST to your webhook endpoint (replace with your actual endpoint)
    const webhookUrl = Deno.env.get('REFERRAL_WEBHOOK_URL');
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Edge-Function',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        console.error('Webhook failed:', response.status, await response.text());
      } else {
        console.log('Webhook sent successfully');
      }
    }

    // Also log to console for debugging
    console.log('Notification data:', notificationData);

    return new Response(
      JSON.stringify({ success: true, notification: notificationData }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-referral-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);