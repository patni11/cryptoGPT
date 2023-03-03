// const { CoinGeckoClient } = require("coingecko-api-v3");
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

export const getCoinData = async (token) => {
  try {
    const data = (
      await client.coinId({
        id: token,
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        sparkline: false,
        developer_data: false,
      })
    )["market_data"];

    const coinDataObject = {
      Rank: data["market_cap_rank"],
      TVL: data["total_value_locked"],
      MktCap: data["market_cap"]["usd"],
      Change_From_ATH: data["ath_change_percentage"]["usd"],
      price_change_percentage_24h: data["price_change_percentage_24h"],
      price_change_percentage_7d: data["price_change_percentage_7d"],
      price_change_percentage_14d: data["price_change_percentage_14d"],
      price_change_percentage_30d: data["price_change_percentage_30d"],
      price_change_percentage_60d: data["price_change_percentage_60d"],
      price_change_percentage_200d: data["price_change_percentage_200d"],
      price_change_percentage_1y: data["price_change_percentage_1y"],
      Supply: data["total_supply"],
      CirculatingSupply: data["circulating_supply"],
    };
    let result = "";
    for (let property in coinDataObject) {
      result += `${property}: ${coinDataObject[property]} \n`;
    }
    return result;
  } catch (error) {
    return error;
  }
};

export const getCryptoData = async () => {
  try {
    const data = (await client.global())["data"];
    const coinDataObject = {
      Cryptocurrencies: data["active_cryptocurrencies"],
      TotalMarket: data["total_market_cap"]["usd"],
      TotalVol: data["total_volume"]["usd"],
    };
    let result = "";
    for (let property in coinDataObject) {
      result += `${property}: ${coinDataObject[property]} \n`;
    }
    return result;
  } catch (error) {
    return error;
  }
};
