import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Referral, ReferralPriority } from '@/types/referral';
import { Bot, Sparkles, FileText, User, Clock, AlertTriangle, Upload, Wand2 } from 'lucide-react';
import { mockPractitioners } from '@/services/mock/practitioners';
import { analyzeDocument, mergeAnalysisResults, DocumentAnalysisResult } from '@/services/documentAnalysisService';
import DocumentAnalysisProgress from '@/components/documents/DocumentAnalysisProgress';
import DocumentPreview from '@/components/documents/DocumentPreview';

interface AutoReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const AutoReferralModal = ({ isOpen, onClose, onSubmit }: AutoReferralModalProps) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  // Document upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<DocumentAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalyzingIndex, setCurrentAnalyzingIndex] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();

  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 10MB`;
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "File Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setAnalysisResults(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeDocuments = async () => {
    if (uploadedFiles.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalyzingIndex(0);
    setAnalysisError(null);
    setAnalysisResults([]);

    try {
      const results: DocumentAnalysisResult[] = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        setCurrentAnalyzingIndex(i);
        
        const result = await analyzeDocument(uploadedFiles[i]);
        results.push(result);
        
        setAnalysisProgress(((i + 1) / uploadedFiles.length) * 100);
      }

      setAnalysisResults(results);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${uploadedFiles.length} document${uploadedFiles.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Document analysis error:', error);
      setAnalysisError('Failed to analyze documents. Please try again.');
      toast({
        title: "Analysis Error",
        description: "Failed to analyze documents",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFromDocuments = async () => {
    if (analysisResults.length === 0) {
      toast({
        title: "No Analysis Results",
        description: "Please analyze documents first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate generation with progress
    const progressSteps = [
      { progress: 20, message: "Merging document analysis results..." },
      { progress: 40, message: "Extracting patient information..." },
      { progress: 60, message: "Generating clinical summary..." },
      { progress: 80, message: "Determining referral priority..." },
      { progress: 100, message: "Finalizing referral data..." },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setGenerationProgress(step.progress);
    }

    try {
      // Merge analysis results from multiple documents
      const mergedAnalysis = mergeAnalysisResults(analysisResults);
      
      // Generate referral data based on merged analysis
      const mockGenerated = generateReferralFromAnalysis(mergedAnalysis);
      setGeneratedData(mockGenerated);

      toast({
        title: "Referral Generated",
        description: "AI has successfully generated the referral from documents",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate referral from documents",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReferralFromAnalysis = (analysis: DocumentAnalysisResult) => {
    const currentDate = new Date().toISOString();
    const referralId = `DOC-${Date.now()}`;

    return {
      id: referralId,
      created: currentDate,
      status: 'new',
      priority: analysis.referralInfo.priority || 'routine',
      specialty: analysis.referralInfo.specialty || 'General Medicine',
      referrer: mockPractitioners[0],
      patient: {
        id: `DOC-P-${Date.now()}`,
        name: analysis.patientInfo.name || 'Patient from Document',
        birthDate: analysis.patientInfo.birthDate || '1980-01-01',
        gender: analysis.patientInfo.gender || 'unknown',
        nhsNumber: analysis.patientInfo.nhsNumber || `DOC ${Math.random().toString().substr(2, 9)}`,
        address: analysis.patientInfo.address || 'Address extracted from documents',
        phone: analysis.patientInfo.phone || 'Phone extracted from documents',
      },
      clinicalInfo: {
        reason: analysis.clinicalInfo.reason || 'Clinical assessment required based on uploaded documents',
        history: analysis.clinicalInfo.history || 'Medical history extracted from uploaded documents',
        diagnosis: analysis.clinicalInfo.diagnosis || 'Assessment pending based on document review',
        medications: analysis.clinicalInfo.medications || [],
        allergies: analysis.clinicalInfo.allergies || [],
        notes: `${analysis.clinicalInfo.notes || 'Generated from document analysis'}\n\nExtracted from ${analysisResults.length} document(s) on ${new Date().toLocaleDateString()}`,
      },
      attachments: [],
      confidence: Math.round(analysis.confidence * 100),
      aiGenerated: true,
      documentAnalysis: {
        analyzedDocuments: uploadedFiles.length,
        extractedText: analysis.extractedText,
        processingTime: analysis.processingTime
      }
    };
  };

  const handleGenerate = async () => {
    if (!patientInfo.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide patient information to generate the referral",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation with progress
    const progressSteps = [
      { progress: 20, message: "Analyzing patient information..." },
      { progress: 40, message: "Extracting clinical details..." },
      { progress: 60, message: "Determining priority and urgency..." },
      { progress: 80, message: "Generating referral content..." },
      { progress: 100, message: "Finalizing referral..." },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(step.progress);
    }

    // Generate mock data based on input
    const mockGenerated = generateMockReferralData(patientInfo, specialty);
    setGeneratedData(mockGenerated);
    setIsGenerating(false);

    toast({
      title: "Referral Generated",
      description: "AI has successfully generated the referral details",
    });
  };

  const generateMockReferralData = (info: string, targetSpecialty: string) => {
    const currentDate = new Date().toISOString();
    const referralId = `AUTO-${Date.now()}`;
    
    // Extract patient name from input (simple extraction)
    const nameMatch = info.match(/(?:patient|name|called)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
    const extractedName = nameMatch ? nameMatch[1] : "Generated Patient";
    
    // Determine priority based on keywords
    let priority: ReferralPriority = 'routine';
    if (info.toLowerCase().includes('urgent') || info.toLowerCase().includes('emergency')) {
      priority = 'urgent';
    } else if (info.toLowerCase().includes('pain') || info.toLowerCase().includes('severe')) {
      priority = 'urgent';
    }

    // Determine specialty if not provided
    let determinedSpecialty = targetSpecialty;
    if (!determinedSpecialty) {
      if (info.toLowerCase().includes('heart') || info.toLowerCase().includes('cardiac')) {
        determinedSpecialty = 'Cardiology';
      } else if (info.toLowerCase().includes('skin') || info.toLowerCase().includes('rash')) {
        determinedSpecialty = 'Dermatology';
      } else if (info.toLowerCase().includes('joint') || info.toLowerCase().includes('arthritis')) {
        determinedSpecialty = 'Rheumatology';
      } else {
        determinedSpecialty = 'General Medicine';
      }
    }

    return {
      id: referralId,
      created: currentDate,
      status: 'new',
      priority,
      specialty: determinedSpecialty,
      referrer: mockPractitioners[0], // Default to first practitioner
      patient: {
        id: `AUTO-P-${Date.now()}`,
        name: extractedName,
        birthDate: '1980-01-01', // Default
        gender: 'unknown',
        nhsNumber: `AUTO ${Math.random().toString().substr(2, 9)}`,
        address: 'Address to be confirmed',
        phone: 'Phone to be confirmed',
      },
      clinicalInfo: {
        reason: `Auto-generated referral based on: ${info.substring(0, 100)}...`,
        history: 'Clinical history extracted from provided information',
        diagnosis: 'Preliminary assessment pending specialist review',
        medications: [],
        allergies: [],
        notes: `Generated using AI assistance on ${new Date().toLocaleDateString()}`,
      },
      attachments: [],
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
      aiGenerated: true,
    };
  };

  const handleSubmit = () => {
    if (!generatedData) {
      toast({
        title: "No Data",
        description: "Please generate referral data first",
        variant: "destructive",
      });
      return;
    }

    onSubmit(generatedData);
    toast({
      title: "Auto Referral Created",
      description: `AI-generated referral ${generatedData.id} has been created`,
    });
    onClose();
    
    // Reset form
    setPatientInfo('');
    setSpecialty('');
    setGeneratedData(null);
    setGenerationProgress(0);
    setUploadedFiles([]);
    setAnalysisResults([]);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setPatientInfo('');
    setSpecialty('');
    setGeneratedData(null);
    setGenerationProgress(0);
    setUploadedFiles([]);
    setAnalysisResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Add Auto Referral
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <EnhancedTabs defaultValue="documents" className="w-full">
          <EnhancedTabsList variant="grid" size="md">
            <EnhancedTabsTrigger value="documents" variant="grid" size="md">Upload Documents</EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="input" variant="grid" size="md">Text Input</EnhancedTabsTrigger>
            <EnhancedTabsTrigger value="review" variant="grid" size="md" disabled={!generatedData}>Review & Submit</EnhancedTabsTrigger>
          </EnhancedTabsList>
          
          <EnhancedTabsContent value="documents" className="space-y-6">
            <div className="space-y-4">
              {/* Document Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop referral documents here, or click to browse
                </p>
                <Input
                  type="file"
                  multiple
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="document-upload"
                />
                <Label htmlFor="document-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Browse Documents</span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each)
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Uploaded Documents ({uploadedFiles.length})</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={analyzeDocuments}
                        disabled={isAnalyzing || analysisResults.length === uploadedFiles.length}
                        size="sm"
                        variant="outline"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
                      </Button>
                      {analysisResults.length > 0 && (
                        <Button
                          onClick={generateFromDocuments}
                          disabled={isGenerating}
                          size="sm"
                        >
                          <Wand2 className="h-3 w-3 mr-1" />
                          Generate Referral
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <DocumentAnalysisProgress
                      files={uploadedFiles}
                      currentFileIndex={currentAnalyzingIndex}
                      progress={analysisProgress}
                      isComplete={false}
                      hasError={!!analysisError}
                      errorMessage={analysisError}
                    />
                  )}

                  {/* Document Previews */}
                  <div className="grid gap-3">
                    {uploadedFiles.map((file, index) => (
                      <DocumentPreview
                        key={index}
                        file={file}
                        analysisResult={analysisResults[index]}
                        onRemove={() => removeFile(index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Generation Progress for Documents */}
              {isGenerating && uploadedFiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="h-4 w-4 animate-pulse" />
                      Generating Referral from Documents...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Processing {analysisResults.length} analyzed documents and generating structured referral data...
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="input" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientInfo">Patient Information</Label>
                <Textarea
                  id="patientInfo"
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  placeholder="Enter patient information in natural language. For example: 'Patient John Smith, 45 years old, presenting with chest pain and shortness of breath. History of hypertension. Needs cardiology review urgently.'"
                  rows={6}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Target Specialty (Optional)</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="AI will determine if not specified" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Rheumatology">Rheumatology</SelectItem>
                    <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isGenerating && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="h-4 w-4 animate-pulse" />
                      Generating Referral...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Processing patient information and generating structured referral data...
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !patientInfo.trim()}
                  className="flex-1"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate Referral'}
                </Button>
              </div>
            </div>
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="review" className="space-y-6">
            {generatedData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Generated Referral Review</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    {generatedData.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Name:</strong> {generatedData.patient.name}</div>
                      <div><strong>NHS Number:</strong> {generatedData.patient.nhsNumber}</div>
                      <div><strong>DOB:</strong> {generatedData.patient.birthDate}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Referral Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>ID:</strong> {generatedData.id}</div>
                      <div><strong>Specialty:</strong> {generatedData.specialty}</div>
                      <div className="flex items-center gap-2">
                        <strong>Priority:</strong> 
                        <Badge variant={generatedData.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {generatedData.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {generatedData.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Clinical Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Reason:</strong> {generatedData.clinicalInfo.reason}</div>
                      <div><strong>History:</strong> {generatedData.clinicalInfo.history}</div>
                      <div><strong>Notes:</strong> {generatedData.clinicalInfo.notes}</div>
                    </div>
                  </CardContent>
                </Card>

                {generatedData.documentAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Document Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><strong>Documents Analyzed:</strong> {generatedData.documentAnalysis.analyzedDocuments}</div>
                        <div><strong>Processing Time:</strong> {generatedData.documentAnalysis.processingTime}ms</div>
                        <div><strong>Source:</strong> Generated from uploaded documents using AI analysis</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </EnhancedTabsContent>
        </EnhancedTabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          {generatedData && (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Create Auto Referral
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoReferralModal;
