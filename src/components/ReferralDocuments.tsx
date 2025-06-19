
import { useState } from 'react';
import { Attachment } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from '@/components/ui/enhanced-tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Eye, FileImage, Plus } from 'lucide-react';
import { format } from 'date-fns';
import DocumentUploadModal from './documents/DocumentUploadModal';

interface ReferralDocumentsProps {
  attachments: Attachment[];
  referralId: string;
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

const ReferralDocuments = ({ attachments, referralId, onDocumentUploaded }: ReferralDocumentsProps) => {
  const [activeTab, setActiveTab] = useState<string>(attachments.length > 0 ? attachments[0].id : '');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleDocumentUploaded = () => {
    setIsUploadModalOpen(false);
    onDocumentUploaded?.();
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Referral Documents</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {attachments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No documents available for this referral.</p>
          </div>
        ) : (
          <EnhancedTabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto pb-2 mb-3">
              <EnhancedTabsList variant="compact" size="sm" className="w-full min-w-max">
                {attachments.map((attachment) => (
                  <EnhancedTabsTrigger 
                    key={attachment.id} 
                    value={attachment.id} 
                    variant="compact" 
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {getFileIcon(attachment.contentType)}
                      <span className="truncate max-w-[120px]">{attachment.title}</span>
                    </span>
                  </EnhancedTabsTrigger>
                ))}
              </EnhancedTabsList>
            </div>
            
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
          </EnhancedTabs>
        )}
      </CardContent>
      
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        referralId={referralId}
        onDocumentUploaded={handleDocumentUploaded}
      />
    </Card>
  );
};

export default ReferralDocuments;
