import { Badge } from '@/components/ui/badge';
import { fetchHCPById } from '@/services/hcpService';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
interface HCPBadgeProps {
  hcpId: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'secondary' | 'outline';
}
const HCPBadge = ({
  hcpId,
  size = 'sm',
  showIcon = true,
  variant = 'secondary'
}: HCPBadgeProps) => {
  const [hcp, setHcp] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadHCP = async () => {
      try {
        const hcpData = await fetchHCPById(hcpId);
        setHcp(hcpData);
      } catch (error) {
        console.error('Error loading HCP:', error);
        setHcp(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (hcpId) {
      loadHCP();
    } else {
      setIsLoading(false);
    }
  }, [hcpId]);
  if (isLoading) {
    return <Badge variant="outline" className="text-xs">
        Loading...
      </Badge>;
  }
  if (!hcp) {
    return <Badge variant="outline" className="text-xs bg-transparent">
        Unknown HCP
      </Badge>;
  }
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return <Badge variant={variant} className={`${sizeClasses[size]} flex items-center gap-1`}>
      {showIcon && <User className="h-3 w-3" />}
      <span>{hcp.name}</span>
      {hcp.role && <span className="text-xs opacity-75">({hcp.role})</span>}
    </Badge>;
};
export default HCPBadge;