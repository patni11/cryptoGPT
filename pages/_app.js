import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import * as React from "react";
import NextHead from "next/head";
import { WagmiConfig } from "wagmi";
import { chains, client, walletConnectProjectId } from "../utils/wagmi";
import "./globals.css";

const ethereumClient = new EthereumClient(client, chains);

function App({ Component, pageProps }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={client}>
      <NextHead>
        <title>CryptoGPT</title>
      </NextHead>

      {mounted && <Component {...pageProps} />}

      <Web3Modal
        projectId={walletConnectProjectId}
        ethereumClient={ethereumClient}
      />
    </WagmiConfig>
  );
}

export default App;
