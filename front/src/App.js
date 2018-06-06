import React, { Component } from 'react';
import logo from './logo-playground.jpg';
import './App.css';

import { Link } from 'react-router-dom';

import langList from './lang';

const LangListEls = (props) => {
  const list = props.langs.map((lang, index) => {
    const link = `/lang/${lang.name}`;
    return (
      <li key={index} className="text-capitalize">
        <Link to={link}>{lang.name}</Link>
      </li>
    );
  });
  return <ul>{list}</ul>;
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Lang playground</h1>
        </header>
        <div className="container lang-list">
          <h2>List of languages</h2>
          <LangListEls langs={langList} />
        </div>
      </div>
    );
  }
}

export default App;
