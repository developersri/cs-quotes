The project is focused towards presenting a famous computer science quote picked from a fixed pool and allows voting on it by the user. If the quote is rated highly (i.e., rated above or equal to 4 out of 5), the system tries to find a **lexically and sentimentally** similar quote from the same pool and present it next. If the quote is disliked (i.e., rated 1 out of 5), the system goes on to find a **lexically and sentimentally** distant quote to be presented next.


# Installation and setup

## Cloning

The project is hosted on github as a public repository. It is expected that `node` and `npm` packages are installed on the local machine before setting up the project. Following are the further steps to get it running locally:

- clone it by `git clone https://github.com/developersri/cs-quotes.git`

## Installation and Running the app

Run `npm install` and `npm start` from the project directory. By default, the project is hosted on `http://localhost:3000`


# Project

## Routes

The project comprises of a client application built in `ReactJS` and has the following 3 routes in the application:

- `/vote`:
  - default route
  - anonymous (i.e., can be accessed with or without user authentication)
  - this path hosts the main component `Vote` responsible for the major workflow (voting, get random/similar quotes, etc.) of the application.

- `/auth`:
  - strictly anonymous (i.e., can be accessed only until the user is not authenticated)
  - this path hosts the component `Login` which where a list of 3rd party authentication providers shows up. It includes **Github**, **Google** and **_Simulator_** login providers. Simulator method is designed to simulate the general OAuth mechanism by generating a random token **without** permission grant from the user and redirects the user agent (browser) to the expected route `/auth/$provider/$token` as should the rest of providers.

- `/auth/$provider/$token`:
  - strictly anonymous (i.e., can be accessed only until the user is not authenticated)
  - this path is a default 'catchall' route for all 3rd party API server redirects post authentication. At this route, the idea is to handle supplied auth `$token` and request other protected resources (user email) from API server of the `$provider` using the token. Once the user is authenticated, the UI automatically redirects to the default `/vote` route to proceed with further workflow.


## Workflow

The main React component of the application is `Vote` (file: `src/containers/Vote/Vote.js`) where all the major work flow is contained. Some of the important states/event of the app flow are:

### Fetching random quotes

User is presented with a random quote from a pool of quotes `GET`ted remotely from `https://programming-quotes-api.herokuapp.com/quotes/random`. This is handled inside the method `getQuote(id)` of `Vote` class. This function takes an optional parameter `id`. If the method is called with `id` argument, it will fetch the quote matching with the supplied id, and will fetch a totally random quote if no `id` is supplied while calling the function. This function is called at following events:

- `componentDidMount` lifecycle hook:
  - called without `id` to fetch random quote on start-up
- `rateActiveQuote` method:
  - called with `id` if current quote is rated highly (>= 4) or lowly (=1)
  - called without `id` if current quote is rated as average (2 or 3)

### Posting vote

User can post a vote on the current quote and the response is `POST`ed to the remote API at the route `https://programming-quotes-api.herokuapp.com/quotes/vote`.
Once the vote has been successfully recorded, the system further makes a decision whether a random or a similar/dissimilar quote is to be fetched next. Criteria of evaluating a similar/dissimilar post is discussed in the next section.

### Finding similar/dissimilar quotes

If the quote is rated highly (>=4), the system is wired up to identify a similar quote and present it next. If the rating given by the user was not pleasant (=1), the system identifies the event as a trigger to find a dissimilar quote. In order to achieve this, a natural language processing library `natural` has been used. It is available on `npm` and should be installed at the time of project setup (no explicit installation steps are required). The library exposes several NLP techniques and methods from which, this application leverages 'Stemming' and 'Sentiment Analysis' particularly.

- **Stemming** is the process of reducing inflection in words to derive their root words.  Example:
  - programming -> program
  - computing -> compute

  More on stemming can be found [here](https://en.wikipedia.org/wiki/Stemming) and how `natural` does it [here](https://www.npmjs.com/package/natural#stemmers).

  The reason why this technique is deemed helpful for this application is that 2 different quotes can have words with same root but still not be identified due to their inflection in either or both of the quotes. Reducing each inflected word to their roots can significantly increase the chances of finding 'flavors' of the same root word in other quotes.

  By matching each quote for a specific set of root words, the quote is given a 'Similarity Score' which is literally equal to the number of root words matched.

  > If a **similar** quote is to be found, all quotes having highest possible 'similarity score' are qualified for further evaluation.
  > For finding a **dissimilar** quote, all quotes having lowest possible score are promoted further.

- **Sentiment Analysis** is the process of finding a normalized 'Sentiment Score' of a sentence. This is achieved by inspecting a string, word by word, evaluating sentimental 'polarity' for each of them. Each word's polarity is then summed up and normalized by the length of the sentence.

  More on sentiment analysis can be found [here](https://en.wikipedia.org/wiki/Sentiment_analysis) and how `natural` does it [here](https://www.npmjs.com/package/natural#sentiment-analysis).

  There can be more than one quote in the pool which matches the desired 'Similarity Score' obtained after stemming. To pick the most suitable quote from all quotes having the same score, the preferred way is to analyze the sentiment of each quote and finally pick the one with closest/furthest sentiment from the original quote.

  **Sentimental difference** is devised to find the closest/furthest sentiment and is calculated by finding the absolute difference between 'Sentimental Score' of the subject quote and that of the original one.

  > If a **similar** quote is to be found, the quote having the **least** 'sentimental difference' is picked.
  > For finding a **dissimilar** quote, the quote having the **most** 'sentimental difference' is selected.

  *Note*: Sentimental analysis is one of the other possible ways to derive similarity in quotes. Why it is preferred in this application is because of the personal interpretation and judgment of finding *similarity* between two quotes.


## Caveats

- There may be some cases while trying to evaluate similar/dissimilar quotes when the system discovers 2 quotes (say `A` and `B`) which are perfectly similar/dissimilar. If `A` is rated highly, then system puts up `B` and vice versa. This can put the user into a virtual loop and can be avoided by reloading or disliking the quote.
- Login authentication with providers 'Github' and 'Google' will not work due to a suspected CORS misconfiguration at the API [server](https://programming-quotes-api.herokuapp.com) end
