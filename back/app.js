
const util = require('util');

const express = require('express');
const tempfile = require('tempfile');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const path = require('path');


// const app = express();
// 
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
// 
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// })


const writeFile = util.promisify(fs.writeFile);
async function createSourceFile (ext, codes) {
  const tmp = tempfile(ext);
  await writeFile(tmp, codes);
  return tmp;
};


async function runSourceFile (file) {
  const ext = path.extname(path.basename(file));
  switch(ext) {
    case '.sh':
      const { stdout, stderr } = await exec(`sh ${file}`);
      return stdout;
      break;
    default:
      return 'default';
  }
}

createSourceFile('.sh', 'echo hisa')
  .then((file) => {
    return runSourceFile(file);
  })
  .then((res) => {
    console.log(res);
  });
