import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestReferralNotification = () => {
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
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Referral Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={createTestReferral} className="w-full">
          Create Test Referral
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Click to create a test referral and see the notification system in action.
        </p>
      </CardContent>
    </Card>
  );
};

export default TestReferralNotification;