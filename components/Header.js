import * as React from "react";
import { Web3Button } from "@web3modal/react";
import initializeChatClient, {
  chatClient,
  chatEventListeners,
  createInvite,
} from "../utils/ChatUtils";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";
import { useCallback, useEffect } from "react";

export const Header = () => {
  const { address, isConnected } = useAccount();

  const initialized = initializeChatClient();

  const registerChatClient = useCallback(
    async (address) => {
      console.log("registeringAddress: ", address);

      try {
        await chatClient?.register({
          account: `eip155:1:${address}`,
          onSign: async (message) => {
            console.log("[Chat] signing message.....", message);
            return signMessage({ message });
          },
        });
        console.log(
          "[Chat] registered address %s on keyserver",
          `eip155:1:${address}`
        );
      } catch (error) {
        console.log("error: ", error);
      }
    },
    [signMessage]
  );

  chatEventListeners(initialized);

  useEffect(() => {
    console.log("Chat Client Initialized: ", initialized);
  }, [address, initialized]);

  return (
    <div className="w-screen flex justify-end px-6 pt-4">
      <Web3Button />
    </div>
  );
};
