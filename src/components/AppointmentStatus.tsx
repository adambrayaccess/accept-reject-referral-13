
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Referral } from '@/types/referral';

interface AppointmentStatusProps {
  referral: Referral;
}

const AppointmentStatus = ({ referral }: AppointmentStatusProps) => {
  const { toast } = useToast();

  const handleBookNow = () => {
    toast({
      title: "Booking Appointment",
      description: `Scheduling appointment for referral ${referral.id}`,
    });
    // TODO: Implement appointment booking logic
    console.log('Book appointment for referral:', referral.id);
  };

  // Only show the book button if triage status is not NULL
  const canBookAppointment = referral.triageStatus !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Appointment Status</h3>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="text-base font-medium">
              {canBookAppointment ? 'Schedule an appointment' : 'Appointment booking unavailable'}
            </div>
            <div className="text-sm text-muted-foreground">
              {canBookAppointment 
                ? 'No appointment has been scheduled yet'
                : 'Appointments can only be booked for accepted referrals with triage status'
              }
            </div>
            {canBookAppointment && (
              <Button 
                onClick={handleBookNow}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentStatus;
