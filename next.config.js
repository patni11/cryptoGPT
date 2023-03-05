const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DISCORD_CLIENT_TOKEN: process.env.DISCORD_CLIENT_TOKEN,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
};

module.exports = nextConfig;
