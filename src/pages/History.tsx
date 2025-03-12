
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getDetectionHistory } from '@/services/detectionService';
import { format } from 'date-fns';
import { History as HistoryIcon, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface HistoryItem {
  id: number;
  text_preview: string;
  ai_probability: number;
  human_probability: number;
  confidence: number;
  suggested_action: string;
  created_at: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const historyData = await getDetectionHistory();
        setHistory(historyData);
      } catch (err) {
        setError('Failed to load detection history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusBadge = (aiProbability: number) => {
    if (aiProbability > 0.7) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          High AI Probability
        </Badge>
      );
    } else if (aiProbability > 0.4) {
      return (
        <Badge variant="warning" className="flex items-center gap-1 bg-yellow-500">
          <HelpCircle className="h-3 w-3" />
          Moderate AI Indicators
        </Badge>
      );
    } else {
      return (
        <Badge variant="success" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="h-3 w-3" />
          Likely Human
        </Badge>
      );
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <HistoryIcon className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Detection History</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading detection history...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-destructive">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>{error}</p>
                </div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No detection history found. Start analyzing content to build history.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Text Preview</TableHead>
                      <TableHead>AI Probability</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-[300px] truncate">
                          {item.text_preview}
                        </TableCell>
                        <TableCell>
                          {(item.ai_probability * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.ai_probability)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      
      <footer className="py-10 px-6 bg-secondary/30 mt-auto">
        <div className="max-w-5xl mx-auto">
          <Separator className="mb-6" />
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Classroom Fraud Sentinel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default HistoryPage;
