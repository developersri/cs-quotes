import natural from 'natural';

natural.PorterStemmer.attach();
let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;
let analyzer = new Analyzer('English', stemmer, 'pattern');

const findSimilarQuote = (activeQuote, quotes, polarity = 1) => {
  let activeQuoteStems = new Set(activeQuote.en.tokenizeAndStem());
  let activeSentiment = analyzer.getSentiment(activeQuote.en.split(' '));
  // console.log(activeQuoteStems, activeSentiment, activeQuote.en);

  let qualifyingScore , qualifyingSentimentDiff, quote;

  quotes.forEach((q, i) => {
    q.stems = {};
    new Set(q.en.tokenizeAndStem()).forEach((stem) => {
      q.stems[stem] = true;
    });

    q.score = 0;
    q.matchingStems = [];
    activeQuoteStems.forEach((s) => {
      if (q.stems[s] != null) {
        q.matchingStems.push(s);
        q.score++;
      }
    });

    if (
      (qualifyingScore == null ||
        (polarity === 1 && qualifyingScore <= q.score) ||
        (polarity === -1 && qualifyingScore >= q.score)
      ) &&
      (q.id !== activeQuote.id && q.en !== activeQuote.en)
    ) {
      qualifyingScore = q.score;
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

  // console.log(quote.score, quote.sentiment, quote.sentimentDiff, quote.en);
  return quote;
}

export default findSimilarQuote;
