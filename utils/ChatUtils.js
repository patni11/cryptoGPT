import { signMessage } from "@wagmi/core";
import { ChatClient } from "@walletconnect/chat-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export let chatClient;

export const createChatClient = async () => {
  console.log("PROJECTID", process.env.WALLET_CONNECT_PROJECT_ID);
  chatClient = await ChatClient.init({
    logger: "debug",
    keyseverUrl: "https://keys.walletconnect.com",
    projectId: process.env.WALLET_CONNECT_PROJECT_ID,
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
  const [topic, setTopic] = useState("");
  const { query } = useRouter();

  useEffect(() => {
    console.log(query);
    if (query?.topic) {
      setTopic(query.topic);
    }
  }, [query]);

  console.log("chatThreads on load:", chatClient?.chatThreads);
  console.log("chatMessages on load:", chatClient?.chatMessages);

  chatClient?.on("chat_invite", async (args) => {
    setTopic(args?.topic);
    await chatClient.accept({ id: args.id });
  });

  chatClient?.on("chat_joined", async (args) => {
    console.log("chat_joined:", args);
    console.log(chatClient.chatThreads.getAll());
  });

  chatClient?.on("chat_message", async (event) => {
    // React to an incoming messages for a given chat.
    console.log("msg rcvd");
    const query = event?.params?.message;
    console.log(query);

    await message("Query Received");

    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ animal: query }),
    });

    const data = await response.json();

    await message(data.result);
    if (response.status !== 200) {
      throw data.error ||
        new Error(`Request failed with status ${response.status}`);
    }
  });

  const message = async (message) => {
    // await chatClient?.ping(topic);
    if (topic != "") {
      console.log(message);
      await chatClient.message({
        topic,
        message,
      });
    } else {
      console.log("No Topic");
    }
  };
};

export const registerSelf = async (address) => {
  console.log("registeringAddress: ", address);
  const response = await chatClient?.register({
    account: `eip155:1:${address}`,
    onSign: async (message) => {
      console.log("[Chat] signing message...", message);
      signMessage({ message });
    },
  });
  console.log("register response", response);
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

  console.log("registrations", chatClient?.chatThreads);
};

// export const ping = async (topic) => {
//   await chatClient?.ping({
//     topic,
//   });
// };

// // sends a chat message to an active chat thread from account specified as selfAccount in Thread
// public abstract message(params: {
//   topic: string;
//   message: string;
//   media?: Media
// }): Promise<void>;

// // ping its peer to evaluate if it's currently online
// public abstract ping(params: {
//   topic: string;
// }): Promise<void>
