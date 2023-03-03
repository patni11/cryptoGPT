import { findMatch } from "./findSimilarity";

import { coinData } from "../../../../data/coinData";
import { coinIds } from "../../../../data/coinIds";
import { coinNames } from "../../../../data/names";
import { coinSymbols } from "../../../../data/symbols";

export function findRightTicker(chatGPTOutput) {
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
