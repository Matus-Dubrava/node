const http = require('http');

const routeHandler = require('./routes');

const server = http.createServer(routeHandler);

server.listen(process.env.PORT || 4000);
