
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentAnalysisProgressProps {
  files: File[];
  currentFileIndex: number;
  progress: number;
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;
}

const DocumentAnalysisProgress = ({
  files,
  currentFileIndex,
  progress,
  isComplete,
  hasError,
  errorMessage
}: DocumentAnalysisProgressProps) => {
  const currentFile = files[currentFileIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${isComplete ? 'text-green-600' : hasError ? 'text-red-600' : 'animate-pulse text-blue-600'}`} />
          AI Document Analysis
          {isComplete && <Badge variant="outline" className="text-green-600 border-green-600">Complete</Badge>}
          {hasError && <Badge variant="outline" className="text-red-600 border-red-600">Error</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasError ? (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errorMessage || 'Analysis failed'}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span>
                {isComplete ? 'Analysis complete' : `Analyzing document ${currentFileIndex + 1} of ${files.length}`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            {currentFile && !isComplete && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Processing: {currentFile.name}</span>
              </div>
            )}
            
            {isComplete && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>Successfully analyzed {files.length} document{files.length > 1 ? 's' : ''}</span>
              </div>
            )}
            
            <div className="space-y-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className={`h-2 w-2 rounded-full ${
                    index < currentFileIndex ? 'bg-green-500' : 
                    index === currentFileIndex ? 'bg-blue-500 animate-pulse' : 
                    'bg-gray-300'
                  }`} />
                  <span className={
                    index < currentFileIndex ? 'text-green-600' : 
                    index === currentFileIndex ? 'text-blue-600' : 
                    'text-muted-foreground'
                  }>
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisProgress;
