import React, { Component } from 'react';
import { connect } from 'react-redux';

import './login.css';
import Aux from '../../hoc/Aux/Aux';
import provider1Logo from '../../assets/images/github-logo.png';
import provider2Logo from '../../assets/images/google-logo.png';
import axios from '../../services/axios/quotes';
import * as actions from '../../store/actions/index';

class Login extends Component {
  providerLogin (provider) {
    // axios.get('https://github.com/login/oauth/authorize?response_type=code&scope=user%3Aemail&client_id=fc2b7ae5b863a67c01d4', {
    //   header: {
    //     'Access-Control-Allow-Origin': true,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }
    // })
    axios.get(`/auth/${provider}`, {})
    .catch(error => {
      this.props.setGlobalMessage(error.message, 'error');
      setTimeout(() => {
        this.props.unsetGlobalMessage();
      }, 5000);
    });
  }

  render () {
    return (
      <Aux>
        <h1>Login</h1>
        <img src={provider1Logo} className="providerLogo" onClick={() => this.providerLogin('github')} />
        <img src={provider2Logo} className="providerLogo" onClick={() => this.providerLogin('google')} />
      </Aux>
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
