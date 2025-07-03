
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
import { Brain, Sparkles, FileText, User, Clock, AlertTriangle, Upload, Wand2 } from 'lucide-react';
import { mockPractitioners } from '@/services/mock/practitioners';
import { analyzeDocument, mergeAnalysisResults, DocumentAnalysisResult } from '@/services/documentAnalysisService';
import DocumentAnalysisProgress from '@/components/documents/DocumentAnalysisProgress';
import DocumentPreview from '@/components/documents/DocumentPreview';
import { ReferralCreationService, ReferralCreationData } from '@/services/referral/referralCreationService';
import { generateReferralId } from '@/utils/referralIdGenerator';
import { Patient } from '@/types/patient';

interface AutoReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const AutoReferralModal = ({ isOpen, onClose, onSubmit }: AutoReferralModalProps) => {
  const [patientInfo, setPatientInfo] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const referralId = generateReferralId();

    return {
      id: referralId,
      created: currentDate,
      status: 'new',
      priority: analysis.referralInfo.priority || 'routine',
      specialty: analysis.referralInfo.specialty || 'General Medicine',
      referrer: mockPractitioners[0],
      patient: {
        id: generateReferralId(), // Generate proper patient ID
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
    const referralId = generateReferralId();
    
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
        id: generateReferralId(), // Generate proper patient ID
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

  const handleSubmit = async () => {
    if (!generatedData) {
      toast({
        title: "No Data",
        description: "Please generate referral data first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert generated data to ReferralCreationData format
      const patientData: Patient = {
        id: generateReferralId(), // Generate proper ID
        name: generatedData.patient.name,
        birthDate: generatedData.patient.birthDate,
        gender: generatedData.patient.gender,
        nhsNumber: generatedData.patient.nhsNumber,
        address: generatedData.patient.address,
        phone: generatedData.patient.phone,
        active: true
      };

      const creationData: ReferralCreationData = {
        patient: patientData,
        practitionerId: generatedData.referrer.id,
        priority: generatedData.priority,
        specialty: generatedData.specialty,
        service: generatedData.service,
        reason: generatedData.clinicalInfo.reason,
        history: generatedData.clinicalInfo.history,
        diagnosis: generatedData.clinicalInfo.diagnosis,
        medications: generatedData.clinicalInfo.medications || [],
        allergies: generatedData.clinicalInfo.allergies || [],
        notes: generatedData.clinicalInfo.notes,
        attachments: generatedData.attachments || [],
        aiGenerated: true,
        confidence: generatedData.confidence,
        referralType: 'AI-Generated Referral'
      };

      // Create referral using the service
      const result = await ReferralCreationService.createReferral(creationData);

      if (result.success && result.referral) {
        toast({
          title: "Auto Referral Created",
          description: `AI-generated referral ${result.referral.ubrn} has been saved to the database`,
        });
        
        // Call the parent callback with the created referral
        onSubmit(result.referral);
        onClose();
        
        // Reset form
        setPatientInfo('');
        setSpecialty('');
        setGeneratedData(null);
        setGenerationProgress(0);
        setUploadedFiles([]);
        setAnalysisResults([]);
      } else {
        toast({
          title: "Creation Failed",
          description: result.error || "Failed to create referral in database",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating auto referral:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the referral",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <DialogHeader className="pb-4 border-b border-purple-100">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent font-semibold">
              AI Pilot Referral Generator
            </span>
            <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300 font-medium">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <EnhancedTabs defaultValue="documents" className="w-full">
          <EnhancedTabsList variant="grid" size="md" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <EnhancedTabsTrigger 
              value="documents" 
              variant="grid" 
              size="md"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger 
              value="input" 
              variant="grid" 
              size="md"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200"
            >
              <FileText className="h-4 w-4 mr-2" />
              Text Input
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger 
              value="review" 
              variant="grid" 
              size="md" 
              disabled={!generatedData}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200 disabled:opacity-50"
            >
              <User className="h-4 w-4 mr-2" />
              Review & Submit
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          
          <EnhancedTabsContent value="documents" className="space-y-6">
            <div className="space-y-4">
              {/* Document Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg' 
                    : 'border-purple-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-25 hover:to-purple-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 w-fit mx-auto mb-4">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-sm text-purple-700 mb-2 font-medium">
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                  >
                    <span>Browse Documents</span>
                  </Button>
                </Label>
                <p className="text-xs text-purple-600 mt-2">
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB each)
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-purple-800">Uploaded Documents ({uploadedFiles.length})</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={analyzeDocuments}
                        disabled={isAnalyzing || analysisResults.length === uploadedFiles.length}
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Documents'}
                      </Button>
                      {analysisResults.length > 0 && (
                        <Button
                          onClick={generateFromDocuments}
                          disabled={isGenerating}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
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
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-800">
                      <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                      Generating Referral from Documents...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={generationProgress} className="w-full [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-600" />
                    <p className="text-sm text-purple-600 mt-2">
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
                <Label htmlFor="patientInfo" className="text-purple-800 font-medium">Patient Information</Label>
                <Textarea
                  id="patientInfo"
                  value={patientInfo}
                  onChange={(e) => setPatientInfo(e.target.value)}
                  placeholder="Enter patient information in natural language. For example: 'Patient John Smith, 45 years old, presenting with chest pain and shortness of breath. History of hypertension. Needs cardiology review urgently.'"
                  rows={6}
                  className="resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-purple-800 font-medium">Target Specialty (Optional)</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                    <SelectValue placeholder="AI will determine if not specified" />
                  </SelectTrigger>
                  <SelectContent className="border-purple-200">
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
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-800">
                      <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                      Generating Referral...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={generationProgress} className="w-full [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-600" />
                    <p className="text-sm text-purple-600 mt-2">
                      Processing patient information and generating structured referral data...
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !patientInfo.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
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
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800">Generated Referral Review</h3>
                  <Badge className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300">
                    <Brain className="h-3 w-3" />
                    {generatedData.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-800">
                        <User className="h-4 w-4" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div><strong className="text-purple-700">Name:</strong> {generatedData.patient.name}</div>
                      <div><strong className="text-purple-700">NHS Number:</strong> {generatedData.patient.nhsNumber}</div>
                      <div><strong className="text-purple-700">DOB:</strong> {generatedData.patient.birthDate}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-800">
                        <FileText className="h-4 w-4" />
                        Referral Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div><strong className="text-purple-700">ID:</strong> {generatedData.id}</div>
                      <div><strong className="text-purple-700">Specialty:</strong> {generatedData.specialty}</div>
                      <div className="flex items-center gap-2">
                        <strong className="text-purple-700">Priority:</strong> 
                        <Badge variant={generatedData.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {generatedData.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {generatedData.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardTitle className="text-sm text-purple-800">Clinical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div><strong className="text-purple-700">Reason:</strong> {generatedData.clinicalInfo.reason}</div>
                      <div><strong className="text-purple-700">History:</strong> {generatedData.clinicalInfo.history}</div>
                      <div><strong className="text-purple-700">Notes:</strong> {generatedData.clinicalInfo.notes}</div>
                    </div>
                  </CardContent>
                </Card>

                {generatedData.documentAnalysis && (
                  <Card className="border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                      <CardTitle className="text-sm text-purple-800">Document Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <div><strong className="text-purple-700">Documents Analyzed:</strong> {generatedData.documentAnalysis.analyzedDocuments}</div>
                        <div><strong className="text-purple-700">Processing Time:</strong> {generatedData.documentAnalysis.processingTime}ms</div>
                        <div><strong className="text-purple-700">Source:</strong> Generated from uploaded documents using AI analysis</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </EnhancedTabsContent>
        </EnhancedTabs>

        <DialogFooter className="pt-4 border-t border-purple-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Cancel
          </Button>
          {generatedData && (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-spin" />
                  Creating Referral...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create AI Referral
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoReferralModal;
