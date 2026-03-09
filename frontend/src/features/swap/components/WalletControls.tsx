import { useState } from 'react';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { SiInternetcomputer } from 'react-icons/si';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WalletProvider = 'internet-identity' | 'metamask';

export default function WalletControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState<WalletProvider>('internet-identity');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const principal = identity?.getPrincipal().toString();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Disconnected successfully');
    } else {
      if (selectedProvider === 'metamask') {
        toast.error('MetaMask login is not supported in this app yet.');
        return;
      }
      
      try {
        await login();
        toast.success('Connected successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Failed to connect wallet');
        }
      }
    }
  };

  const isMetaMaskDisabled = selectedProvider === 'metamask' && !isAuthenticated;

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
      {/* Provider Selection - Only show when not authenticated */}
      {!isAuthenticated && (
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
          <TooltipProvider>
            <Button
              variant={selectedProvider === 'internet-identity' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedProvider('internet-identity')}
              className="gap-2 h-8 px-3"
            >
              <SiInternetcomputer className="w-4 h-4" />
              <span className="hidden sm:inline">Internet Identity</span>
              <span className="sm:hidden">II</span>
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedProvider === 'metamask' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedProvider('metamask')}
                  className="gap-2 h-8 px-3"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">MetaMask</span>
                  <span className="sm:hidden">MM</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">MetaMask login is not supported yet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Principal Display */}
      {isAuthenticated && principal && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">
            {principal.slice(0, 8)}...{principal.slice(-6)}
          </span>
        </div>
      )}
      
      {/* Connect/Disconnect Button */}
      <TooltipProvider>
        <Tooltip open={isMetaMaskDisabled ? undefined : false}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn || isMetaMaskDisabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="default"
              className="gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </TooltipTrigger>
          {isMetaMaskDisabled && (
            <TooltipContent>
              <p className="text-xs">MetaMask login is not supported in this app yet.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* MetaMask Warning Message - Mobile */}
      {isMetaMaskDisabled && (
        <p className="sm:hidden text-xs text-muted-foreground text-center px-2">
          MetaMask login is not supported yet
        </p>
      )}
    </div>
  );
}
