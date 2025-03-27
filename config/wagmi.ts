import { createConfig, http } from "wagmi";
import { customChain } from "./custom-chain";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { base, baseSepolia } from "wagmi/chains";

// Create wagmi config
export const config = createConfig({
  syncConnectedChain: true,
  connectors: [coinbaseWallet({})],
  chains: [base, baseSepolia, customChain],
  transports: {
    // [mainnet.id]: http(),
    [customChain.id]: http(),
  },
});
