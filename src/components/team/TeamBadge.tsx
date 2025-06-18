
import { Badge } from '@/components/ui/badge';
import { getTeamById } from '@/data/teams';
import { Users } from 'lucide-react';

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
  const team = getTeamById(teamId);
  
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
