import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import request from 'superagent';

const CodeBlock = (props) => {
  return (
    <code>{props.children}</code>
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
        console.log(this.state);
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
              <CodeBlock>{this.state.result.stdout}</CodeBlock>
            </div>
            <div>
              <h6>stderr</h6>
              <CodeBlock>{this.state.result.stderr}</CodeBlock>
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
