
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, FileText } from "lucide-react";

export interface DocumentFile {
  id: string;
  file: File;
  title: string;
  description?: string;
}

interface ReferralDocumentsTabProps {
  documents: DocumentFile[];
  setDocuments: (documents: DocumentFile[]) => void;
}

const ReferralDocumentsTab = ({ documents, setDocuments }: ReferralDocumentsTabProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newDocuments: DocumentFile[] = Array.from(files).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      description: ''
    }));

    setDocuments([...documents, ...newDocuments]);
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

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const updateDocumentTitle = (docId: string, title: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, title } : doc
    ));
  };

  return (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop documents here, or click to browse
        </p>
        <Input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="document-upload"
        />
        <Label htmlFor="document-upload" className="cursor-pointer">
          <Button variant="outline" size="sm" asChild>
            <span>Browse Files</span>
          </Button>
        </Label>
        <p className="text-xs text-muted-foreground mt-2">
          Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (max 10MB each)
        </p>
      </div>

      {/* Selected Documents */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Documents ({documents.length})</Label>
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{doc.file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Document Title</Label>
                  <Input
                    value={doc.title}
                    onChange={(e) => updateDocumentTitle(doc.id, e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralDocumentsTab;
