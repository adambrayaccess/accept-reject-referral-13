
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { JourneyEvent } from '../utils/journeyEventUtils';
import { getEventIcon, getEventColor, getStatusIcon } from '../utils/eventStylingUtils';

interface JourneyEventItemProps {
  event: JourneyEvent;
  isLast: boolean;
}

const JourneyEventItem = ({ event, isLast }: JourneyEventItemProps) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="relative flex items-start gap-4">
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
          
          {/* Event metadata */}
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
              {event.type === 'letter' && event.metadata.method && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>Sent via {event.metadata.method}</span>
                </div>
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
              {event.type === 'assessment' && (
                <>
                  {event.metadata.assessmentType && (
                    <div>Type: {event.metadata.assessmentType.replace('_', ' ')}</div>
                  )}
                  {event.metadata.duration && (
                    <div>Duration: {event.metadata.duration}</div>
                  )}
                  {event.metadata.outcome && (
                    <div>Outcome: {event.metadata.outcome.replace('_', ' ')}</div>
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
};

export default JourneyEventItem;
