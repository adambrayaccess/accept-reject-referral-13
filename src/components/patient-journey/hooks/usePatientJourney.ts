
import { useMemo } from 'react';
import { Referral } from '@/types/referral';
import { generateJourneyEvents, JourneyEvent } from '../utils/journeyEventUtils';

export const usePatientJourney = (referral: Referral) => {
  const journeyEvents = useMemo(() => {
    return generateJourneyEvents(referral);
  }, [referral]);

  const journeyStats = useMemo(() => {
    const totalEvents = journeyEvents.length;
    const completedEvents = journeyEvents.filter(event => event.status === 'completed').length;
    const upcomingEvents = journeyEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > new Date();
    }).length;
    const highPriorityEvents = journeyEvents.filter(event => event.priority === 'high').length;

    return {
      totalEvents,
      completedEvents,
      upcomingEvents,
      highPriorityEvents
    };
  }, [journeyEvents]);

  return {
    journeyEvents,
    journeyStats
  };
};
