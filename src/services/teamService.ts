import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/types/team';

export interface DatabaseTeam {
  id: string;
  name: string;
  description?: string;
  specialty: string;
  lead_contact?: string;
  email?: string;
  phone?: string;
  location?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchAllTeams = async (): Promise<Team[]> => {
  try {
    console.log('Fetching all teams from database');
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} teams`);
    
    // Map database teams to Team interface
    return data?.map(team => ({
      id: team.id,
      name: team.name,
      specialtyId: team.specialty, // Map specialty to specialtyId
      description: team.description,
      leadId: team.lead_contact, // This could be enhanced to link to HCP IDs
      members: [], // Will be populated from HCP table separately
      status: team.active ? 'active' : 'inactive',
      createdDate: team.created_at,
      capacity: undefined // Not in database yet, could be added later
    })) || [];
  } catch (error) {
    console.error('Unexpected error fetching teams:', error);
    return [];
  }
};

export const fetchTeamsBySpecialty = async (specialty: string): Promise<Team[]> => {
  try {
    console.log('Fetching teams by specialty:', specialty);
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('specialty', specialty)
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching teams by specialty:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} teams for specialty: ${specialty}`);
    
    return data?.map(team => ({
      id: team.id,
      name: team.name,
      specialtyId: team.specialty,
      description: team.description,
      leadId: team.lead_contact,
      members: [], // Will be populated from HCP table
      status: team.active ? 'active' : 'inactive',
      createdDate: team.created_at,
      capacity: undefined
    })) || [];
  } catch (error) {
    console.error('Unexpected error fetching teams by specialty:', error);
    return [];
  }
};

export const fetchTeamById = async (teamId: string): Promise<Team | null> => {
  try {
    console.log('Fetching team by ID:', teamId);
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error) {
      console.error('Error fetching team by ID:', error);
      return null;
    }

    console.log('Successfully fetched team:', data?.name);
    
    return {
      id: data.id,
      name: data.name,
      specialtyId: data.specialty,
      description: data.description,
      leadId: data.lead_contact,
      members: [], // Will be populated from HCP table
      status: data.active ? 'active' : 'inactive',
      createdDate: data.created_at,
      capacity: undefined
    };
  } catch (error) {
    console.error('Unexpected error fetching team by ID:', error);
    return null;
  }
};

export const fetchHCPsByTeam = async (teamId: string) => {
  try {
    console.log('Fetching HCPs by team ID:', teamId);
    
    const { data, error } = await supabase
      .from('hcp')
      .select('*')
      .eq('team_id', teamId)
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching HCPs by team:', error);
      return [];
    }

    console.log(`Successfully fetched ${data?.length || 0} HCPs for team: ${teamId}`);
    
    return data?.map(hcp => ({
      id: hcp.id,
      name: hcp.name,
      role: hcp.role || 'Healthcare Professional',
      specialty: '', // Not needed for team selection
      isTeamLead: false, // Could be enhanced
      teamIds: [teamId]
    })) || [];
  } catch (error) {
    console.error('Unexpected error fetching HCPs by team:', error);
    return [];
  }
};

export const assignHCPToTeam = async (hcpId: string, teamId: string): Promise<boolean> => {
  try {
    console.log('Assigning HCP to team:', { hcpId, teamId });
    
    const { error } = await supabase
      .from('hcp')
      .update({ team_id: teamId })
      .eq('id', hcpId);

    if (error) {
      console.error('Error assigning HCP to team:', error);
      return false;
    }

    console.log('Successfully assigned HCP to team');
    return true;
  } catch (error) {
    console.error('Unexpected error assigning HCP to team:', error);
    return false;
  }
};

export const removeHCPFromTeam = async (hcpId: string): Promise<boolean> => {
  try {
    console.log('Removing HCP from team:', hcpId);
    
    const { error } = await supabase
      .from('hcp')
      .update({ team_id: null })
      .eq('id', hcpId);

    if (error) {
      console.error('Error removing HCP from team:', error);
      return false;
    }

    console.log('Successfully removed HCP from team');
    return true;
  } catch (error) {
    console.error('Unexpected error removing HCP from team:', error);
    return false;
  }
};