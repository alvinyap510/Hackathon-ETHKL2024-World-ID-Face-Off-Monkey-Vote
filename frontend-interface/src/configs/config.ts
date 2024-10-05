import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import {
  optimismSepolia,
  scrollSepolia,
  mantaSepoliaTestnet,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "AppName",
  projectId: "YOUR_PROJECT_ID",
  chains: [optimismSepolia, scrollSepolia, mantaSepoliaTestnet],
});

export const contractAddresses = {
  VotingGovernance: {
    // 1: "0xacd6336af0fAB0BD7F25a7edd53Ef581596306Af", // Ethereum Mainnet
    // 5: "0x900d06d92367cb53aF2e5C8D1dB07953B714a583", // Goerli Testnet
    // 137: "0x1234567890abcdef1234567890abcdef12345678", // Polygon Mainnet
    // Add more chain IDs and addresses as needed
    11155420: "0xBe1DDf3961aCc11D8489717a8c658a37ab44EBA3",
  },
};
