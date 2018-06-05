import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PlayGround extends Component {
  render () {
    return (
      <div className="play-ground">
        <p><Link to="/">Top</Link></p>
      </div>
    );
  }
}

