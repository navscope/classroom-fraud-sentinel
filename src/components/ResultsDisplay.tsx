
import { useState } from 'react';
import { DetectionResult } from '@/types';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  CheckCircle2, 
  Flag, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Bot 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ResultsDisplayProps {
  result: DetectionResult;
  originalText: string;
}

export const ResultsDisplay = ({ result, originalText }: ResultsDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);

  if (result.status === 'idle') {
    return null;
  }

  if (result.status === 'loading') {
    return (
      <div className="mt-6 p-6 rounded-lg border border-border w-full max-w-3xl mx-auto bg-card animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing content for AI patterns...</p>
          <Progress value={45} className="w-64 h-1.5" />
        </div>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="mt-6 p-6 rounded-lg border border-destructive/20 w-full max-w-3xl mx-auto bg-card animate-fade-in">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-medium text-destructive">Error analyzing content</h3>
            <p className="text-sm text-muted-foreground mt-1">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const aiScore = result.aiProbability * 100;
  const isLikelyAi = aiScore > 70;
  const isPossiblyAi = aiScore > 40 && aiScore <= 70;
  const isLikelyHuman = aiScore <= 40;

  const getScoreColor = (score: number) => {
    if (score > 70) return "text-destructive";
    if (score > 40) return "text-amber-500";
    return "text-emerald-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score > 70) return "bg-destructive/10";
    if (score > 40) return "bg-amber-500/10";
    return "bg-emerald-500/10";
  };

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto animate-slide-up">
      <div className="p-6 rounded-xl border border-border bg-card subtle-shadow">
        <div className="flex flex-col space-y-6">
          {/* Header result summary */}
          <div className="flex items-center justify-between">
            <div className="highlight-chip">
              Analysis Result
            </div>
            <span className="text-xs text-muted-foreground">
              Confidence: {(result.confidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* Main score display */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 py-4">
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center",
                getScoreBgColor(aiScore)
              )}>
                <div className="text-center">
                  <span className={cn("text-4xl font-bold", getScoreColor(aiScore))}>
                    {aiScore.toFixed(0)}%
                  </span>
                  <p className="text-xs mt-1">AI Probability</p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-lg">
                  {isLikelyAi && "Likely AI-Generated"}
                  {isPossiblyAi && "Possibly AI-Generated"}
                  {isLikelyHuman && "Likely Human-Written"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.suggestedAction}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-destructive" />
                      <span>AI Content</span>
                    </div>
                    <span className={getScoreColor(aiScore)}>{aiScore.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={aiScore} 
                    className={cn("h-2", 
                      isLikelyAi ? "bg-destructive/20" : 
                      isPossiblyAi ? "bg-amber-500/20" : 
                      "bg-emerald-500/20"
                    )} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-emerald-500" />
                      <span>Human Content</span>
                    </div>
                    <span className={getScoreColor(100 - aiScore)}>{(100 - aiScore).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={100 - aiScore} 
                    className={cn("h-2", 
                      isLikelyHuman ? "bg-emerald-500/20" : 
                      isPossiblyAi ? "bg-amber-500/20" : 
                      "bg-destructive/20"
                    )} 
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full text-xs flex items-center justify-center"
                >
                  {showDetails ? (
                    <>Hide Details <ChevronUp className="ml-1 h-3 w-3" /></>
                  ) : (
                    <>Show Details <ChevronDown className="ml-1 h-3 w-3" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Detailed analysis */}
          {showDetails && (
            <div className="pt-4 animate-fade-in">
              <Separator className="mb-4" />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Flagged Sentences</h3>
                {result.details?.flaggedSentences && result.details.flaggedSentences.length > 0 ? (
                  <div className="space-y-3">
                    {result.details.flaggedSentences.map((sentence, index) => (
                      <div key={index} className="p-3 rounded-md bg-card border border-border">
                        <div className="flex items-start space-x-2">
                          <Flag className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{sentence.text}</p>
                            <div className="flex items-center mt-2">
                              <Progress 
                                value={sentence.score * 100} 
                                className="h-1.5 w-24" 
                              />
                              <span className="text-xs ml-2 text-muted-foreground">
                                {(sentence.score * 100).toFixed(0)}% AI probability
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific sentences were flagged.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
