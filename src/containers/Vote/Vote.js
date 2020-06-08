import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Aux from '../../hoc/Aux/Aux';
import axios from '../../services/axios/quotes';
import VoteCtrl from '../../components/VoteCtrl/VoteCtrl';
import * as actions from '../../store/actions/index';
import findSimilarQuote from '../../services/nlp/nlp';

class Vote extends Component {
  state = {
    activeQuote: null,
    activeQuoteUserRating: null,
    allQuotes: [],
    fetching: false,
    similarityInfo: null,
  }

  messageTimeout = null;

  clearMessageTimeout = () => {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  }

  setMessageTimeout = (ms) => {
    this.messageTimeout = setTimeout(() => {
      this.props.unsetGlobalMessage();
    }, ms || 5000);
  }

  getAllQuotes = () => {
    this.clearMessageTimeout();
    this.setState({ fetching: true });
    this.props.setGlobalMessage('Initializing', 'warning');

    return axios.get('/quotes')
      .then(response => {
        this.setState({
          allQuotes: response.data,
        });
        this.props.unsetGlobalMessage();
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  }

  getQuote = (id) => {
    this.clearMessageTimeout();
    this.setState({ fetching: true });
    this.props.setGlobalMessage(`Fetching ${id ? 'similar' : 'random'} quote`, 'warning');

    let url = '/quotes/random';
    if (id) {
      url = '/quotes/id/' + id;
    }
    else {
      this.setState({ similarityInfo: null });
    }

    return axios.get(url)
      .then(response => {
        this.setState({
          activeQuote: response.data,
          activeQuoteUserRating: null,
        });
        this.props.unsetGlobalMessage();
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  }

  rateActiveQuote = (rating) => {
    this.clearMessageTimeout();
    this.props.setGlobalMessage('Posting your vote', 'warning');
    return axios.post('/quotes/vote', {
      quoteId: this.state.activeQuote.id,
      newVote: rating,
    })
      .then(response => {
        const activeQuote = response.data.quote;
        this.setState({ activeQuote: activeQuote, activeQuoteUserRating: rating });
        this.props.setGlobalMessage('Posted');
      })
      .then(() => {
        let dramaticPauseDuration = 2000; // set to 0 for actual reasponse time
        setTimeout(() => {
          this.clearMessageTimeout();
          let polarity = rating >= 4 ? 1 : (rating <= 1 ? -1 : 0);
          let nextQuote;

          if (polarity !== 0) {
            nextQuote = findSimilarQuote(this.state.activeQuote, this.state.allQuotes, polarity);
            // console.log(nextQuote);
            this.setState((prevState) => ({
              similarityInfo : {
                previousQuote: { ...prevState.activeQuote },
                matchedQuote: nextQuote,
              }
            }));
          }
          return this.getQuote(nextQuote && nextQuote.id);
        }, dramaticPauseDuration);
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      })
  };

  getQuoteHTML = (quote, stems) => {
    stems.forEach((stem, i) => {
      quote = quote.replace(new RegExp(stem, 'gi'), `<strong>${stem}</strong>`);
    });
    return quote;
  };

  componentDidMount () {
    this.getAllQuotes()
      .then(this.getQuote);
  }

  render () {
    let quote = null;

    if (this.state.activeQuote) {
      let quoteHTML = this.state.similarityInfo ?
        this.getQuoteHTML(this.state.activeQuote.en, this.state.similarityInfo.matchedQuote.matchingStems) :
        this.state.activeQuote.en;

      quote = (
        <Aux>
          <div className="card-body">
            <h1 className="card-title">{this.state.activeQuote.author}</h1>
            <p className="card-text" dangerouslySetInnerHTML={{ __html: quoteHTML }}></p>
          </div>

          <div className="card-link">
            {this.state.activeQuote.source ? (
              <p>
                <i>Source: {this.state.activeQuote.source}</i>
              </p>
            ) : null}
          </div>

          <div className="card-link mx-0">
            <div className="text-center float-md-left text-md-left p-4">
              {this.state.activeQuote.numberOfVotes > 0 ? (
                <p>
                  <strong>Current Rating: </strong>
                  {this.state.activeQuote.rating} ({this.state.activeQuote.numberOfVotes})
                </p>
              ) : null}
            </div>
            <div className="text-center float-md-right text-md-right p-4">
              <p>
                <strong>Your Vote: </strong>
                <VoteCtrl
                  editable={this.state.activeQuoteUserRating == null}
                  ctrlValue={this.state.activeQuoteUserRating}
                  clickHandler={this.rateActiveQuote}
                />
              </p>
            </div>
          </div>
        </Aux>
      )
    }
    else if (this.state.fetching) {
      quote = <div className="card-body"><p>Fetching...</p></div>;
    }
    else {
      quote = <div className="card-body">
        <p>Something went wrong!</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.getQuote()}>Retry</button>
      </div>;
    }

    let similarity = null;
    if (this.state.similarityInfo != null) {
      let prevQuote = this.getQuoteHTML(this.state.similarityInfo.previousQuote.en, this.state.similarityInfo.matchedQuote.matchingStems);
      // console.log(prevQuote);

      similarity = <div id="accordion">
        <div className="card">
          <div className="card-header" id="headingAnalysis">
            <h5 className="mb-0">
              <button className="btn px-1" data-toggle="collapse" data-target="#collapseAnalysis" aria-expanded="false" aria-controls="collapseAnalysis">
                Similarity Score: <strong>{this.state.similarityInfo.matchedQuote.score}</strong>

              </button>
              <button className="btn btn-link px-0" data-toggle="collapse" data-target="#collapseAnalysis" aria-expanded="false" aria-controls="collapseAnalysis">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </h5>
          </div>

          <div id="collapseAnalysis" className="collapse" aria-labelledby="headingAnalysis" data-parent="#accordion">
            <div className="card-body">
              <p>
                <u>Previous Quote</u><br/>
                <span dangerouslySetInnerHTML={{ __html: prevQuote }}></span>
              </p>
              <p>Sentimental Difference: <strong>{this.state.similarityInfo.matchedQuote.sentimentDiff}</strong></p>
            </div>
          </div>
        </div>
      </div>;
    }

    return (
      <div className="card w-75 mx-auto my-5">
        {quote}
        {similarity}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGlobalMessage: (msg, type) => dispatch(actions.setGlobalMessage(msg, type)),
    unsetGlobalMessage: () => dispatch(actions.unsetGlobalMessage()),
  };
}

export default connect(null, mapDispatchToProps)(Vote);
