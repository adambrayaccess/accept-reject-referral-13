
import { Badge } from '@/components/ui/badge';
import { fetchTeamById } from '@/services/teamService';
import { Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Team } from '@/types/team';

interface TeamBadgeProps {
  teamId: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'secondary' | 'outline';
}

const TeamBadge = ({ 
  teamId, 
  size = 'sm', 
  showIcon = true,
  variant = 'secondary' 
}: TeamBadgeProps) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const teamData = await fetchTeamById(teamId);
        setTeam(teamData);
      } catch (error) {
        console.error('Error loading team:', error);
        setTeam(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      loadTeam();
    } else {
      setIsLoading(false);
    }
  }, [teamId]);

  if (isLoading) {
    return (
      <Badge variant="outline" className="text-xs">
        Loading...
      </Badge>
    );
  }
  
  if (!team) {
    return (
      <Badge variant="outline" className="text-xs">
        Unknown Team
      </Badge>
    );
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <Badge variant={variant} className={`${sizeClasses[size]} flex items-center gap-1`}>
      {showIcon && <Users className="h-3 w-3" />}
      <span>{team.name}</span>
    </Badge>
  );
};

export default TeamBadge;
