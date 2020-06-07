import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import axios from '../../services/axios/quotes';
import VoteCtrl from '../../components/VoteCtrl/VoteCtrl';
import * as actions from '../../store/actions/index';

class Vote extends Component {
  state = {
    activeQuote: null,
    activeQuoteUserRating: null,
    allQuotes: [],
    fetching: false,
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

  getNewQuote = () => {
    this.clearMessageTimeout();
    this.setState({ fetching: true });
    this.props.setGlobalMessage('Fetching new quote', 'warning');
    //axios.get('/quotes/id/5a9b18d52bad9600044b6fec')
    //axios.get('/quotes/id/5aa28ea11dcf530004c4bf67')
    axios.get('/quotes/random')
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
        this.setMessageTimeout();
      })
      .then(() => {
        setTimeout(() => {
          return this.getNewQuote();
        }, 500);
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      })
  };

  componentDidMount () {
    this.getNewQuote();
  }

  render () {
    let quote = null;

    if (this.state.activeQuote) {
      quote = (
        <Aux>
          <div className="card w-75 mx-auto my-5">
            <div className="card-body">
              <h1 className="card-title">{this.state.activeQuote.author}</h1>
              <p className="card-text">{this.state.activeQuote.en}</p>
            </div>

            <div className="card-link">
              {this.state.activeQuote.source ? (
                <p>
                  <i>Source: {this.state.activeQuote.source}</i>
                </p>
              ) : null}
            </div>

            <div className="card-link mx-0">
              <div className="float-left text-left p-4">
                {this.state.activeQuote.numberOfVotes > 0 ? (
                  <p>
                    <strong>Current Rating: </strong>
                    {this.state.activeQuote.rating} ({this.state.activeQuote.numberOfVotes})
                  </p>
                ) : null}
              </div>
              <div className="float-right text-right p-4">
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
          </div>
        </Aux>
      )
    }
    else if (this.state.fetching) {
      quote = <p>Fetching...</p>;
    }
    else {
      quote = <p>Something went wrong!</p>;
    }

    return quote;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGlobalMessage: (msg, type) => dispatch(actions.setGlobalMessage(msg, type)),
    unsetGlobalMessage: () => dispatch(actions.unsetGlobalMessage()),
  };
}

export default connect(null, mapDispatchToProps)(Vote);
