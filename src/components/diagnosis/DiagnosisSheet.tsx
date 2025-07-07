import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Diagnosis, fetchPatientDiagnoses } from '@/services/diagnosisService';
import { format } from 'date-fns';

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
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
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
      <SheetContent className="w-[600px] sm:w-[700px] max-w-full">
        <SheetHeader>
          <SheetTitle>Patient Diagnoses</SheetTitle>
          <SheetDescription>
            Medical diagnoses for {patientName}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading diagnoses...</div>
            </div>
          ) : diagnoses.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">No diagnoses found for this patient.</div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {diagnoses.map((diagnosis) => (
                <Card key={diagnosis.id} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold">
                        {diagnosis.clinical_description}
                      </CardTitle>
                      <div className="flex gap-2">
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
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">ICD-10:</span> {diagnosis.icd10_code}
                        {diagnosis.icd10_description && ` - ${diagnosis.icd10_description}`}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Diagnosed Date</div>
                        <div className="font-medium">
                          {format(new Date(diagnosis.diagnosed_date), 'PPP')}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Diagnosed By</div>
                        <div className="font-medium">{diagnosis.diagnosed_by}</div>
                      </div>

                      {diagnosis.resolved_date && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Resolved Date</div>
                          <div className="font-medium">
                            {format(new Date(diagnosis.resolved_date), 'PPP')}
                          </div>
                        </div>
                      )}
                    </div>

                    {diagnosis.notes && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">Notes</div>
                          <div className="text-sm whitespace-pre-line">{diagnosis.notes}</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DiagnosisSheet;