import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import request from 'superagent';

import langList from './lang';

const CodeBlock = (props) => {
  const lines = props.code.split('\n').map((m, index) => {
    return (
      <p className="code-line" key={index}>
        <span>{m}</span>
      </p>
    );
  });
  return (
    <pre className="code" data-lang="shell"><code>{lines}</code></pre>
  );
};

class PlayGround extends Component {
  constructor(props) {
    const { match } = props;
    super(props);
    this.state = {
      codes: '',
      result: {
        stdout: '',
        stderr: ''
      },
      lang: {
        name:match.params.lang,
        ext: langList.find(l => l.name === match.params.lang).ext
      }
    };
  }


  runCodes = () => {
    const { codes, lang } = this.state;
    request
      .post('http://localhost:3001/api/play')
      .type('form')
      .send({ ext: lang.ext, codes: codes })
      .end((err, res) => {
        this.setState({ codes, result: res.body });
        console.log(res);
      });
  };

  setCodes = (codes) => {
    const { result, lang } = this.state;
    this.setState({ codes, result, lang });
  };

  resetCodes = () => {
    document.getElementById('input-program').value = '';
    const { result, lang } = this.state;
    this.setState({ codes: '', result, lang });
  }

  render () {
    return (
      <div className="play-ground container">
        <div>
          <h3 className="text-capitalize">{this.state.lang.name}</h3>
          <div className="input-program">
            <h5>Input</h5>
            <div>
              <textarea id='input-program' className="codes"
                name="codes" rows="10" cols="75"
                onChange={(e) => this.setCodes(e.target.value)} />
            </div>
            <div className="columns">
              <div className="column">
                <button className='btn btn-success'
                  onClick={(e) => this.runCodes()}>Run</button>&nbsp;
                <button className='btn btn-error'
                  onClick={(e) => this.resetCodes()}>Clear</button>
              </div>
            </div>
          </div>
          <div className="result-program">
            <h5>Output</h5>
            <div>
              <h6>stdout</h6>
              <CodeBlock code={this.state.result.stdout} />
            </div>
            <div>
              <h6>stderr</h6>
              <CodeBlock code={this.state.result.stderr} />
            </div>
          </div>
        </div>
        <footer>
          <p><Link to="/">Top</Link></p>
        </footer>
      </div>
    );
  }
}

export default PlayGround;
