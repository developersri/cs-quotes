import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

class Header extends Component {
  logout = () => {
    this.props.authReset();
  };

  render () {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">CS Quotes</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/vote">Vote <span className="sr-only">(current)</span></NavLink>
            </li>
            <li className="nav-item">
              {this.props.authToken != null ?
                <NavLink className="nav-link" to="/vote" onClick={this.logout} >Logout</NavLink> :
                <NavLink className="nav-link" to="/auth">Login</NavLink>
              }
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.auth.token,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authReset: () => { dispatch (actions.authReset()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
