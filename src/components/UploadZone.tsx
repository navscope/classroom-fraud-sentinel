
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, FileText, X, FileIcon, File } from 'lucide-react';
import { UploadedFile } from '@/types';
import { extractTextFromFile } from '@/services/detectionService';

interface UploadZoneProps {
  onTextExtracted: (text: string) => void;
  isProcessing: boolean;
}

export const UploadZone = ({ onTextExtracted, isProcessing }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      await processFile(droppedFiles[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      await processFile(selectedFiles[0]);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('text')) {
      return <FileText className="h-5 w-5 text-gray-500" />;
    } else {
      return <File className="h-5 w-5 text-primary" />;
    }
  };

  const processFile = async (file: File) => {
    // Extended list of MIME types for better file support
    const allowedTypes = [
      'text/plain', 
      'application/pdf', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      'application/rtf',
      'text/markdown',
      'text/csv'
    ];
    
    // Check if file type is supported
    const fileTypeSupported = allowedTypes.some(type => file.type.includes(type.split('/')[1]));
    
    if (!fileTypeSupported && !allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a text, PDF, Word document, or other supported text format.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsExtracting(true);
    setExtractionProgress(10); // Start progress
    
    try {
      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 500);
      
      const extractedText = await extractTextFromFile(file);
      
      clearInterval(progressInterval);
      setExtractionProgress(100);
      
      if (extractedText.length < 50) {
        toast({
          title: "Text too short",
          description: "The extracted text is too short for analysis. Please upload a file with more content.",
          variant: "destructive",
        });
        return;
      }
      
      setFile({
        name: file.name,
        size: file.size,
        type: file.type,
        content: extractedText
      });
      
      onTextExtracted(extractedText);
      
      toast({
        title: "File processed successfully",
        description: `"${file.name}" has been analyzed and text extracted.`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Unable to extract text from the uploaded file.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {file ? (
        <div className="rounded-lg border border-border p-4 bg-background animate-scale-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary rounded-md">
                {getFileIcon(file.type)}
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {file.content.length} characters
                </p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              disabled={isProcessing}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center cursor-pointer animate-fade-in",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
            isExtracting && "opacity-50 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-full bg-secondary">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isExtracting ? `Processing file... ${Math.round(extractionProgress)}%` : "Drop file here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports TXT, PDF, DOC, DOCX, RTF, ODT, MD, CSV (max 10MB)
              </p>
            </div>
            
            {isExtracting && (
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx,.rtf,.odt,.md,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf,application/vnd.oasis.opendocument.text,text/markdown,text/csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={isExtracting}
          />
        </div>
      )}
    </div>
  );
};

export default UploadZone;
