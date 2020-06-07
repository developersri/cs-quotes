import React, { Component } from 'react';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './voteCtrl.css';
import Aux from '../../hoc/Aux/Aux';

class VoteCtrl extends Component {
  render () {
    let clickHandler = null;

    const stars = (new Array(5).fill(true)).map((_, i) => {
      let classes = ['star'];
      if (i < this.props.ctrlValue) {
        classes.push('rated');
      }
      if (this.props.editable) {
        classes.push('editable');
        clickHandler = () => this.props.clickHandler(i + 1);
      }

      return (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={classes.join(' ')}
          onClick={clickHandler}
        />
      );
    });

    return (
      <Aux>
        {stars}
      </Aux>
    );
  }
}

export default VoteCtrl;
