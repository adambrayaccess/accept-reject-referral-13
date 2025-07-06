import { Badge } from '@/components/ui/badge';
import { 
  Route,
  Calendar, 
  FileText, 
  Activity, 
  ClipboardList, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  Phone,
  PhoneCall,
  Mail,
  MessageSquare,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Referral } from '@/types/referral';

interface JourneyEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'referral' | 'document' | 'appointment' | 'triage' | 'pathway' | 'phone-call' | 'letter' | 'communication' | 'booking' | 'assessment';
  status?: 'completed' | 'active' | 'scheduled' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

interface PatientJourneySheetContentProps {
  referral: Referral;
}

const getEventIcon = (type: JourneyEvent['type']) => {
  switch (type) {
    case 'referral':
      return <FileText className="h-4 w-4 text-white" />;
    case 'document':
      return <Upload className="h-4 w-4 text-white" />;
    case 'appointment':
      return <Calendar className="h-4 w-4 text-white" />;
    case 'triage':
      return <ClipboardList className="h-4 w-4 text-white" />;
    case 'pathway':
      return <Clock className="h-4 w-4 text-white" />;
    case 'phone-call':
      return <Phone className="h-4 w-4 text-white" />;
    case 'letter':
      return <Mail className="h-4 w-4 text-white" />;
    case 'communication':
      return <MessageSquare className="h-4 w-4 text-white" />;
    case 'booking':
      return <UserCheck className="h-4 w-4 text-white" />;
    case 'assessment':
      return <Stethoscope className="h-4 w-4 text-white" />;
    default:
      return <Activity className="h-4 w-4 text-white" />;
  }
};

const getEventColor = (type: JourneyEvent['type'], status?: string, priority?: string) => {
  if (priority === 'high') return 'bg-red-600'; // High priority red
  if (status === 'cancelled') return 'bg-gray-400';
  
  switch (type) {
    case 'referral':
      return 'bg-[#007A7A]'; // Primary teal
    case 'document':
      return 'bg-purple-600'; // Purple for documents
    case 'appointment':
      return 'bg-orange-600'; // Orange for appointments
    case 'triage':
      return 'bg-[#973060]'; // Purple-pink for triage
    case 'pathway':
      return 'bg-indigo-600'; // Indigo for pathways
    case 'phone-call':
      return 'bg-emerald-600'; // Emerald for phone calls
    case 'letter':
      return 'bg-amber-600'; // Amber for letters
    case 'communication':
      return 'bg-cyan-600'; // Cyan for other communications
    case 'booking':
      return 'bg-blue-600'; // Blue for bookings
    case 'assessment':
      return 'bg-green-600'; // Green for assessments
    default:
      return 'bg-gray-500';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'cancelled':
      return <XCircle className="h-3 w-3 text-red-600" />;
    case 'active':
      return <AlertCircle className="h-3 w-3 text-blue-600" />;
    default:
      return null;
  }
};

