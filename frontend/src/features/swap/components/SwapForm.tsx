import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useSwapUsdcForGold, useGetBalance } from '../hooks/useSwapData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDown, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SwapForm() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const [amount, setAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('0');
  
  const { data: balances } = useGetBalance();
  const swapMutation = useSwapUsdcForGold();

  const rate = 10; // Fixed rate from backend

  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      setOutputAmount((numAmount * rate).toFixed(2));
    } else {
      setOutputAmount('0');
    }
  }, [amount, rate]);

  const handleSwap = async () => {
    const numAmount = parseFloat(amount);
    
    if (!isAuthenticated) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const usdcBalance = balances ? Number(balances.usdc) : 0;
    if (numAmount > usdcBalance) {
      toast.error('Insufficient USDC balance');
      return;
    }

    try {
      await swapMutation.mutateAsync(BigInt(Math.floor(numAmount)));
      toast.success(`Successfully swapped ${numAmount} USDC for ${outputAmount} GOLD`);
      setAmount('');
      setOutputAmount('0');
    } catch (error: any) {
      console.error('Swap error:', error);
      toast.error(error.message || 'Swap failed');
    }
  };

  const usdcBalance = balances ? Number(balances.usdc) : 0;
  const canSwap = isAuthenticated && amount && parseFloat(amount) > 0 && parseFloat(amount) <= usdcBalance;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from-amount" className="text-sm font-medium">
            From
          </Label>
          <div className="relative">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background/50">
              <img 
                src="/assets/generated/token-usdc.dim_256x256.png" 
                alt="USDC" 
                className="w-10 h-10"
              />
              <div className="flex-1">
                <Input
                  id="from-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-0 bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={!isAuthenticated}
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Balance: {usdcBalance.toLocaleString()} USDC
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">USDC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-amount" className="text-sm font-medium">
            To (estimated)
          </Label>
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background/50">
            <img 
              src="/assets/generated/token-gold.dim_256x256.png" 
              alt="GOLD" 
              className="w-10 h-10"
            />
            <div className="flex-1">
              <div className="text-2xl font-semibold text-muted-foreground">
                {outputAmount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Rate: 1 USDC = {rate} GOLD
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">GOLD</p>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Connect your wallet to start swapping
            </p>
          </div>
        )}

        <Button
          onClick={handleSwap}
          disabled={!canSwap || swapMutation.isPending}
          className="w-full h-12 text-base font-semibold shadow-glow"
          size="lg"
        >
          {swapMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Swapping...
            </>
          ) : !isAuthenticated ? (
            'Connect Wallet to Swap'
          ) : (
            'Swap'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
