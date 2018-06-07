
const util = require('util');

const express = require('express');
const bodyParser = require('body-parser');
const tempfile = require('tempfile');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

// require('dotenv').config()
const port = 3001;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/play', async function (req, res) {
  const { lang, codes } = req.body;
  const file = await createSourceFile(lang, codes);
  try {
    const out = await runSourceFile(lang, file);
    res.send(out);
    console.log(req.body, out);
  } catch (e) {
    res.send(e);
    console.error(req.body, e);
  }
});

app.listen(port, function () {
  console.log(`API server listening on port ${port}!`);
})

const writeFile = util.promisify(fs.writeFile);
async function createSourceFile (lang, codes) {
  const tmp = tempfile(lang.ext);
  await writeFile(tmp, codes);
  return new Promise(resolve => {
    resolve(tmp);
  });
};

async function runSourceFile (lang, file) {
  switch(lang.name) {
    case 'shell':
      return new Promise(async resolve => {
        const res = await exec(`sh ${file}`);
        resolve(res);
      });
      break;
    case 'c':
      const tmpOut = tempfile();
      return new Promise(async resolve => {
        await exec(`gcc ${file} -o ${tmpOut}`);
        const res = await exec(`${tmpOut}`);
        resolve(res);
      });
      break;
    case 'kotlin':
      return new Promise(async resolve => {
        const basename = path.basename(file, lang.ext);
        const dirname = path.dirname(file);
        const className = (basename.match(/^[0-9]/) === null ?
          basename.capitalize() + "Kt" :  // alphabet
          "_" + basename + "Kt") // number
          .replace(/-/g, '_');
        const compileCommand = `kotlinc ${basename + lang.ext}`;
        const runComamnd = `kotlin ${className}`;
        await exec(compileCommand, { cwd: dirname });
        try {
          const res = await exec(runComamnd, { cwd: dirname });
          resolve(res);
        } catch (e) {
          console.log(e);
        }
      });
      break;
    case 'python3':
      return new Promise(async resolve => {
        const res = exec(`python3 ${file}`);
        resolve(res);
      });
      break;
    case 'javascript':
      return new Promise(async resolve => {
        const res = exec(`node ${file}`);
        resolve(res);
      });
      break;
    case 'ruby':
      return new Promise(async resolve => {
        const res = exec(`ruby ${file}`);
        resolve(res);
      });
      break;
    default:
      return new Promise(resolve => {
        resolve ({ stdout: 'No support file extension.', stderr: '' });
      });
  }
}


String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}
