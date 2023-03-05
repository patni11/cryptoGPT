import { Configuration, OpenAIApi } from "openai";
import coinIds from "../../data/coinIds";
import coinNames from "../../data/names";
import coinSymbols from "../../data/symbols";
import { getPrice, getCoinData, getCryptoData } from "./coingecko";
import { findMatch } from "./findSimilarity";
import coinData from "../../data/coinData";
//import { getCoinData } from "./getCoinData";

console.log(process.env);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const userPrompt = req.body.animal || "";
  if (userPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    // const completion = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: generatePrompt(userPrompt),
    // });
    // const chatGPTOutput = completion.data.choices[0].message.content.replace(
    //   " ",
    //   ""
    // );
    // console.log(chatGPTOutput);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userPrompt),
      temperature: 0.6,
    });

    const chatGPTOutput = completion.data.choices[0].text.replace(" ", "");

    const chatGPTOutputSplit = chatGPTOutput.split(",");

    if (chatGPTOutputSplit[0] == "global") {
      const cryptoData = await getCryptoData();
      res.status(200).json({ result: cryptoData });
    } else {
      const ticker = findRightTicker(chatGPTOutputSplit[0]);
      const price = await getPrice(ticker);
      let coinData = "";
      if (chatGPTOutputSplit[1]) {
        const TempcoinData = await getCoinData(ticker);
        coinData = parseCoinData(TempcoinData, userPrompt);
      }

      res.status(200).json({ result: price + "\n" + coinData });
    }
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
function parseCoinData(coinData, query) {
  const words = query.split(" ");
  const newObject = {};
  const keyWords = [
    "market_cap_rank",
    "total_value_locked",
    "market_cap",
    "ath_change_percentage",
    "price_change_percentage_24h",
    "price_change_percentage_7d",
    "price_change_percentage_14d",
    "price_change_percentage_30d",
    "price_change_percentage_60d",
    "price_change_percentage_200d",
    "price_change_percentage_1y",
    "total_supply",
    "circulating_supply",
  ];

  const keyWordToReadable = {
    market_cap_rank: "Rank",
    total_value_locked: "TVL",
    market_cap: "Market Cap",
    ath_change_percentage: "% from ATH",
    price_change_percentage_24h: "% change in 24 Hours",
    price_change_percentage_7d: "% change in 7 days",
    price_change_percentage_14d: "% change in 14 days",
    price_change_percentage_30d: "% change in 30 days",
    price_change_percentage_60d: "% change in 60 days",
    price_change_percentage_200d: "% change in 200 days",
    price_change_percentage_1y: "% change in 1 year",
    total_supply: "Total Supply",
    circulating_supply: "Circulating Supply",
  };

  for (const each of words) {
    const wordObject = findMatch(each, keyWords);
    console.log("WORD OBJECT", wordObject);
    if (wordObject.rating > 0.7) {
      newObject[keyWordToReadable[wordObject.target]] =
        coinData[wordObject.target];
    }
  }

  console.log("NEW OBJECT", newObject);
  let result = "";
  for (let property in newObject) {
    result += `${property}: ${newObject[property]}`;
  }
  return result;
}

function findRightTicker(chatGPTOutput) {
  const tickerIds = findMatch(chatGPTOutput, coinIds);
  const tickerNames = findMatch(
    chatGPTOutput[0].toUpperCase() + chatGPTOutput.slice(1),
    coinNames
  );
  const tickerSymbols = findMatch(chatGPTOutput, coinSymbols);

  const highestRatingObject = [tickerIds, tickerNames, tickerSymbols].reduce(
    (acc, obj) => {
      if (obj.rating > acc.rating) {
        return obj;
      } else {
        return acc;
      }
    },
    { rating: -Infinity }
  );

  if (highestRatingObject.rating < 0.7) {
    return chatGPTOutput;
  }

  const nameWithHighestRating = highestRatingObject.target;

  const result = coinData.find(
    (obj) =>
      obj.name === nameWithHighestRating ||
      obj.symbol === nameWithHighestRating ||
      obj.id === nameWithHighestRating
  );
  console.log(chatGPTOutput, tickerIds, tickerNames, tickerSymbols, result);
  return result.id;
}

function generatePrompt(userPrompt) {
  // const message = [
  //   {
  //     role: "system",
  //     content:
  //       "You are a crypto expert and understand all terminology, your task is to figure out user's question and seperate user's question into groups and create a basic text that can be used by another program",
  //   },
  //   { role: "user", content: "What is Bitcoin" },
  //   { role: "assistant", content: "bitcoin" },
  //   { role: "user", content: "What is the price of coin made by vitalik" },
  //   { role: "assistant", content: "ethereum" },
  //   { role: "user", content: "cryptocurrency market trading vol" },
  //   { role: "assistant", content: "crypto, trading volume" },
  //   { role: "user", content: "ether market cap" },
  //   { role: "assistant", content: "ethereum, market cap" },
  //   { role: "user", content: "ada price change in last 7 days" },
  //   { role: "assistant", content: "cardano, price_change_7d" },
  //   { role: "user", content: "gmx 7 day %" },
  //   { role: "assistant", content: "gmx, change_7_day" },
  //   {
  //     role: "user",
  //     content:
  //       "if the question just mentions a token without any other relevant information, reply with just the token name. if the question is asking for details about the crypto token, reply  with token name and More ex - Question - What is the mkt cap of ethereum, reply with - ethereum, more. change in price of ada in last 7 days, reply with cardano, more Questions is: " +
  //       userPrompt,
  //   },
  // ];

  const message = `reply to the next questions based on this information - 
  if the question seems like it is just mentioning a crypto token, reply with just the token name 
  if the question is asking for details about the crypto token, reply  with token name, detail ex - Question - What is the mkt cap of ethereum, reply with - ethereum, detail, question - ada details, reply with cardano, details
  if the question has term crypto, cryptocuurency, total market, reply with global
  make everyting lower case
  Sentence: What is Bitcoin and it's market cap
  Output: bitcoin, detail
  Sentence: how much is btc worth
  Output: bitcoin
  Sentence: is ETH the best crypto?
  Output: ethereum
  Sentence: Can I make money with $ADA
  Output: cardano
  Sentence: is matic the best crypto in town?
  Output: polygon
  Sentence: GMX
  Output: gmx
Sentence: crypto trading vol
Output crypto, detail
  Sentence: ${userPrompt}
  Output:`;

  return message;
}

// maybe the best way is to use chatgpt first and get the name, and use the name from initial query. Now for both we get the score, and then we can use the highest score one to get the price.

//code - 536988672
//token - MTA4MDU2NDY5MTY1NjUxMTUyMA.Gs9zLr.PNKbkBoMS3atiRiS_Ht7Vk6GBCFN9UdnDCAmZY
