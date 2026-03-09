import { useGetQuote } from '../hooks/useSwapData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

export default function QuotePreview() {
  const { data: quote, isLoading } = useGetQuote();

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  const rate = quote ? Number(quote.rate) : 10;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Current Exchange Rate</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">1 USDC = {rate} GOLD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
