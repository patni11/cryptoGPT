var stringSimilarity = require("string-similarity");

export function findMatch(token, data) {
  const matches = stringSimilarity.findBestMatch(token, data);
  return matches["bestMatch"];
}
