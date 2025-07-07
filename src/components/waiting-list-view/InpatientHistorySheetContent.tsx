import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Calendar, MapPin, Activity } from 'lucide-react';
import { getInpatientAdmissionsByPatientId, type InpatientAdmission } from '@/services/inpatientService';

interface InpatientHistorySheetContentProps {
  patientId: string;
  refreshTrigger?: number;
}

const InpatientHistorySheetContent = ({ patientId, refreshTrigger }: InpatientHistorySheetContentProps) => {
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
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex-1 min-h-0 rounded-md border">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Loading admission history...
              </p>
            </div>
          ) : admissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No inpatient admission history found
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {admissions.map((admission, index) => (
                <Card key={admission.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default InpatientHistorySheetContent;