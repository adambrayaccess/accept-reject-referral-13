
import { CarePathway, CarePathwayType, ReferralPriority } from '@/types/referral';

export const carePathwayDefinitions: Record<CarePathwayType, { name: string; description: string; defaultTimeframe: string }> = {
  'cancer-two-week-wait': {
    name: 'Cancer Two Week Wait',
    description: 'Urgent referral for suspected cancer',
    defaultTimeframe: '14 days'
  },
  'urgent-suspected-cancer': {
    name: 'Urgent Suspected Cancer',
    description: 'Emergency cancer referral pathway',
    defaultTimeframe: '7 days'
  },
  'elective-surgery': {
    name: 'Elective Surgery Pathway',
    description: 'Planned surgical intervention',
    defaultTimeframe: '18 weeks'
  },
  'emergency-pathway': {
    name: 'Emergency Pathway',
    description: 'Immediate emergency care required',
    defaultTimeframe: '4 hours'
  },
  'chronic-disease-management': {
    name: 'Chronic Disease Management',
    description: 'Long-term condition management',
    defaultTimeframe: '6 weeks'
  },
  'diagnostic-pathway': {
    name: 'Diagnostic Pathway',
    description: 'Diagnostic investigation required',
    defaultTimeframe: '6 weeks'
  },
  'mental-health-pathway': {
    name: 'Mental Health Pathway',
    description: 'Mental health assessment and treatment',
    defaultTimeframe: '4 weeks'
  },
  'paediatric-pathway': {
    name: 'Paediatric Pathway',
    description: 'Specialist children\'s services',
    defaultTimeframe: '8 weeks'
  },
  'maternity-pathway': {
    name: 'Maternity Pathway',
    description: 'Pregnancy and maternity care',
    defaultTimeframe: '2 weeks'
  },
  'rehabilitation-pathway': {
    name: 'Rehabilitation Pathway',
    description: 'Recovery and rehabilitation services',
    defaultTimeframe: '12 weeks'
  },
  'end-of-life-care': {
    name: 'End of Life Care',
    description: 'Palliative and end of life care',
    defaultTimeframe: '48 hours'
  },
  'screening-programme': {
    name: 'Screening Programme',
    description: 'Preventive screening services',
    defaultTimeframe: '4 weeks'
  }
};

export const generateCarePathway = (
  specialty: string,
  priority: ReferralPriority,
  tags: string[] = []
): CarePathway | undefined => {
  // 85% chance of having a care pathway
  if (Math.random() > 0.85) return undefined;

  let pathwayType: CarePathwayType;
  let pathwayPriority: CarePathway['priority'] = 'routine';

  // Determine pathway based on tags first
  if (tags.includes('cancer-suspected') || tags.includes('two-week-wait')) {
    pathwayType = 'cancer-two-week-wait';
    pathwayPriority = 'urgent';
  } else if (tags.includes('emergency')) {
    pathwayType = 'emergency-pathway';
    pathwayPriority = 'emergency';
  } else if (tags.includes('screening')) {
    pathwayType = 'screening-programme';
    pathwayPriority = 'routine';
  } else {
    // Determine pathway based on specialty and priority
    switch (specialty.toLowerCase()) {
      case 'cardiology':
        if (priority === 'emergency') {
          pathwayType = 'emergency-pathway';
          pathwayPriority = 'emergency';
        } else if (priority === 'urgent') {
          pathwayType = 'urgent-suspected-cancer';
          pathwayPriority = 'urgent';
        } else {
          pathwayType = Math.random() > 0.5 ? 'chronic-disease-management' : 'diagnostic-pathway';
        }
        break;
      
      case 'dermatology':
        if (priority === 'urgent') {
          pathwayType = 'cancer-two-week-wait';
          pathwayPriority = 'urgent';
        } else {
          pathwayType = Math.random() > 0.7 ? 'screening-programme' : 'diagnostic-pathway';
        }
        break;
      
      case 'neurology':
        pathwayType = Math.random() > 0.6 ? 'diagnostic-pathway' : 'chronic-disease-management';
        break;
      
      case 'rheumatology':
        pathwayType = Math.random() > 0.5 ? 'chronic-disease-management' : 'diagnostic-pathway';
        break;
      
      case 'gastroenterology':
        if (priority === 'urgent') {
          pathwayType = Math.random() > 0.5 ? 'cancer-two-week-wait' : 'diagnostic-pathway';
          pathwayPriority = 'urgent';
        } else {
          pathwayType = Math.random() > 0.6 ? 'elective-surgery' : 'diagnostic-pathway';
        }
        break;
      
      case 'mental health':
        pathwayType = 'mental-health-pathway';
        if (priority === 'emergency') pathwayPriority = 'emergency';
        else if (priority === 'urgent') pathwayPriority = 'urgent';
        break;
      
      default:
        const pathwayTypes: CarePathwayType[] = [
          'diagnostic-pathway',
          'chronic-disease-management',
          'elective-surgery'
        ];
        pathwayType = pathwayTypes[Math.floor(Math.random() * pathwayTypes.length)];
    }
  }

  // Override priority based on referral priority if not already set
  if (pathwayPriority === 'routine') {
    if (priority === 'emergency') pathwayPriority = 'emergency';
    else if (priority === 'urgent') pathwayPriority = 'urgent';
  }

  const definition = carePathwayDefinitions[pathwayType];
  
  const statuses: CarePathway['status'][] = ['active', 'completed', 'paused', 'discontinued'];
  const weights = [0.7, 0.15, 0.1, 0.05]; // Most pathways are active
  
  let status: CarePathway['status'] = 'active';
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      status = statuses[i];
      break;
    }
  }

  return {
    type: pathwayType,
    name: definition.name,
    description: definition.description,
    priority: pathwayPriority,
    targetTimeframe: definition.defaultTimeframe,
    status
  };
};

export const formatCarePathwayName = (carePathway: CarePathway): string => {
  return carePathway.name;
};

export const getCarePathwayStatusColor = (status: CarePathway['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'discontinued':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCarePathwayPriorityColor = (priority: CarePathway['priority']): string => {
  switch (priority) {
    case 'emergency':
      return 'bg-red-100 text-red-800';
    case 'urgent':
      return 'bg-orange-100 text-orange-800';
    case 'routine':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