const PatientJourneySheetContent = ({ referral }: PatientJourneySheetContentProps) => {
  // Generate journey events from referral data
  const generateJourneyEvents = (): JourneyEvent[] => {
    const events: JourneyEvent[] = [];

    // Referral creation
    events.push({
      id: 'referral-created',
      title: 'Referral Created',
      description: `Referral to ${referral.specialty} created`,
      date: referral.created,
      type: 'referral',
      status: 'completed',
      priority: referral.priority === 'emergency' ? 'high' : referral.priority === 'urgent' ? 'medium' : 'low'
    });

    // Generate sample patient interactions based on referral data
    const createDate = new Date(referral.created);
    
    // Phone call to confirm receipt (1 day after referral)
    const confirmCallDate = new Date(createDate);
    confirmCallDate.setDate(confirmCallDate.getDate() + 1);
    events.push({
      id: 'confirm-call',
      title: 'Phone Call: Referral Confirmation',
      description: 'Outbound call to patient confirming receipt of referral and initial triage assessment',
      date: confirmCallDate.toISOString(),
      type: 'phone-call',
      status: 'completed',
      metadata: { direction: 'outbound', duration: '5 minutes', outcome: 'confirmed' }
    });

    // Initial appointment booking (3 days after referral)
    const bookingDate = new Date(createDate);
    bookingDate.setDate(bookingDate.getDate() + 3);
    events.push({
      id: 'appointment-booking',
      title: 'Appointment Booking: Initial Assessment',
      description: 'Appointment booked for initial consultation and assessment',
      date: bookingDate.toISOString(),
      type: 'booking',
      status: 'completed',
      metadata: { 
        appointmentType: 'initial_consultation',
        bookedBy: 'Booking Team',
        method: 'online_system'
      }
    });

    // Audit log events (triage actions)
    referral.auditLog?.forEach((entry, index) => {
      events.push({
        id: `audit-${index}`,
        title: entry.action,
        description: entry.notes,
        date: entry.timestamp,
        type: 'triage',
        status: 'completed'
      });
    });

    // Attachments/Documents
    referral.attachments?.forEach((attachment) => {
      events.push({
        id: `doc-${attachment.id}`,
        title: `Document Added: ${attachment.title}`,
        description: `File type: ${attachment.contentType}`,
        date: attachment.date,
        type: 'document',
        status: 'completed'
      });
    });

    // Appointment details
    if (referral.appointmentDetails) {
      events.push({
        id: 'appointment',
        title: `${referral.appointmentDetails.type.charAt(0).toUpperCase() + referral.appointmentDetails.type.slice(1)} Appointment`,
        description: `${referral.appointmentDetails.location}${referral.appointmentDetails.consultant ? ` with ${referral.appointmentDetails.consultant}` : ''}`,
        date: `${referral.appointmentDetails.appointmentDate}T${referral.appointmentDetails.appointmentTime}`,
        type: 'appointment',
        status: referral.appointmentDetails.status === 'scheduled' ? 'scheduled' : 
               referral.appointmentDetails.status === 'confirmed' ? 'active' : 
               referral.appointmentDetails.status as any
      });
    }

    // RTT Pathway milestones
    if (referral.rttPathway) {
      events.push({
        id: 'rtt-start',
        title: 'RTT Clock Started',
        description: `18-week pathway initiated`,
        date: referral.rttPathway.clockStart,
        type: 'pathway',
        status: 'completed'
      });

      // Add RTT target date as future event
      events.push({
        id: 'rtt-target',
        title: 'RTT Target Date',
        description: `18-week deadline (${referral.rttPathway.daysRemaining} days remaining)`,
        date: referral.rttPathway.targetDate,
        type: 'pathway',
        status: 'scheduled',
        priority: referral.rttPathway.breachRisk === 'breached' ? 'high' : 
                 referral.rttPathway.breachRisk === 'high' ? 'medium' : 'low'
      });
    }

    // Sort events by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const journeyEvents = generateJourneyEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="outline" className="text-sm">
          {referral.specialty}
        </Badge>
        <Badge variant="outline" className="text-sm">
          {journeyEvents.length} Events
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#007A7A] opacity-30"></div>
        
        <div className="space-y-6">
          {journeyEvents.map((event, index) => {
            const isLast = index === journeyEvents.length - 1;
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date();
            
            return (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${getEventColor(event.type, event.status, event.priority)} flex items-center justify-center flex-shrink-0 ${isUpcoming ? 'opacity-60' : ''}`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className={`flex-1 min-w-0 pb-6 ${isLast ? 'pb-0' : ''}`}>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {event.title}
                        </h4>
                        {event.status && getStatusIcon(event.status)}
                        {event.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="outline" className="text-xs">
                            Scheduled
                          </Badge>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-medium text-gray-700">
                          {format(eventDate, 'dd/MM/yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(eventDate, 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                    )}
                    
                    {/* Additional metadata for different event types */}
                    {event.metadata && (
                      <div className="text-xs text-muted-foreground mb-2 space-y-1">
                        {event.type === 'phone-call' && (
                          <>
                            {event.metadata.direction && (
                              <div className="flex items-center gap-1">
                                {event.metadata.direction === 'inbound' ? 
                                  <PhoneCall className="h-3 w-3" /> : 
                                  <Phone className="h-3 w-3" />
                                }
                                <span className="capitalize">{event.metadata.direction} call</span>
                                {event.metadata.duration && <span>• {event.metadata.duration}</span>}
                              </div>
                            )}
                            {event.metadata.outcome && (
                              <div>Outcome: {event.metadata.outcome}</div>
                            )}
                          </>
                        )}
                        {event.type === 'booking' && (
                          <>
                            {event.metadata.appointmentType && (
                              <div>Type: {event.metadata.appointmentType.replace('_', ' ')}</div>
                            )}
                            {event.metadata.bookedBy && (
                              <div>Booked by: {event.metadata.bookedBy}</div>
                            )}
                            {event.metadata.method && (
                              <div>Method: {event.metadata.method.replace('_', ' ')}</div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      {event.status && event.status !== 'completed' && (
                        <Badge 
                          variant={event.status === 'active' ? 'default' : 'outline'} 
                          className="text-xs"
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {journeyEvents.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No journey events available for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientJourneySheetContent;