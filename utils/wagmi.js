import { modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";

export const walletConnectProjectId = "6f13342866c07f1d073480dc8e166fc3";
// console.log("[ENV] NEXT_WC_PROJECT_ID", walletConnectProjectId);

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [walletConnectProvider({ projectId: walletConnectProjectId })]
);

export const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "CryptoGPT", chains }),
  provider,
  webSocketProvider,
});

export { chains };
