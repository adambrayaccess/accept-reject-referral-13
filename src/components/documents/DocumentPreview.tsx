
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Eye, X } from 'lucide-react';
import { DocumentAnalysisResult } from '@/services/documentAnalysisService';

interface DocumentPreviewProps {
  file: File;
  analysisResult?: DocumentAnalysisResult;
  onRemove: () => void;
}

const DocumentPreview = ({ file, analysisResult, onRemove }: DocumentPreviewProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 border-green-600';
    if (confidence >= 0.6) return 'text-yellow-600 border-yellow-600';
    return 'text-red-600 border-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {formatFileSize(file.size)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {analysisResult && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getConfidenceColor(analysisResult.confidence)}`}
              >
                {Math.round(analysisResult.confidence * 100)}% confidence
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {analysisResult && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Extracted Information Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {analysisResult.patientInfo.name && (
                <div>
                  <span className="font-medium text-muted-foreground">Patient:</span>
                  <div>{analysisResult.patientInfo.name}</div>
                </div>
              )}
              
              {analysisResult.referralInfo.specialty && (
                <div>
                  <span className="font-medium text-muted-foreground">Specialty:</span>
                  <div>{analysisResult.referralInfo.specialty}</div>
                </div>
              )}
              
              {analysisResult.referralInfo.priority && (
                <div>
                  <span className="font-medium text-muted-foreground">Priority:</span>
                  <div className="capitalize">{analysisResult.referralInfo.priority}</div>
                </div>
              )}
              
              {analysisResult.clinicalInfo.reason && (
                <div>
                  <span className="font-medium text-muted-foreground">Reason:</span>
                  <div className="truncate">{analysisResult.clinicalInfo.reason}</div>
                </div>
              )}
            </div>
            
            {/* Extracted Text Preview */}
            {analysisResult.extractedText && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Extracted Text:</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Full
                  </Button>
                </div>
                <ScrollArea className="h-16 w-full rounded border">
                  <div className="p-2 text-xs text-muted-foreground">
                    {analysisResult.extractedText.substring(0, 200)}
                    {analysisResult.extractedText.length > 200 && '...'}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DocumentPreview;
