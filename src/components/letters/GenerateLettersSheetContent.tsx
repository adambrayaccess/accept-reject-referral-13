import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Save, FileText, Calendar, User } from 'lucide-react';

interface GenerateLettersSheetContentProps {
  referralId: string;
}

const letterTypes = [
  { value: 'appointment_confirmation', label: 'Appointment Confirmation' },
  { value: 'appointment_reminder', label: 'Appointment Reminder' },
  { value: 'referral_acknowledgment', label: 'Referral Acknowledgment' },
  { value: 'treatment_summary', label: 'Treatment Summary' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'custom', label: 'Custom Letter' }
];

const GenerateLettersSheetContent = ({ referralId }: GenerateLettersSheetContentProps) => {
  const [selectedLetterType, setSelectedLetterType] = useState<string>('');
  const [letterContent, setLetterContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleSendLetter = () => {
    // Handle sending letter
    console.log('Sending letter for referral:', referralId);
  };

  const handleSaveDraft = () => {
    // Handle saving draft
    console.log('Saving draft for referral:', referralId);
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
              <Button onClick={handleSendLetter} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Letter
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save as Draft
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
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Referral Acknowledgment</div>
                <div className="text-sm text-muted-foreground">Sent to Dr. Smith on 12 Dec 2024</div>
              </div>
              <Badge variant="secondary">Sent</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Appointment Confirmation</div>
                <div className="text-sm text-muted-foreground">Draft saved on 10 Dec 2024</div>
              </div>
              <Badge variant="outline">Draft</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateLettersSheetContent;