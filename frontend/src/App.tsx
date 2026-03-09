import { ThemeProvider } from 'next-themes';
import SwapPage from './features/swap/SwapPage';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SwapPage />
      <Toaster />
    </ThemeProvider>
  );
}
