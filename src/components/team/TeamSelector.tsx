
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/types/team';
import { HealthcareProfessional } from '@/types/referral';
import { getTeamsBySpecialty, getHCPsByTeam } from '@/data/teams';
import { Users, UserCheck } from 'lucide-react';

interface TeamSelectorProps {
  specialtyId: string;
  selectedTeamId?: string;
  selectedHCPId?: string;
  onTeamChange: (teamId: string) => void;
  onHCPChange: (hcpId: string) => void;
  disabled?: boolean;
}

const TeamSelector = ({ 
  specialtyId, 
  selectedTeamId, 
  selectedHCPId,
  onTeamChange, 
  onHCPChange,
  disabled = false 
}: TeamSelectorProps) => {
  const [showHCPSelector, setShowHCPSelector] = useState(false);
  
  const availableTeams = getTeamsBySpecialty(specialtyId);
  const availableHCPs = selectedTeamId ? getHCPsByTeam(selectedTeamId) : [];

  const handleTeamChange = (teamId: string) => {
    onTeamChange(teamId);
    setShowHCPSelector(true);
    // Reset HCP selection when team changes
    if (selectedHCPId) {
      onHCPChange('');
    }
  };

  const selectedTeam = availableTeams.find(team => team.id === selectedTeamId);
  const selectedHCP = availableHCPs.find(hcp => hcp.id === selectedHCPId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Team</label>
            <Select 
              value={selectedTeamId || ''} 
              onValueChange={handleTeamChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a team" />
              </SelectTrigger>
              <SelectContent>
                {availableTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{team.name}</span>
                      {team.description && (
                        <span className="text-xs text-muted-foreground">
                          {team.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTeam && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Team Details</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedTeam.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {selectedTeam.members.length} members
                </Badge>
              </div>
              {selectedTeam.capacity && (
                <div className="text-xs text-muted-foreground">
                  Capacity: {selectedTeam.capacity} referrals
                </div>
              )}
            </div>
          )}

          {showHCPSelector && availableHCPs.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-3 w-3" />
                Assign to Healthcare Professional (Optional)
              </label>
              <Select 
                value={selectedHCPId || ''} 
                onValueChange={onHCPChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to team member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">Keep unassigned to team</span>
                  </SelectItem>
                  {availableHCPs.map((hcp) => (
                    <SelectItem key={hcp.id} value={hcp.id}>
                      <div className="flex items-center gap-2">
                        <span>{hcp.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {hcp.role}
                        </Badge>
                        {hcp.isTeamLead && (
                          <Badge variant="default" className="text-xs">
                            Lead
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedHCP && (
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-muted-foreground">Assigned to</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedHCP.name}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedHCP.role}
                </Badge>
                {selectedHCP.isTeamLead && (
                  <Badge variant="default" className="text-xs">
                    Team Lead
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSelector;
