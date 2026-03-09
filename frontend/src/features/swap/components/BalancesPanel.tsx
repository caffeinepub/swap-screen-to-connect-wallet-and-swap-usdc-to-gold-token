import { useGetBalance } from '../hooks/useSwapData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins } from 'lucide-react';

export default function BalancesPanel() {
  const { data: balances, isLoading } = useGetBalance();

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const usdcBalance = balances ? Number(balances.usdc) : 0;
  const goldBalance = balances ? Number(balances.gold) : 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Your Balances</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">USDC</p>
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/token-usdc.dim_256x256.png" 
                alt="USDC" 
                className="w-6 h-6"
              />
              <p className="text-2xl font-bold">{usdcBalance.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">GOLD</p>
            <div className="flex items-center gap-2">
              <img 
                src="/assets/generated/token-gold.dim_256x256.png" 
                alt="GOLD" 
                className="w-6 h-6"
              />
              <p className="text-2xl font-bold">{goldBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
