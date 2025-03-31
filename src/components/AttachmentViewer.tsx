
import { useState } from 'react';
import { Attachment } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Eye, FileImage } from 'lucide-react';
import { format } from 'date-fns';

interface AttachmentViewerProps {
  attachments: Attachment[];
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
  if (contentType.startsWith('image/')) {
    return <FileImage className="h-5 w-5" />;
  }
  return <FileText className="h-5 w-5" />;
};

const AttachmentViewer = ({ attachments }: AttachmentViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>(attachments.length > 0 ? attachments[0].id : '');
  
  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No attachments available for this referral.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
            {attachments.map((attachment) => (
              <TabsTrigger key={attachment.id} value={attachment.id} className="text-xs">
                {attachment.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {attachments.map((attachment) => (
            <TabsContent key={attachment.id} value={attachment.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFileIcon(attachment.contentType)}
                    <span className="font-medium">{attachment.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="hidden md:inline">View</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span className="hidden md:inline">Download</span>
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="info-label">Date Added</div>
                    <div className="info-value">
                      {format(new Date(attachment.date), 'dd MMM yyyy, HH:mm')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="info-label">File Type</div>
                    <div className="info-value">
                      {attachment.contentType.split('/')[1].toUpperCase()}
                    </div>
                  </div>
                  
                  {attachment.size && (
                    <div>
                      <div className="info-label">Size</div>
                      <div className="info-value">{formatBytes(attachment.size)}</div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                  <p className="text-muted-foreground">
                    Preview not available. Please click View to open the document.
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttachmentViewer;
