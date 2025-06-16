
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Referral } from '@/types/referral';

interface AppointmentStatusProps {
  referral: Referral;
  variant?: 'default' | 'compact';
}

const AppointmentStatus = ({ referral, variant = 'default' }: AppointmentStatusProps) => {
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
          details: `${age} days waiting`
        };
      } else if (age > 30) {
        return {
          status: 'due',
          text: 'Appointment Due',
          icon: Clock,
          variant: 'secondary' as const,
          details: `${age} days waiting`
        };
      } else {
        return {
          status: 'scheduled',
          text: 'Awaiting Appointment',
          icon: Calendar,
          variant: 'outline' as const,
          details: `${age} days waiting`
        };
      }
    } else if (referral.triageStatus === 'pre-admission-assessment') {
      return {
        status: 'booked',
        text: 'Appointment Booked',
        icon: CheckCircle,
        variant: 'default' as const,
        details: 'Pre-admission assessment'
      };
    } else if (referral.triageStatus === 'assessed') {
      return {
        status: 'completed',
        text: 'Assessment Complete',
        icon: CheckCircle,
        variant: 'default' as const,
        details: 'Awaiting next step'
      };
    } else {
      return {
        status: 'pending',
        text: 'Assessment Pending',
        icon: Clock,
        variant: 'secondary' as const,
        details: 'Awaiting triage'
      };
    }
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
    <div className="flex flex-col gap-1">
      <Badge variant={appointmentStatus.variant} className="w-fit">
        <IconComponent className="h-3 w-3 mr-1" />
        {appointmentStatus.text}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {appointmentStatus.details}
      </span>
    </div>
  );
};

export default AppointmentStatus;
