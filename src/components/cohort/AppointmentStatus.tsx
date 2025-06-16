
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';

interface AppointmentStatusProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

const AppointmentStatus = ({ referral, variant = 'default' }: AppointmentStatusProps) => {
  const { toast } = useToast();

  // Mock appointment status based on triage status and referral age
  const getAppointmentStatus = () => {
    const age = referral.calculatedReferralAge || 0;
    
    if (referral.triageStatus === 'waiting-list') {
      if (age > 60) {
        return {
          status: 'overdue',
          text: 'Appointment Overdue',
          icon: AlertCircle,
          variant: 'destructive' as const,
          details: `${age} days waiting`,
          canBook: true
        };
      } else if (age > 30) {
        return {
          status: 'due',
          text: 'Appointment Due',
          icon: Clock,
          variant: 'secondary' as const,
          details: `${age} days waiting`,
          canBook: true
        };
      } else {
        return {
          status: 'scheduled',
          text: 'Awaiting Appointment',
          icon: Calendar,
          variant: 'outline' as const,
          details: `${age} days waiting`,
          canBook: true
        };
      }
    } else if (referral.triageStatus === 'pre-admission-assessment') {
      return {
        status: 'booked',
        text: 'Appointment Booked',
        icon: CheckCircle,
        variant: 'default' as const,
        details: 'Pre-admission assessment',
        canBook: false
      };
    } else if (referral.triageStatus === 'assessed') {
      return {
        status: 'completed',
        text: 'Assessment Complete',
        icon: CheckCircle,
        variant: 'default' as const,
        details: 'Awaiting next step',
        canBook: true
      };
    } else {
      return {
        status: 'pending',
        text: 'Assessment Pending',
        icon: Clock,
        variant: 'secondary' as const,
        details: 'Awaiting triage',
        canBook: false
      };
    }
  };

  const handleBookAppointment = () => {
    toast({
      title: "Booking Appointment",
      description: `Scheduling appointment for referral ${referral.ubrn}`,
    });
    console.log('Book appointment for referral:', referral.id);
  };

  const appointmentStatus = getAppointmentStatus();
  const IconComponent = appointmentStatus.icon;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <IconComponent className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          {appointmentStatus.details}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Badge variant={appointmentStatus.variant} className="w-fit">
          <IconComponent className="h-3 w-3 mr-1" />
          {appointmentStatus.text}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {appointmentStatus.details}
        </span>
      </div>
      
      {appointmentStatus.canBook && (
        <Button 
          onClick={handleBookAppointment}
          size="sm"
          className="w-fit text-white hover:bg-[#007A7A]/90"
          style={{ backgroundColor: '#007A7A' }}
        >
          <Calendar className="h-4 w-4 mr-1" />
          Book Appointment
        </Button>
      )}
    </div>
  );
};

export default AppointmentStatus;
