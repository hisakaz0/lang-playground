
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
  const { ext, codes } = req.body;
  const file = await createSourceFile(ext, codes);
  const out = await runSourceFile(file);
  res.send(out);
  console.log(req.body, out);
});

app.listen(port, function () {
  console.log(`API server listening on port ${port}!`);
})

const writeFile = util.promisify(fs.writeFile);
async function createSourceFile (ext, codes) {
  const tmp = tempfile(ext);
  await writeFile(tmp, codes);
  return new Promise(resolve => {
    resolve(tmp);
  });
};

async function runSourceFile (file) {
  const ext = path.extname(path.basename(file));
  switch(ext) {
    case '.sh':
      const { stdout, stderr } = await exec(`sh ${file}`);
      return new Promise(resolve => {
        resolve({ stdout: stdout, stderr: stderr });
      });
      break;
    default:
      return new Promise(resolve => {
        resolve ({ stdout: 'No support file extension.', stderr: '' });
      });
  }
}

