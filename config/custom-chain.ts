import { defineChain } from "viem";
import {
  CHAIN_ID,
  CHAIN_URL,
  OFFRAMP_TOKEN,
  TOKEN_DECIMALS,
} from "./constants";

export const customChain = defineChain({
  id: CHAIN_ID,
  name: process.env.NEXT_PUBLIC_CHAIN_NAME,
  nativeCurrency: {
    name: OFFRAMP_TOKEN,
    symbol: OFFRAMP_TOKEN,
    decimals: TOKEN_DECIMALS,
  },
  rpcUrls: {
    default: {
      http: [CHAIN_URL || "http://localhost:8888"],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
});
