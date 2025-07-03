import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Save, FileText, Calendar, User } from 'lucide-react';
import { LetterService, ReferralLetter } from '@/services/letterService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface GenerateLettersSheetContentProps {
  referralId: string;
  onLetterCreated?: () => void;
}

const letterTypes = [
  { value: 'appointment_confirmation', label: 'Appointment Confirmation' },
  { value: 'appointment_reminder', label: 'Appointment Reminder' },
  { value: 'referral_acknowledgment', label: 'Referral Acknowledgment' },
  { value: 'treatment_summary', label: 'Treatment Summary' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'custom', label: 'Custom Letter' }
];

const GenerateLettersSheetContent = ({ referralId, onLetterCreated }: GenerateLettersSheetContentProps) => {
  const [selectedLetterType, setSelectedLetterType] = useState<string>('');
  const [letterContent, setLetterContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [letterHistory, setLetterHistory] = useState<ReferralLetter[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();

  // Load letter history on component mount
  useEffect(() => {
    loadLetterHistory();
  }, [referralId]);

  const loadLetterHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const letters = await LetterService.getLettersByReferralId(referralId);
      setLetterHistory(letters);
    } catch (error) {
      console.error('Error loading letter history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerateLetter = async () => {
    setIsGenerating(true);
    // Simulate letter generation
    setTimeout(() => {
      const templates = {
        appointment_confirmation: `Dear Patient,

We are pleased to confirm your upcoming appointment with our specialist team.

Appointment Details:
Date: [DATE]
Time: [TIME]
Location: [LOCATION]
Specialist: [SPECIALIST_NAME]

Please arrive 15 minutes early and bring a valid form of identification along with your referral letter.

If you need to reschedule or cancel this appointment, please contact us at least 48 hours in advance.

Kind regards,
[DEPARTMENT_NAME]`,
        appointment_reminder: `Dear Patient,

This is a friendly reminder about your upcoming appointment.

Appointment Details:
Date: [DATE]
Time: [TIME]
Location: [LOCATION]

Please ensure you attend this appointment as scheduled. If you cannot attend, please contact us as soon as possible.

Thank you for your cooperation.

Best regards,
[DEPARTMENT_NAME]`,
        referral_acknowledgment: `Dear [REFERRING_DOCTOR],

Thank you for referring your patient to our service. We have received the referral and it has been reviewed by our clinical team.

Referral Details:
Patient: [PATIENT_NAME]
NHS Number: [NHS_NUMBER]
Referral Date: [REFERRAL_DATE]
Priority: [PRIORITY]

The patient will be contacted within [TIMEFRAME] to arrange an appropriate appointment.

We will keep you informed of the patient's progress and treatment outcomes.

Yours sincerely,
[CONSULTANT_NAME]`
      };
      
      setLetterContent(templates[selectedLetterType as keyof typeof templates] || 'Please select a letter type to generate content.');
      setIsGenerating(false);
    }, 2000);
  };

  const handleSendLetter = async () => {
    if (!letterContent.trim() || !selectedLetterType) {
      toast({
        title: 'Error',
        description: 'Please generate letter content before sending.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await LetterService.sendLetter({
        referralId,
        letterType: selectedLetterType,
        letterContent: letterContent.trim(),
      });

      if (result.success) {
        toast({
          title: 'Letter Sent',
          description: 'The letter has been sent successfully.',
        });
        
        // Clear form and reload history
        setLetterContent('');
        setSelectedLetterType('');
        await loadLetterHistory();
        onLetterCreated?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send letter.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while sending the letter.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!letterContent.trim() || !selectedLetterType) {
      toast({
        title: 'Error',
        description: 'Please generate letter content before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await LetterService.saveDraft({
        referralId,
        letterType: selectedLetterType,
        letterContent: letterContent.trim(),
      });

      if (result.success) {
        toast({
          title: 'Draft Saved',
          description: 'The letter draft has been saved successfully.',
        });
        
        // Clear form and reload history
        setLetterContent('');
        setSelectedLetterType('');
        await loadLetterHistory();
        onLetterCreated?.();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save draft.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the draft.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getLetterTypeLabel = (value: string) => {
    const letterType = letterTypes.find(type => type.value === value);
    return letterType ? letterType.label : value;
  };

  return (
    <div className="space-y-6">
      {/* Letter Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Letter Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="letter-type">Select Letter Type</Label>
            <Select value={selectedLetterType} onValueChange={setSelectedLetterType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a letter type" />
              </SelectTrigger>
              <SelectContent>
                {letterTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedLetterType && (
            <Button 
              onClick={handleGenerateLetter} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Letter Content'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Letter Content */}
      {letterContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Letter Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="letter-content">Letter Text</Label>
              <Textarea
                id="letter-content"
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                rows={12}
                className="resize-none"
                placeholder="Letter content will appear here..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Patient Letter
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {letterContent && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleSendLetter} 
                disabled={isSending || isSaving}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSending ? 'Sending...' : 'Send Letter'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveDraft} 
                disabled={isSaving || isSending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Letter History */}
      <Card>
        <CardHeader>
          <CardTitle>Letter History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : letterHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No letters have been created for this referral yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {letterHistory.map((letter) => (
                <div key={letter.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{getLetterTypeLabel(letter.letterType)}</div>
                    <div className="text-sm text-muted-foreground">
                      {letter.status === 'sent' 
                        ? `Sent on ${format(new Date(letter.sentAt || letter.createdAt), 'dd MMM yyyy, HH:mm')}`
                        : `Draft saved on ${format(new Date(letter.createdAt), 'dd MMM yyyy, HH:mm')}`
                      }
                      {letter.createdBy && ` by ${letter.createdBy}`}
                    </div>
                  </div>
                  <Badge variant={letter.status === 'sent' ? 'secondary' : 'outline'}>
                    {letter.status === 'sent' ? 'Sent' : 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateLettersSheetContent;