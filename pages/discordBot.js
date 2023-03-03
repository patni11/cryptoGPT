require("dotenv").config();
const axios = require("axios");

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async function(message) {
  if (message.author.bot) return;

  axios({
    method: "post",
    url: "http://localhost:3000/api/generate",
    data: {
      animal: message.content,
    },
  }).then(
    async (response) => {
      console.log(response.data);

      if (response.status !== 200) {
        throw data.error ||
          new Error(`Request failed with status ${response.data}`);
      }

      return message.reply(`${response.data["result"]}}`);
    },
    (error) => {
      console.error(error);
      alert(error.message);
    }
  );
});

client.login(
  "MTA4MDc0MjM5NzYzOTY3NTk1NA.G2fjbY.g4ciHHDC2-PatbnTzwP4r6DkmrhZWLelWfQ9LY"
);
