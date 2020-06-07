let quotes = require('./quotes-repo.js');

//natural.PorterStemmer.attach();
console.log(quotes.length);

let activeQuote = quotes[500];
let activeQuoteStems = activeQuote.en.split(' ').filter(s => s.length > 4);
console.log(activeQuote, activeQuoteStems);

quotes.forEach((q, i) => {
  q.stems = {};
  q.en.split(' ').forEach((stem) => {
    q.stems[stem] = true;
  });

  let score = 0;
  activeQuoteStems.forEach((s) => {
    if (q.stems[s]) {
      score++;
    }
  });

  if (score > 0) {
    console.log(score, q.en);
    // console.log(q.en.tokenizeAndStem());
  }
})
