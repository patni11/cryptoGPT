const dotenv = require("dotenv");
dotenv.config();

const axios = require("axios");
const token = process.env.DISCORD_CLIENT_TOKEN;

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async function(message) {
  if (message.content.includes("1080742397639675954")) {
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

        return message.reply(`${response.data["result"]}`);
      },
      (error) => {
        console.error(error);
        alert(error.message);
      }
    );
  }
  if (message.author.bot) return;
  console.log(message);
});

client.login(token);
