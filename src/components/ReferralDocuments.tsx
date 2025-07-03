
import { useState, useEffect } from 'react';
import { Attachment } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Eye, FileImage, Plus, Mail } from 'lucide-react';
import { format } from 'date-fns';
import DocumentUploadModal from './documents/DocumentUploadModal';
import GenerateLettersButton from './letters/GenerateLettersButton';
import GenerateLettersSheet from './letters/GenerateLettersSheet';
import { LetterService, ReferralLetter } from '@/services/letterService';
import { Badge } from '@/components/ui/badge';

interface ReferralDocumentsProps {
  attachments: Attachment[];
  referralId: string;
  patientName?: string;
  onDocumentUploaded?: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (contentType: string) => {
  if (contentType && contentType.startsWith('image/')) {
    return <FileImage className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
};

const getFileTypeDisplay = (contentType: string) => {
  if (!contentType) return 'UNKNOWN';
  
  const parts = contentType.split('/');
  if (parts.length < 2 || !parts[1]) return 'UNKNOWN';
  
  return parts[1].toUpperCase();
};

const ReferralDocuments = ({ attachments, referralId, patientName, onDocumentUploaded }: ReferralDocumentsProps) => {
  const [letters, setLetters] = useState<ReferralLetter[]>([]);
  const [isLoadingLetters, setIsLoadingLetters] = useState(true);
  
  // Combine attachments and letters for tabs
  const allDocuments = [
    ...attachments.map(att => ({ type: 'attachment', data: att })),
    ...letters.map(letter => ({ type: 'letter', data: letter }))
  ];
  
  const [activeTab, setActiveTab] = useState<string>(allDocuments.length > 0 ? allDocuments[0].data.id : '');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGenerateLettersSheetOpen, setIsGenerateLettersSheetOpen] = useState(false);
  
  // Load letters on component mount and when referralId changes
  useEffect(() => {
    loadLetters();
  }, [referralId]);
  
  const loadLetters = async () => {
    setIsLoadingLetters(true);
    try {
      const lettersList = await LetterService.getLettersByReferralId(referralId);
      setLetters(lettersList);
    } catch (error) {
      console.error('Error loading letters:', error);
    } finally {
      setIsLoadingLetters(false);
    }
  };
  
  const handleDocumentUploaded = () => {
    setIsUploadModalOpen(false);
    onDocumentUploaded?.();
  };

  const handleLetterCreated = () => {
    loadLetters(); // Reload letters when a new one is created
  };

  const getLetterTypeLabel = (letterType: string) => {
    const letterTypes = [
      { value: 'appointment_confirmation', label: 'Appointment Confirmation' },
      { value: 'appointment_reminder', label: 'Appointment Reminder' },
      { value: 'referral_acknowledgment', label: 'Referral Acknowledgment' },
      { value: 'treatment_summary', label: 'Treatment Summary' },
      { value: 'discharge_summary', label: 'Discharge Summary' },
      { value: 'custom', label: 'Custom Letter' }
    ];
    const letterTypeObj = letterTypes.find(type => type.value === letterType);
    return letterTypeObj ? letterTypeObj.label : letterType;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Referral Documents</CardTitle>
          <div className="flex items-center gap-2">
            <GenerateLettersButton 
              onClick={() => setIsGenerateLettersSheetOpen(true)}
            />
            <Button 
              size="sm" 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Document
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoadingLetters ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground text-sm mt-3">Loading documents...</p>
          </div>
        ) : allDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No documents available for this referral.</p>
          </div>
        ) : (
          <EnhancedTabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto pb-2 mb-3">
              <EnhancedTabsList variant="compact" size="sm" className="w-full min-w-max">
                {allDocuments.map((doc) => (
                  <EnhancedTabsTrigger 
                    key={doc.data.id} 
                    value={doc.data.id} 
                    variant="compact" 
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {doc.type === 'letter' ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        getFileIcon((doc.data as Attachment).contentType)
                      )}
                      <span className="truncate max-w-[120px]">
                        {doc.type === 'letter' 
                          ? getLetterTypeLabel((doc.data as ReferralLetter).letterType)
                          : (doc.data as Attachment).title
                        }
                      </span>
                    </span>
                  </EnhancedTabsTrigger>
                ))}
              </EnhancedTabsList>
            </div>
            
            {/* Attachment tabs content */}
            {attachments.map((attachment) => (
              <EnhancedTabsContent key={attachment.id} value={attachment.id}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFileIcon(attachment.contentType)}
                      <span className="font-medium text-sm">{attachment.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 h-7">
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline text-xs">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 h-7">
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline text-xs">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground font-medium">Date Added</div>
                      <div className="font-medium">
                        {format(new Date(attachment.date), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground font-medium">File Type</div>
                      <div className="font-medium">
                        {getFileTypeDisplay(attachment.contentType)}
                      </div>
                    </div>
                    
                    {attachment.size && (
                      <div>
                        <div className="text-muted-foreground font-medium">Size</div>
                        <div className="font-medium">{formatBytes(attachment.size)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </EnhancedTabsContent>
            ))}

            {/* Letter tabs content */}
            {letters.map((letter) => (
              <EnhancedTabsContent key={letter.id} value={letter.id}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium text-sm">{getLetterTypeLabel(letter.letterType)}</span>
                      <Badge variant={letter.status === 'sent' ? 'secondary' : 'outline'} className="text-xs">
                        {letter.status === 'sent' ? 'Sent' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 h-7">
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline text-xs">View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 h-7">
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline text-xs">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground font-medium">Date Created</div>
                      <div className="font-medium">
                        {format(new Date(letter.createdAt), 'dd MMM yyyy, HH:mm')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground font-medium">Created By</div>
                      <div className="font-medium">
                        {letter.createdBy || 'Unknown'}
                      </div>
                    </div>
                    
                    {letter.status === 'sent' && letter.sentAt && (
                      <div>
                        <div className="text-muted-foreground font-medium">Date Sent</div>
                        <div className="font-medium">
                          {format(new Date(letter.sentAt), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-muted-foreground font-medium text-xs mb-1">Letter Content</div>
                    <div className="p-3 bg-muted rounded-lg text-sm max-h-32 overflow-y-auto">
                      {letter.letterContent}
                    </div>
                  </div>
                </div>
              </EnhancedTabsContent>
            ))}
          </EnhancedTabs>
        )}
      </CardContent>
      
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        referralId={referralId}
        onDocumentUploaded={handleDocumentUploaded}
      />
      
      <GenerateLettersSheet
        isOpen={isGenerateLettersSheetOpen}
        onOpenChange={setIsGenerateLettersSheetOpen}
        referralId={referralId}
        patientName={patientName}
        onLetterCreated={handleLetterCreated}
      />
    </Card>
  );
};

export default ReferralDocuments;
