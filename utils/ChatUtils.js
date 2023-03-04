import { signMessage } from "@wagmi/core";
import { ChatClient } from "@walletconnect/chat-client";
import { useCallback, useEffect, useState } from "react";

export let chatClient;

export const createChatClient = async () => {
  chatClient = await ChatClient.init({
    logger: "debug",
    keyserverUrl: "https://keys.walletconnect.com",
    projectId: "6f13342866c07f1d073480dc8e166fc3",
    relayUrl: "wss://relay.walletconnect.com",
  });
};

export default function initializeChatCliend() {
  const [initialized, setInitialized] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!initialized) {
      createChatClient();
      setInitialized(true);
    }
  }, [initialized]);

  return initialized;
}

export const chatInvites = async (address) => {};

export const chatEventListeners = async (initialized) => {
  console.log("chatThreads on load:", chatClient?.chatThreads.getAll());
  console.log("chatMessages on load:", chatClient?.chatMessages.getAll());

  chatClient?.on("chat_invite", async (args) => {
    console.log("chat_invite...:", args);
  });

  chatClient?.on("chat_joined", async (args) => {
    console.log("chat_joined:", args);
    console.log(chatClient.chatThreads.getAll());
  });

  chatClient?.on("chat_message", async (event) => {
    // React to an incoming messages for a given chat.
    console.log("msg rcvd");
  });
};

export const registerSelf = async (address) => {
  console.log("registeringAddress: ", address);
  await chatClient?.register({
    account: `eip155:1:${address}`,
    onSign: async (message) => {
      console.log("[Chat] signing message...", message);
      signMessage({ message });
    },
  });
};

export const createInvite = async (inviter, targetAddress) => {
  const inviteePublicKey = await chatClient?.resolve({
    account: `eip155:1:${targetAddress}`,
  });
  await chatClient?.invite({
    message: "Hey, lets chat!",
    inviteeAccount: `eip155:1:${targetAddress}`,
    inviterAccount: `eip155:1:${inviter}`,
    inviteePublicKey,
  });
};
