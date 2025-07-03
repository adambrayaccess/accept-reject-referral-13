
import { useState, useEffect } from 'react';
import { Attachment } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Eye, FileImage, Plus, Mail, Calendar, User, FileType, HardDrive } from 'lucide-react';
import { format } from 'date-fns';
import DocumentUploadModal from './documents/DocumentUploadModal';
import GenerateLettersButton from './letters/GenerateLettersButton';
import GenerateLettersSheet from './letters/GenerateLettersSheet';
import { LetterService, ReferralLetter } from '@/services/letterService';

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

  // Combine and sort all documents by date (most recent first)
  const allDocuments = [
    ...attachments.map(att => ({ 
      type: 'attachment' as const, 
      data: att,
      date: new Date(att.date),
      title: att.title,
      id: att.id
    })),
    ...letters.map(letter => ({ 
      type: 'letter' as const, 
      data: letter,
      date: new Date(letter.createdAt),
      title: getLetterTypeLabel(letter.letterType),
      id: letter.id
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
  
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
        {allDocuments.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {allDocuments.length} document{allDocuments.length !== 1 ? 's' : ''} • {attachments.length} attachment{attachments.length !== 1 ? 's' : ''} • {letters.length} letter{letters.length !== 1 ? 's' : ''}
          </div>
        )}
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
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-2">
              {allDocuments.map((doc, index) => (
                <div key={doc.id} className="group">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Document Icon */}
                      <div className="flex-shrink-0">
                        {doc.type === 'letter' ? (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                            {getFileIcon((doc.data as Attachment).contentType)}
                          </div>
                        )}
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                          {doc.type === 'letter' && (
                            <Badge 
                              variant={(doc.data as ReferralLetter).status === 'sent' ? 'secondary' : 'outline'} 
                              className="text-xs"
                            >
                              {(doc.data as ReferralLetter).status === 'sent' ? 'Sent' : 'Draft'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(doc.date, 'dd MMM yyyy, HH:mm')}
                          </span>
                          
                          {doc.type === 'attachment' ? (
                            <>
                              <span className="flex items-center gap-1">
                                <FileType className="h-3 w-3" />
                                {getFileTypeDisplay((doc.data as Attachment).contentType)}
                              </span>
                              {(doc.data as Attachment).size && (
                                <span className="flex items-center gap-1">
                                  <HardDrive className="h-3 w-3" />
                                  {formatBytes((doc.data as Attachment).size)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {(doc.data as ReferralLetter).createdBy || 'Unknown'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Letter content preview for letters */}
                  {doc.type === 'letter' && (
                    <div className="ml-16 mt-2 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Letter Preview:</p>
                      <p className="text-sm line-clamp-2">
                        {(doc.data as ReferralLetter).letterContent}
                      </p>
                    </div>
                  )}
                  
                  {index < allDocuments.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
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
