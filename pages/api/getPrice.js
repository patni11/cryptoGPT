import { CoinGeckoClient } from "coingecko-api-v3";
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export const getPrice = async (token) => {
  try {
    const priceData = await client.simplePrice({
      ids: token,
      vs_currencies: "usd",
    });
    const result = `The price of ${token} is ${priceData[token]["usd"]} USD.`;
    console.log(result);
    return result;
  } catch (error) {
    return "Try to spell the token in a different way or try another token.";
  }
};
