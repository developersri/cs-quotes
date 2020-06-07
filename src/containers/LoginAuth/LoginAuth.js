import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../store/actions/index';

class LoginAuth extends Component {
  componentDidMount () {
    let provider = this.props.match.params.provider;
    if (provider === 'local') {
      this.props.authSuccess('$djeh25252&EHjhcwe', 'test@cs-quotes.com');
    }
  }

  render () {
    return (
      <p>Authenticating...</p>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authSuccess: (token, email) => dispatch(actions.authSuccess(token, email)),
  };
}

export default connect(null, mapDispatchToProps)(LoginAuth);
