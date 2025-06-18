
import { Activity } from 'lucide-react';
import { JourneyEvent } from '../utils/journeyEventUtils';
import JourneyEventItem from './JourneyEventItem';

interface JourneyTimelineProps {
  events: JourneyEvent[];
}

const JourneyTimeline = ({ events }: JourneyTimelineProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No journey events available for this patient.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#007A7A] opacity-30"></div>
      
      <div className="space-y-6">
        {events.map((event, index) => (
          <JourneyEventItem
            key={event.id}
            event={event}
            isLast={index === events.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default JourneyTimeline;
