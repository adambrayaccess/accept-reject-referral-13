import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, BedDouble, Calendar, MapPin, Activity } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { getInpatientAdmissionsByPatientId, type InpatientAdmission } from '@/services/inpatientService';

interface InpatientHistoryProps {
  patientId: string;
  refreshTrigger?: number;
}

const InpatientHistory = ({ patientId, refreshTrigger }: InpatientHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [admissions, setAdmissions] = useState<InpatientAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      setIsLoading(true);
      try {
        const data = await getInpatientAdmissionsByPatientId(patientId);
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching inpatient admissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmissions();
  }, [patientId, refreshTrigger]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Discharged':
        return 'secondary';
      case 'Transferred':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 mr-2" />
                Inpatient History
                {admissions.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {admissions.length}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Loading admission history...
              </p>
            ) : admissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No inpatient admission history found
              </p>
            ) : (
              <div className="space-y-4">
                {admissions.map((admission, index) => (
                  <div key={admission.id}>
                    <div className="space-y-3">
                      {/* Status and Location */}
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusBadgeVariant(admission.current_status)}>
                          <Activity className="h-3 w-3 mr-1" />
                          {admission.current_status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {admission.specialty}
                        </div>
                      </div>

                      {/* Ward and Bed Information */}
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{admission.ward_name}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <span className="text-muted-foreground">Location:</span>
                          <span>
                            {admission.bed_number || 'Not assigned'}{admission.bay_number && `, ${admission.bay_number}`}
                          </span>
                        </div>
                      </div>

                      {/* Admission Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Admitted:</div>
                            <div className="text-muted-foreground">
                              {format(new Date(admission.admission_datetime), 'dd MMM yyyy, HH:mm')}
                            </div>
                          </div>
                        </div>

                        {admission.discharge_datetime && (
                          <div className="flex items-start gap-2 ml-6">
                            <div>
                              <div className="font-medium">Discharged:</div>
                              <div className="text-muted-foreground">
                                {format(new Date(admission.discharge_datetime), 'dd MMM yyyy, HH:mm')}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="border-l-2 border-muted pl-4 ml-2">
                          <div className="font-medium">Reason:</div>
                          <div className="text-muted-foreground">
                            {admission.admission_reason}
                          </div>
                        </div>

                        {admission.consultant && (
                          <div className="text-muted-foreground ml-6">
                            <span className="font-medium">Consultant:</span> {admission.consultant}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < admissions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default InpatientHistory;