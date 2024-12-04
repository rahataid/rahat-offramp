import { createConfig, http } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
});
