import { CoinGeckoClient } from "coingecko-api-v3";
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

export const getCoinData = async (token) => {
  try {
    const data = await client.coinId({
      ids: token,
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      sparkline: false,
      developer_data: false,
    });

    const coinDataObject = {
      Rank: data["market_data"]["market_cap_rank"],
      TVL: data["market_data"]["total_value_locked"],
      MktCap: data["market_data"]["market_cap"]["usd"],
      Change_From_ATH: data["market_data"]["ath_change_percentage"]["usd"],
      price_change_percentage_24h:
        data["market_data"]["price_change_percentage_24h"],
      price_change_percentage_7d:
        data["market_data"]["price_change_percentage_7d"],
      price_change_percentage_14d:
        data["market_data"]["price_change_percentage_14d"],
      price_change_percentage_30d:
        data["market_data"]["price_change_percentage_30d"],
      price_change_percentage_60d:
        data["market_data"]["price_change_percentage_60d"],
      price_change_percentage_200d:
        data["market_data"]["price_change_percentage_200d"],
      price_change_percentage_1y:
        data["market_data"]["price_change_percentage_1y"],
      Supply: data["total_supply"],
      CirculatingSupply: data["circulating_supply"],
    };

    return coinDataObject;
  } catch (error) {
    return "Try to spell the token in a different way or try another token.";
  }
};

console.log(`Bitcoin data: ${await getCoinData("bitcoin")}`);
