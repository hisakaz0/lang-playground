import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import request from 'superagent';

const CodeBlock = (props) => {
  const lines = props.code.split('\n').map(m => {
    return <p className="code-line">{m}</p>
  });
  return (
    <code>{lines}</code>
  );
};

class PlayGround extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codes: '',
      result: {
        stdout: '',
        stderr: ''
      }
    };
  }

  runCodes = () => {
    const { codes } = this.state;
    request
      .post('http://localhost:3001/api/play')
      .type('form')
      .send({ ext: '.sh', codes: codes })
      .end((err, res) => {
        this.setState({ codes, result: res.body });
        console.log(res);
      });
  };

  setCodes = (codes) => {
    const { result } = this.state;
    this.setState({ codes, result });
  }

  render () {
    return (
      <div className="play-ground">
        <div>
          <h3>Shell</h3>
          <div className="input-program">
            <h5>Input</h5>
            <div>
              <h6>stdin</h6>
              <textarea className="codes" name="codes"
                onChange={(e) => this.setCodes(e.target.value)} />
            </div>
            <button onClick={(e) => this.runCodes()}>Run</button>
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
