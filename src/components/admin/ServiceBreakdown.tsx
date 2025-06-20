
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceStats } from '@/hooks/useAdminStatistics';

interface ServiceBreakdownProps {
  serviceStats: ServiceStats[];
  currentService: string | null;
  onServiceSelect?: (service: string) => void;
}

const ServiceBreakdown = ({ 
  serviceStats, 
  currentService, 
  onServiceSelect 
}: ServiceBreakdownProps) => {
  const handleServiceClick = (serviceName: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceName);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceStats.map((stat) => (
            <div
              key={stat.service}
              className={`p-4 border rounded-lg transition-colors ${
                currentService === stat.service 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{stat.service}</h3>
                {onServiceSelect && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleServiceClick(stat.service)}
                  >
                    View
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Referrals:</span>
                  <Badge variant="secondary">{stat.total}</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>New:</span>
                  <Badge variant="default">{stat.new}</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Accepted:</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {stat.accepted}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Rejected:</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {stat.rejected}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceBreakdown;
