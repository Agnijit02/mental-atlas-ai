import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useDocuments } from '@/hooks/useDocuments';
import { cn } from "@/lib/utils";
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface FileUploadCardProps {
  onClose: () => void;
  onUploadSuccess: (file: { name: string; id: string }) => void;
}

const FileUploadCard = ({ onClose, onUploadSuccess }: FileUploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { uploadDocument } = useDocuments();

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      const allowedTypes = [
        "application/pdf", 
        "text/plain", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/markdown",
        "image/jpeg",
        "image/png",
        "image/gif"
      ];
      
      if (allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.md')) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File too large",
            description: "Please upload files smaller than 10MB.",
            variant: "destructive",
          });
          return;
        }
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, TXT, DOCX, MD file, or image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const result = await uploadDocument(selectedFile);
      
      toast({
        title: "Upload successful!",
        description: `${selectedFile.name} has been uploaded and processed.`,
      });

      onUploadSuccess({
        name: selectedFile.name,
        id: result.document.id
      });
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload a New Document</DialogTitle>
        <DialogDescription className="text-notemon-text-secondary">
          Accepted file types: PDF, TXT, DOCX, MD, or images. Max size: 10MB.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer",
            "border-notemon-border hover:border-notemon-primary/50",
            isDragging && "border-notemon-primary"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-4 text-notemon-text-secondary" />
            <p className="mb-2 text-sm text-notemon-text-secondary">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.txt,.docx,.doc,.md,image/*" 
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            disabled={uploading}
          />
        </label>
        {selectedFile && (
          <div className="mt-4 flex items-center justify-between p-2 bg-notemon-background/50 rounded-md">
            <span className="text-sm truncate pr-2">{selectedFile.name}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="bg-gradient-primary hover:bg-notemon-primary-hover text-white"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Start Upload'
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default FileUploadCard;