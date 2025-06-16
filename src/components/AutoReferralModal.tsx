
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Referral, ReferralPriority } from '@/types/referral';
import { Bot, Sparkles, FileText, User, Clock, AlertTriangle } from 'lucide-react';
import { mockPractitioners } from '@/services/mock/practitioners';

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
  const { toast } = useToast();

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
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setPatientInfo('');
    setSpecialty('');
    setGeneratedData(null);
    setGenerationProgress(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
        
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input & Generate</TabsTrigger>
            <TabsTrigger value="review" disabled={!generatedData}>Review & Submit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="review" className="space-y-6">
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
              </div>
            )}
          </TabsContent>
        </Tabs>

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
