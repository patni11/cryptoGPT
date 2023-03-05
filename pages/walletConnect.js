// import { ChatClient } from "@walletconnect/chat-client";
const ChatClient = require("@walletconnect/chat-client");
require("dotenv").config();

export const func = async () => {
  const chatClient = await ChatClient.init({
    projectId: process.env.WALLET_CONNECT_PROJECT_ID,
    keyseverUrl: process.env.WALLET_CONNECT_URL,
  });
};

chatClient.on("chat_invite", async (event) => {
  // React to an incoming invite to chat.
  console.log("invite");
});

chatClient.on("chat_invite_accepted", async (event) => {
  // React to your peer joining a given chat.
  console.log("invite Accepted");
});

chatClient.on("chat_invite_rejected", async (event) => {
  // React to your peer declining your invite
  console.log("invite Rejected");
});

chatClient.on("chat_message", (event) => {
  // React to an incoming messages for a given chat.
  console.log("msg rcvd");
});

chatClient.on("chat_ping", (event) => {
  // React to an incoming ping event from a peer on a given chat topic.
  console.log("chat ping");
});

chatClient.on("chat_left", (event) => {
  // React to a peer leaving a given chat.
  console.log("chat left");
});
