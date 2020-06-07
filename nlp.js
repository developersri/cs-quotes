const natural = require('natural');

natural.PorterStemmer.attach();
let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;
let analyzer = new Analyzer('English', stemmer, 'pattern');

const findSimilarQuote = (activeQuote, quotes, polarity = 1) => {
  let activeQuoteStems = activeQuote.en.tokenizeAndStem();
  let activeSentiment = analyzer.getSentiment(activeQuote.en.split(' '));
  console.log(random, activeSentiment, activeQuote.en);

  let qualifyingScore , qualifyingSentimentDiff, quote;

  quotes.forEach((q, i) => {
    q.stems = {};
    q.en.tokenizeAndStem().forEach((stem) => {
      q.stems[stem] = true;
    });

    let score = 0;
    activeQuoteStems.forEach((s) => {
      if (q.stems[s]) {
        score++;
      }
    });

    q.score = score;
    q.sentimentDiff = 10;
    if (
      (qualifyingScore == null ||
        (polarity === 1 && qualifyingScore <= score) ||
        (polarity === -1 && qualifyingScore >= score)
      ) &&
      (q.id !== activeQuote.id && q.en !== activeQuote.en)
    ) {
      qualifyingScore = score;
      let words = q.en.split(' ');
      q.sentiment = analyzer.getSentiment(words);
      q.sentimentDiff = +Math.abs(activeSentiment - q.sentiment).toFixed(4);
      if (
        qualifyingSentimentDiff == null ||
        (polarity === 1 && q.sentimentDiff < qualifyingSentimentDiff) ||
        (polarity === -1 && q.sentimentDiff > qualifyingSentimentDiff)
      ) {
        qualifyingSentimentDiff = q.sentimentDiff;
        quote = q;
      }
    }
  });
  console.log(quote.score, quote.sentiment, quote.sentimentDiff, quote.en);
  return quote;
}

let quotes = require('./quotes-repo.js');
let random = Math.floor(Math.random() * (quotes.length));
let activeQuote = quotes[random];
findSimilarQuote(activeQuote, quotes);
