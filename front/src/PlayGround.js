import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import request from 'superagent';

// CodeMirror
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/ruby/ruby';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';


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
    <pre className="code"><code>{lines}</code></pre>
  );
};


class Playground extends Component {
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


  runCodes = (e) => {
    const { codes, lang } = this.state;
    const el = e.target;

    new Promise(resolve => {
      el.classList.add('loading');
      resolve();
    }).then(() => {
      return new Promise(resolve => {
        const res = request
          .post('http://localhost:3001/api/play')
          .type('form')
          .send({ lang, codes: codes })
          .then(res => {
            this.setState({ codes, result: res.body });
            return res;
          });
        resolve(res);
      });
    }).then(res => {
      el.classList.remove('loading');
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
    const codeMirrorConfig = {
      mode: this.state.lang.name,
      lineNumbers: true,
      theme: 'idea'
    };
    return (
      <div className="playground container pt-2">
        <div className="m-2">
          <h3 className="text-capitalize">
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/lang">Lang</Link></li>
              <li className="breadcrumb-item">{this.state.lang.name}</li>
            </ul>
          </h3>
          <div className="input-program">
            <h5>Input</h5>
            <div>
              <CodeMirror className="input-code-area" onChange={this.setCodes} options={codeMirrorConfig} />
            </div>
            <div className="columns">
              <div className="column">
                <button className='btn btn-success'
                  onClick={(e) => this.runCodes(e)}>Run</button>&nbsp;
                <button className='btn btn-error'
                  onClick={(e) => this.resetCodes()}>Clear</button>
              </div>
            </div>
          </div>
          <div className="divider p-2"></div>
          <div className="result-program pt-2">
            <h5>Output</h5>
            <div>
              <h6>stdout</h6>
              <CodeBlock lang={this.state.lang} code={this.state.result.stdout} />
            </div>
            <div>
              <h6>stderr</h6>
              <CodeBlock lang={this.state.lang} code={this.state.result.stderr} />
            </div>
          </div>
        </div>
        <footer>
          <p><Link to="/lang">Back to lang-list</Link></p>
        </footer>
      </div>
    );
  }
}

export default Playground;
