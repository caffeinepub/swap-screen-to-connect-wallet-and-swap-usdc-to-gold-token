import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import WalletControls from './components/WalletControls';
import BalancesPanel from './components/BalancesPanel';
import SwapForm from './components/SwapForm';
import QuotePreview from './components/QuotePreview';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useSwapData';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import { ArrowDownUp } from 'lucide-react';

export default function SwapPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/swap-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

      {/* Content */}
      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowDownUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Token Swap</h1>
                  <p className="text-xs text-muted-foreground">USDC to GOLD Exchange</p>
                </div>
              </div>
              <WalletControls />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            {isAuthenticated && <BalancesPanel />}
            
            <div className="animate-fade-in">
              <SwapForm />
            </div>

            {isAuthenticated && (
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <QuotePreview />
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-border/50 backdrop-blur-sm bg-background/80 mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2026. Built with ❤️ using{' '}
              <a 
                href="https://caffeine.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
