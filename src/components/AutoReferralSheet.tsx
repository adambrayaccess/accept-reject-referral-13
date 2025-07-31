import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface AutoReferralSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (referral: Partial<Referral>) => void;
}

const AutoReferralSheet = ({ isOpen, onClose, onSubmit }: AutoReferralSheetProps) => {
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
    if (!determinedSpecialty || determinedSpecialty === 'auto-detect') {
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
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-5xl bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <SheetHeader className="pb-4 border-b border-purple-100">
          <SheetTitle className="flex items-center gap-3 text-xl">
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
          </SheetTitle>
          <SheetDescription className="text-base">
            Generate referrals using AI from documents or clinical information
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="pr-4 space-y-6">
            <Tabs defaultValue="documents" className="w-full">
              <TabsList variant="grid" size="md" className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <TabsTrigger
                  value="documents" 
                  variant="grid" 
                  size="md"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </TabsTrigger>
                <TabsTrigger
                  value="input" 
                  variant="grid" 
                  size="md"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  variant="grid" 
                  size="md"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:from-purple-100 hover:to-purple-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Generated Referral
                </TabsTrigger>
              </TabsList>

              {/* Document Upload Tab */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                  <Upload className="h-4 w-4" />
                  <AlertDescription>
                    Upload medical documents, letters, or images to generate a referral using AI analysis.
                    Supported formats: PDF, DOC, DOCX, images (PNG, JPG), and text files.
                  </AlertDescription>
                </Alert>

                {/* File Upload Area */}
                <Card 
                  className={`border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 ${
                    dragActive ? 'border-purple-500 bg-purple-100' : 'border-purple-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Upload className="h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">
                      Upload Medical Documents
                    </h3>
                    <p className="text-purple-600 mb-4">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-purple-500">
                      Maximum file size: 10MB per file
                    </p>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-purple-800 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Uploaded Files ({uploadedFiles.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div>
                            <span className="font-medium text-purple-800">{file.name}</span>
                            <span className="text-sm text-purple-600 ml-2">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-purple-600 hover:text-purple-800 hover:bg-purple-200"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Analysis Section */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <Button
                      onClick={analyzeDocuments}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Documents...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Analyze Documents with AI
                        </>
                      )}
                    </Button>

                    {isAnalyzing && (
                      <DocumentAnalysisProgress
                        files={uploadedFiles}
                        currentFileIndex={currentAnalyzingIndex}
                        progress={analysisProgress}
                        isComplete={false}
                        hasError={!!analysisError}
                        errorMessage={analysisError || undefined}
                      />
                    )}

                    {analysisError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{analysisError}</AlertDescription>
                      </Alert>
                    )}

                    {analysisResults.length > 0 && (
                      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
                        <CardHeader>
                          <CardTitle className="text-green-800 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Analysis Complete
                          </CardTitle>
                          <CardDescription className="text-green-700">
                            Documents have been analyzed. You can now generate a referral.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={generateFromDocuments}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                          >
                            {isGenerating ? (
                              <>
                                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Referral...
                              </>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Generate Referral from Analysis
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Manual Input Tab */}
              <TabsContent value="input" className="space-y-6 mt-6">
                <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Provide patient information and clinical details to generate a referral using AI.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800">Patient Information</CardTitle>
                      <CardDescription>
                        Provide comprehensive patient details for accurate referral generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="patient-info" className="text-purple-700 font-medium">
                          Clinical Information *
                        </Label>
                        <Textarea
                          id="patient-info"
                          placeholder="Enter detailed patient information including symptoms, medical history, current medications, and any relevant clinical observations..."
                          value={patientInfo}
                          onChange={(e) => setPatientInfo(e.target.value)}
                          className="min-h-32 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800">Referral Settings</CardTitle>
                      <CardDescription>
                        Configure the target specialty and other preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="target-specialty" className="text-purple-700 font-medium">
                          Target Specialty (Optional)
                        </Label>
                        <Select value={specialty} onValueChange={setSpecialty}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                            <SelectValue placeholder="Let AI determine specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto-detect">Auto-detect from information</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                            <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Rheumatology">Rheumatology</SelectItem>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Mental Health">Mental Health</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button
                        onClick={handleGenerate}
                        disabled={!patientInfo.trim() || isGenerating}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                      >
                        {isGenerating ? (
                          <>
                            <Brain className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Generation Progress */}
                {isGenerating && (
                  <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-purple-700 font-medium">AI Generation Progress</span>
                          <span className="text-purple-600">{generationProgress}%</span>
                        </div>
                        <Progress value={generationProgress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Generated Referral Preview Tab */}
              <TabsContent value="preview" className="space-y-6 mt-6">
                {!generatedData ? (
                  <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      No referral generated yet. Please use the Document Upload or Manual Input tabs to generate a referral first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800">Generated Referral Preview</h3>
                        <p className="text-purple-600">Review the AI-generated referral before creating</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {generatedData.confidence}% Confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Patient Information */}
                      <Card className="border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-purple-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Name</Label>
                            <p className="text-purple-900">{generatedData.patient.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">NHS Number</Label>
                            <p className="text-purple-900">{generatedData.patient.nhsNumber}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Date of Birth</Label>
                            <p className="text-purple-900">{generatedData.patient.birthDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Address</Label>
                            <p className="text-purple-900">{generatedData.patient.address}</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Referral Information */}
                      <Card className="border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-purple-800 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Referral Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Specialty</Label>
                            <p className="text-purple-900">{generatedData.specialty}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Priority</Label>
                            <Badge variant={generatedData.priority === 'urgent' ? 'destructive' : 'secondary'}>
                              {generatedData.priority}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Referrer</Label>
                            <p className="text-purple-900">{generatedData.referrer.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Clinical Information */}
                    <Card className="border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-800">Clinical Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-purple-700">Reason for Referral</Label>
                          <p className="text-purple-900 mt-1">{generatedData.clinicalInfo.reason}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-purple-700">Clinical History</Label>
                          <p className="text-purple-900 mt-1">{generatedData.clinicalInfo.history}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-purple-700">Diagnosis</Label>
                          <p className="text-purple-900 mt-1">{generatedData.clinicalInfo.diagnosis}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-purple-700">Additional Notes</Label>
                          <p className="text-purple-900 mt-1">{generatedData.clinicalInfo.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
              <Button
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
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AutoReferralSheet;