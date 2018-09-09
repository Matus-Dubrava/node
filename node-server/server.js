const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  switch (req.url) {
    case '/':
      fs.createReadStream('./views/index.html').pipe(res);
      break;
    case '/pricing':
      fs.createReadStream('./views/pricing.html').pipe(res);
      break;
    default:
      fs.createReadStream('./views/404.html').pipe(res);
  }

}).listen(3000);