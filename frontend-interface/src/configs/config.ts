import {
  getDefaultConfig
} from '@rainbow-me/rainbowkit';

import {
  optimismSepolia,
  scrollSepolia,
  mantaSepoliaTestnet
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'AppName',
    projectId: 'YOUR_PROJECT_ID',
    chains: [optimismSepolia, scrollSepolia, mantaSepoliaTestnet],
  });
