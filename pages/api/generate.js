import { Configuration, OpenAIApi } from "openai";
import coinIds from "../../data/coinIds";
import coinNames from "../../data/names";
import coinSymbols from "../../data/symbols";
import { getPrice } from "./getPrice";
import { findMatch } from "./findSimilarity";
import coinData from "../../data/coinData";

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

  const animal = req.body.animal || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });

    const chatGPTOutput = completion.data.choices[0].text.replace(" ", "");

    const ticker = findRightTicker(chatGPTOutput);
    const price = await getPrice(ticker);
    res.status(200).json({ result: price });
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

function generatePrompt(animal) {
  return `Find the word that sounds most like a cryptocurrency and get the name of it in small caps, fullname format as shown in following examples
  , if you are unsure of the exact token name format, you can just return the name that user entered in the query:

  Sentence: What is Bitcoin
  Output: bitcoin
  Sentence: how much is btc worth
  Output: bitcoin
  Sentence: is ETH the best crypto?
  Output: ethereum
  Sentence: Can I make money with $ADA
  Output: cardano
  Sentence: is matic the best crypto in town?
  Output: polygon
  Sentence: How much is 1 GMX worth?
  Output: gmx
  Sentence: ${animal}
  Output:`;
}

// maybe the best way is to use chatgpt first and get the name, and use the name from initial query. Now for both we get the score, and then we can use the highest score one to get the price.
