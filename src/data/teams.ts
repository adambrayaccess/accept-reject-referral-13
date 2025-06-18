
import { Team } from '@/types/team';
import { HealthcareProfessional } from '@/types/referral';
import { healthcareProfessionals } from './specialtyOptions';

// Enhanced healthcare professionals with team information
export const enhancedHealthcareProfessionals: HealthcareProfessional[] = healthcareProfessionals.map(hcp => ({
  ...hcp,
  teamIds: [], // Will be populated based on team memberships
  isTeamLead: false
}));

// Teams data organized by specialty
export const teams: Team[] = [
  // Cardiology Teams
  {
    id: 'team-card-01',
    name: 'Interventional Cardiology',
    specialtyId: 'card',
    description: 'Specialized team for interventional procedures including angioplasty and stenting',
    leadId: 'hp1', // Dr. Sarah Jones
    members: ['hp1', 'hp2'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 25
  },
  {
    id: 'team-card-02',
    name: 'Heart Failure Clinic',
    specialtyId: 'card',
    description: 'Comprehensive heart failure management and follow-up care',
    leadId: 'hp2', // Dr. Michael Chen
    members: ['hp2'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 20
  },

  // Dermatology Teams
  {
    id: 'team-derm-01',
    name: 'Skin Cancer Unit',
    specialtyId: 'derm',
    description: 'Specialized diagnosis and treatment of skin cancers',
    leadId: 'hp3', // Dr. Emma Wilson
    members: ['hp3', 'hp4'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 30
  },
  {
    id: 'team-derm-02',
    name: 'Pediatric Dermatology',
    specialtyId: 'derm',
    description: 'Specialized care for pediatric skin conditions',
    leadId: 'hp4', // Dr. James Smith
    members: ['hp4'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 15
  },

  // Neurology Teams
  {
    id: 'team-neur-01',
    name: 'Stroke Unit',
    specialtyId: 'neur',
    description: 'Acute stroke care and rehabilitation services',
    leadId: 'hp5', // Dr. Lisa Brown
    members: ['hp5', 'hp6'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 20
  },
  {
    id: 'team-neur-02',
    name: 'Epilepsy Clinic',
    specialtyId: 'neur',
    description: 'Comprehensive epilepsy diagnosis and management',
    leadId: 'hp6', // Dr. Robert Taylor
    members: ['hp6'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 18
  },

  // Mental Health Teams
  {
    id: 'team-mhea-01',
    name: 'Crisis Intervention Team',
    specialtyId: 'mhea',
    description: 'Emergency mental health crisis support and intervention',
    leadId: 'hp7', // Dr. Robert Taylor
    members: ['hp7', 'hp8'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 15
  },
  {
    id: 'team-mhea-02',
    name: 'Community Mental Health',
    specialtyId: 'mhea',
    description: 'Ongoing community-based mental health support',
    leadId: 'hp8', // Dr. Maria Lopez
    members: ['hp8'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 25
  },

  // Rheumatology Teams
  {
    id: 'team-rheu-01',
    name: 'Inflammatory Arthritis Clinic',
    specialtyId: 'rheu',
    description: 'Specialized care for inflammatory arthritis conditions',
    leadId: 'hp9', // Dr. Helen Davies
    members: ['hp9', 'hp10'],
    status: 'active',
    createdDate: '2024-01-15T00:00:00Z',
    capacity: 22
  }
];

// Helper functions
export const getTeamsBySpecialty = (specialtyId: string): Team[] => {
  return teams.filter(team => team.specialtyId === specialtyId && team.status === 'active');
};

export const getTeamById = (teamId: string): Team | undefined => {
  return teams.find(team => team.id === teamId);
};

export const getTeamsByHCP = (hcpId: string): Team[] => {
  return teams.filter(team => team.members.includes(hcpId));
};

export const getHCPsByTeam = (teamId: string): HealthcareProfessional[] => {
  const team = getTeamById(teamId);
  if (!team) return [];
  
  return enhancedHealthcareProfessionals.filter(hcp => team.members.includes(hcp.id));
};

export const isTeamLead = (hcpId: string, teamId: string): boolean => {
  const team = getTeamById(teamId);
  return team?.leadId === hcpId;
};

// Update enhanced healthcare professionals with team information
teams.forEach(team => {
  team.members.forEach(memberId => {
    const hcp = enhancedHealthcareProfessionals.find(h => h.id === memberId);
    if (hcp) {
      if (!hcp.teamIds) hcp.teamIds = [];
      hcp.teamIds.push(team.id);
      if (team.leadId === memberId) {
        hcp.isTeamLead = true;
      }
    }
  });
});
