
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Referral } from '@/types/referral';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isPast, isToday, isTomorrow } from 'date-fns';

interface AppointmentStatusProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

interface AppointmentStatusResult {
  status: string;
  text: string;
  icon: any;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
  details: string;
  canBook: boolean;
  appointmentInfo?: any;
}

const AppointmentStatus = ({ referral, variant = 'default' }: AppointmentStatusProps) => {
  const { toast } = useToast();

  const getAppointmentStatus = (): AppointmentStatusResult => {
    const age = referral.calculatedReferralAge || 0;
    
    // If there's actual appointment data, use it
    if (referral.appointmentDetails) {
      const appointment = referral.appointmentDetails;
      
      // Safety check for appointmentDate field
      if (!appointment.appointmentDate) {
        console.warn('Appointment details missing appointmentDate field:', appointment);
        return getFallbackStatus(age);
      }
      
      try {
        const appointmentDate = parseISO(appointment.appointmentDate);
        
        switch (appointment.status) {
          case 'scheduled':
            // Check if this is actually an overdue appointment based on age and notes
            if (age > 90 || appointment.notes?.includes('overdue')) {
              return {
                status: 'overdue',
                text: 'Appointment Overdue',
                icon: AlertCircle,
                variant: 'destructive',
                details: `${age} days waiting`,
                canBook: true,
                appointmentInfo: appointment
              };
            }
            
            // Check if this is actually pending based on notes
            if (appointment.notes?.includes('Awaiting') || appointment.notes?.includes('to be scheduled')) {
              return {
                status: 'pending',
                text: 'Appointment Pending',
                icon: Clock,
                variant: 'secondary',
                details: 'Awaiting scheduling',
                canBook: true,
                appointmentInfo: appointment
              };
            }
            
            return {
              status: 'scheduled',
              text: isToday(appointmentDate) ? 'Appointment Today' : 
                    isTomorrow(appointmentDate) ? 'Appointment Tomorrow' :
                    `Appointment ${format(appointmentDate, 'MMM dd')}`,
              icon: Calendar,
              variant: 'default',
              details: `${appointment.appointmentTime} - ${appointment.location}`,
              canBook: false,
              appointmentInfo: appointment
            };
          case 'confirmed':
            return {
              status: 'confirmed',
              text: isToday(appointmentDate) ? 'Confirmed Today' : 
                    isTomorrow(appointmentDate) ? 'Confirmed Tomorrow' :
                    `Confirmed ${format(appointmentDate, 'MMM dd')}`,
              icon: CheckCircle,
              variant: 'default',
              details: `${appointment.appointmentTime} - ${appointment.location}`,
              canBook: false,
              appointmentInfo: appointment
            };
          case 'cancelled':
            // Check if this represents an overdue appointment
            if (age > 90 || appointment.notes?.includes('overdue')) {
              return {
                status: 'overdue',
                text: 'Appointment Overdue',
                icon: AlertCircle,
                variant: 'destructive',
                details: `${age} days waiting`,
                canBook: true,
                appointmentInfo: appointment
              };
            }
            
            return {
              status: 'cancelled',
              text: 'Appointment Cancelled',
              icon: XCircle,
              variant: 'destructive',
              details: 'Needs rescheduling',
              canBook: true,
              appointmentInfo: appointment
            };
          case 'completed':
            return {
              status: 'completed',
              text: 'Appointment Completed',
              icon: CheckCircle,
              variant: 'default',
              details: `${format(appointmentDate, 'MMM dd')} - ${appointment.location}`,
              canBook: false,
              appointmentInfo: appointment
            };
        }
      } catch (error) {
        console.error('Error parsing appointment date:', error, appointment);
        return getFallbackStatus(age);
      }
    }
    
    return getFallbackStatus(age);
  };

  const getFallbackStatus = (age: number): AppointmentStatusResult => {
    // Fallback to original logic for referrals without appointment data
    if (referral.triageStatus === 'waiting-list') {
      if (age > 60) {
        return {
          status: 'overdue',
          text: 'Appointment Overdue',
          icon: AlertCircle,
          variant: 'destructive',
          details: `${age} days waiting`,
          canBook: true
        };
      } else if (age > 30) {
        return {
          status: 'due',
          text: 'Appointment Due',
          icon: Clock,
          variant: 'secondary',
          details: `${age} days waiting`,
          canBook: true
        };
      } else {
        return {
          status: 'scheduled',
          text: 'Awaiting Appointment',
          icon: Calendar,
          variant: 'outline',
          details: `${age} days waiting`,
          canBook: true
        };
      }
    } else if (referral.triageStatus === 'pre-admission-assessment') {
      return {
        status: 'booked',
        text: 'Appointment Booked',
        icon: CheckCircle,
        variant: 'default',
        details: 'Pre-admission assessment',
        canBook: false
      };
    } else if (referral.triageStatus === 'assessed') {
      return {
        status: 'completed',
        text: 'Assessment Complete',
        icon: CheckCircle,
        variant: 'default',
        details: 'Awaiting next step',
        canBook: true
      };
    } else if (referral.triageStatus === 'pre-assessment') {
      return {
        status: 'pre-assessment',
        text: 'Pre-Assessment',
        icon: Clock,
        variant: 'secondary',
        details: 'Ready for appointment booking',
        canBook: true
      };
    } else {
      return {
        status: 'pending',
        text: 'Assessment Pending',
        icon: Clock,
        variant: 'secondary',
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
        {appointmentStatus.appointmentInfo && (
          <div className="text-xs text-muted-foreground">
            <div>Type: {appointmentStatus.appointmentInfo.type}</div>
            {appointmentStatus.appointmentInfo.consultant && (
              <div>With: {appointmentStatus.appointmentInfo.consultant}</div>
            )}
          </div>
        )}
      </div>
      
      {appointmentStatus.canBook && (
        <Button 
          onClick={handleBookAppointment}
          size="sm"
          className="w-fit text-white hover:bg-[#007A7A]/90"
          style={{ backgroundColor: '#007A7A' }}
        >
          <Calendar className="h-4 w-4 mr-1" />
          {appointmentStatus.status === 'cancelled' || appointmentStatus.status === 'overdue' ? 'Reschedule' : 'Book Appointment'}
        </Button>
      )}
    </div>
  );
};

export default AppointmentStatus;
