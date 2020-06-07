import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

class LoginAuth extends Component {
  componentDidMount () {
    let provider = this.props.match.params.provider;
    let token = this.props.match.params.token;
    let email;
    if (provider === 'local') {
      email = 'test@cs-quotes.com';
    }
    else {
      // get user email by accessing protected resources from API server using the token
    }
    this.props.authSuccess(token, email);
  }

  render () {
    return (
      <p>Authenticating...</p>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    authSuccess: (token, email) => dispatch(actions.authSuccess(token, email)),
  };
}

export default connect(null, mapDispatchToProps)(LoginAuth);
