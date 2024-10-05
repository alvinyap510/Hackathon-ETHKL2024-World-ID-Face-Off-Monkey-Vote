'use client';

import { ChakraProvider } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  optimismSepolia,
  scrollSepolia,
  mantaSepoliaTestnet
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { config } from '@/configs/config';

// const config = getDefaultConfig({
//   appName: 'AppName',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [optimismSepolia, scrollSepolia, mantaSepoliaTestnet],
// });


const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}