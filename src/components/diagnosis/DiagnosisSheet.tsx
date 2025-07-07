import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Diagnosis, fetchPatientDiagnoses } from '@/services/diagnosisService';
import { format } from 'date-fns';
import { FileText, AlertTriangle, Calendar, User2, Activity, ClipboardPlus, Stethoscope } from 'lucide-react';

interface DiagnosisSheetProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const DiagnosisSheet = ({ isOpen, onClose, patientId, patientName }: DiagnosisSheetProps) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      loadDiagnoses();
    }
  }, [isOpen, patientId]);

  const loadDiagnoses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPatientDiagnoses(patientId);
      setDiagnoses(data);
    } catch (error) {
      console.error('Error loading diagnoses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'chronic':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
      case 'resolved':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
      case 'suspected':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
      case 'ruled_out':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
      case 'severe':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80';
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Stethoscope className="h-6 w-6" />
            Patient Diagnoses
          </SheetTitle>
          <SheetDescription className="text-base">
            Medical diagnoses and clinical history{patientName ? ` for ${patientName}` : ''}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="pr-4">
            {isLoading ? (
              <div className="space-y-6 pb-6">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-24" />
                <Skeleton className="w-full h-40" />
                <Skeleton className="w-full h-32" />
              </div>
            ) : diagnoses.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No diagnoses found for this patient.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6 pb-6">
                {diagnoses.map((diagnosis) => (
                  <Card key={diagnosis.id} className="border-l-4 border-l-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {diagnosis.clinical_description}
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(diagnosis.status)}
                          >
                            {diagnosis.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {diagnosis.severity && (
                            <Badge 
                              variant="outline" 
                              className={getSeverityColor(diagnosis.severity)}
                            >
                              {diagnosis.severity.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {diagnosis.icd10_code && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="font-mono">
                            ICD-10: {diagnosis.icd10_code}
                          </Badge>
                          {diagnosis.icd10_description && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {diagnosis.icd10_description}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Diagnosed {format(new Date(diagnosis.diagnosed_date), 'dd MMMM yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{diagnosis.diagnosed_by}</span>
                        </div>

                        {diagnosis.resolved_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Resolved {format(new Date(diagnosis.resolved_date), 'dd MMMM yyyy')}
                            </span>
                          </div>
                        )}
                      </div>

                      {diagnosis.notes && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs font-medium text-muted-foreground mb-1">Clinical Notes</div>
                          <div className="text-sm whitespace-pre-line">{diagnosis.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DiagnosisSheet;
