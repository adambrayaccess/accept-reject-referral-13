
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
    return <FileImage className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
};

const AttachmentViewer = ({ attachments }: AttachmentViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>(attachments.length > 0 ? attachments[0].id : '');
  
  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Attachments</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">No attachments available for this referral.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2 mb-3">
            <TabsList variant="compact" size="sm" className="w-full min-w-max">
              {attachments.map((attachment) => (
                <TabsTrigger 
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
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {attachments.map((attachment) => (
            <TabsContent key={attachment.id} value={attachment.id}>
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
                      {attachment.contentType.split('/')[1].toUpperCase()}
                    </div>
                  </div>
                  
                  {attachment.size && (
                    <div>
                      <div className="text-muted-foreground font-medium">Size</div>
                      <div className="font-medium">{formatBytes(attachment.size)}</div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="aspect-video bg-muted flex items-center justify-center rounded-md">
                  <p className="text-muted-foreground text-sm text-center px-4">
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
