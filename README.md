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
  - this path hosts the component `Login` which where a list of 3rd party authentication providers shows up. It includes **Github**, **Google** and **_Simulated_** login providers. Simulated login method is designed to simulate the general OAuth mechanism by generating a random token **without** permission grant from the user and redirects the user agent (browser) to the expected route `/auth/$provider/$token` as should the rest of providers.

- `/auth/$provider/$token`:
  - this path is a default 'catchall' route for all 3rd party API server redirects post authentication. At this route, the idea is to handle supplied auth `$token` and request other protected resources (user email) from API server of the `$provider` using the token. Once the user is authenticated, the UI automatically redirects to the default `/vote` route to proceed with further workflow.

## Finding Similar Quotes

If the quote is rated highly (4 or above), the system is wired up to identify a similar quote and present it next. In order to achieve this, a natural language processing library `natural` has been used. It is available on `npm` and should be installed at the project setup (no explicit installation steps are required). The library exposes several nlp techniques and methods from which, this application leverages 'Stemming' and 'Sentimental Analysis'.

### Stemming
