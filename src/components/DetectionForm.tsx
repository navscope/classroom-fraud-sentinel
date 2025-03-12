
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import UploadZone from './UploadZone';
import ResultsDisplay from './ResultsDisplay';
import { detectAiContent } from '@/services/detectionService';
import { DetectionResult } from '@/types';
import { FileText, AlignLeft, Loader2 } from 'lucide-react';

export const DetectionForm = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult>({
    aiProbability: 0,
    humanProbability: 0,
    confidence: 0,
    status: 'idle'
  });
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleUploadedTextExtracted = (extractedText: string) => {
    setText(extractedText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Empty submission",
        description: "Please enter or upload text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    if (text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please provide at least 50 characters for accurate analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setResult({
      ...result,
      status: 'loading'
    });
    
    try {
      const detectionResult = await detectAiContent(text);
      setResult(detectionResult);
      
      if (detectionResult.status === 'error') {
        toast({
          title: "Analysis Error",
          description: detectionResult.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during detection:", error);
      setResult({
        aiProbability: 0,
        humanProbability: 0,
        confidence: 0,
        status: 'error',
        error: 'An unexpected error occurred. Please try again.'
      });
      
      toast({
        title: "Detection Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult({
      aiProbability: 0,
      humanProbability: 0,
      confidence: 0,
      status: 'idle'
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto mb-4">
            <TabsTrigger value="text" className="flex items-center gap-2 text-sm">
              <AlignLeft className="h-4 w-4" /> Direct Input
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" /> File Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="animate-fade-in">
            <div className="space-y-4">
              <Textarea
                placeholder="Paste student assignment text here for AI content analysis..."
                className="min-h-[240px] w-full resize-y p-4 text-base leading-relaxed focus-ring"
                value={text}
                onChange={handleTextChange}
                disabled={isProcessing}
              />
              <div className="text-xs text-muted-foreground text-right">
                {text.length} characters
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="file" className="animate-fade-in">
            <UploadZone 
              onTextExtracted={handleUploadedTextExtracted} 
              isProcessing={isProcessing}
            />
            {text && (
              <div className="mt-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="text-sm font-medium mb-2">Extracted Text Preview</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {text.substring(0, 200)}
                    {text.length > 200 ? '...' : ''}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {text.length} characters
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isProcessing || !text}
          >
            Clear
          </Button>
          <Button
            type="submit"
            disabled={isProcessing || text.length < 50}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Content"
            )}
          </Button>
        </div>
      </form>
      
      <ResultsDisplay result={result} originalText={text} />
    </div>
  );
};

export default DetectionForm;
