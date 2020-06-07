import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './login.css';
import provider1Logo from '../../assets/images/github-logo.png';
import provider2Logo from '../../assets/images/google-logo.png';
import axios from '../../services/axios/quotes';
import * as actions from '../../store/actions/index';

class Login extends Component {
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

  providerLogin (provider) {
    this.clearMessageTimeout();
    if (provider === 'proxy') {
      // generate fake token to simulate the authentication workflow
      let token = '$djeh25252&EHjhcwe';
      // redirect to the appropriate path as expected by other providers
      this.props.history.push(`/auth/local/${token}`);
    }
    else {
      this.props.setGlobalMessage('Authenticating', 'warning');
      axios.get(`/auth/${provider}`, {
        header: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': '*'
        }
      })
      .catch(error => {
        this.props.setGlobalMessage(error.message, 'error');
        this.setMessageTimeout();
      });
    }
  }

  render () {
    return (
      <div className="card w-75 mx-auto my-5">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <p className="card-text">
            <img src={provider1Logo} className="providerLogo" onClick={() => this.providerLogin('github')} alt='Github Login' />
            <img src={provider2Logo} className="providerLogo" onClick={() => this.providerLogin('google')} alt='Google Login' />
            <span className="providerSpan" title='Simulate Login'>
              <FontAwesomeIcon icon={faUserSecret} onClick={() => this.providerLogin('proxy')} />
            </span>
          </p>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setGlobalMessage: (msg, type) => dispatch(actions.setGlobalMessage(msg, type)),
    unsetGlobalMessage: () => dispatch(actions.unsetGlobalMessage()),
  };
}

export default connect(null, mapDispatchToProps)(Login);
