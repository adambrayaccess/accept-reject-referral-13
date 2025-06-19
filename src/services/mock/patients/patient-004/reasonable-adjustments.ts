
import { ReasonableAdjustmentsFlag } from '@/types/reasonable-adjustments';

export const patient004ReasonableAdjustments: ReasonableAdjustmentsFlag = {
  hasAdjustments: true,
  flagLevel: 'complex',
  adjustments: [
    {
      id: 'RA004001',
      category: 'cognitive',
      description: 'Memory support and clear instructions',
      specificNeeds: 'Patient has early-stage dementia and requires clear, simple instructions. May need information repeated.',
      implementationNotes: 'Speak slowly and clearly. Provide written instructions in simple language. Allow extra time for appointments.',
      dateRecorded: '2023-05-01T00:00:00Z',
      recordedBy: 'Dr. Helen Roberts',
      reviewDate: '2024-05-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'RA004002',
      category: 'communication',
      description: 'Family member present for appointments',
      specificNeeds: 'Patient prefers to have daughter present during appointments for support and to help remember information.',
      implementationNotes: 'Contact daughter (Sarah Thompson - 07700 123456) to arrange attendance at appointments.',
      dateRecorded: '2023-05-01T00:00:00Z',
      recordedBy: 'Dr. Helen Roberts',
      reviewDate: '2024-05-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'RA004003',
      category: 'sensory',
      description: 'Hearing aid user - speak clearly',
      specificNeeds: 'Patient wears hearing aids in both ears. Requires clear speech and good lighting to lip read.',
      implementationNotes: 'Face patient when speaking. Ensure good lighting. Speak clearly and at normal volume.',
      dateRecorded: '2023-05-01T00:00:00Z',
      recordedBy: 'Dr. Helen Roberts',
      reviewDate: '2024-05-01T00:00:00Z',
      status: 'active'
    }
  ],
  lastUpdated: '2023-05-01T00:00:00Z',
  updatedBy: 'Dr. Helen Roberts'
};
