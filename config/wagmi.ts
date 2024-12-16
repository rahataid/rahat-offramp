import { createConfig, http } from "wagmi";
import { customChain } from "./custom-chain";

// Create wagmi config
export const config = createConfig({
  chains: [customChain],
  transports: {
    // [mainnet.id]: http(),
    [customChain.id]: http(),
  },
});
