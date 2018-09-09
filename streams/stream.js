const fs = require('fs');

// copies content of src file into tgt file
// src - path to source file
// tgt - path to target file
function copyFile(src, tgt) {
  const rStream = fs.createReadStream(src, {
    encoding: 'utf8', highWaterMark: 10
  });

  const wStream = fs.createWriteStream(tgt);

  // check whether the source file exists,
  // if not, inform users and quit
  rStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.log('Source file does not exist');
      return;
    } else {
      console.log(err.code, err.message);
      return;
    }
  });

  rStream.on('data', (chunk) => {
    console.log(chunk);
  });

  rStream.pipe(wStream);
}

copyFile('./files/example.txt', './files/output.txt');



