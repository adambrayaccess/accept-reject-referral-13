import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  type: 'discharge' | 'referral' | 'urgent' | 'virtual' | 'planned';
}

interface PatientActivityTimelineProps {
  events?: TimelineEvent[];
}

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'discharge':
      return 'bg-blue-500';
    case 'referral':
      return 'bg-[#007A7A]';
    case 'urgent':
      return 'bg-[#973060]';
    case 'virtual':
      return 'bg-blue-300';
    case 'planned':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const PatientActivityTimeline = ({ events = [] }: PatientActivityTimelineProps) => {
  // Default events if none provided
  const defaultEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Patient discharged from hospital, Discharge letter received',
      date: '2025-06-04',
      type: 'discharge'
    },
    {
      id: '2',
      title: 'Referral received',
      date: '2025-06-06',
      type: 'referral'
    },
    {
      id: '3',
      title: 'Reviewed and marked as Urgent',
      date: '2025-06-06',
      type: 'urgent'
    },
    {
      id: '4',
      title: 'Patient is also being seen by Virtual Wards',
      date: '2025-06-06',
      type: 'virtual'
    },
    {
      id: '5',
      title: 'Planned date in the diary to conduct Risk Assessment',
      date: '2025-07-07',
      type: 'planned'
    }
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#007A7A]"></div>
          
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-6 h-6 rounded-full ${getEventColor(event.type)} flex-shrink-0`}></div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(event.date), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientActivityTimeline;
