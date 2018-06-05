import React, { Component } from 'react';
import logo from './logo-playground.jpg';
import './App.css';

import { Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Lang playground</h1>
        </header>
        <h2>List of languages</h2>
        <ul>
          <li><Link to="/sh">Shell</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;
