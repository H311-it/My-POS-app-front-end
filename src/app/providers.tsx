import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { PosSessionProvider } from '../modules/pos/state/PosSessionProvider';

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PosSessionProvider>{children}</PosSessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
