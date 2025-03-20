import { createConfig, http } from "wagmi";
import { customChain } from "./custom-chain";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
// import { base } from "wagmi/chains";

// Create wagmi config
export const config = createConfig({
  syncConnectedChain: true,
  connectors: [
    coinbaseWallet({}),
    metaMask({
      checkInstallationImmediately: true,
    }),
  ],
  chains: [customChain],
  transports: {
    // [mainnet.id]: http(),
    [customChain.id]: http(),
  },
});
