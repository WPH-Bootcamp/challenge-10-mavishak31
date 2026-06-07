'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient untuk menyimpan cache restaurants, cart, profile, dan orders
const queryClient = new QueryClient();

// Providers
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
