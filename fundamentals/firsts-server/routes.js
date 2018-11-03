const fs = require('fs');

module.exports = function(req, res) {
	if (req.url === '/') {
		res.write('<html>');
		res.write('<head><title>My First Page</title></head>');
		res.write(
			'<body><form method="POST" action="/message"><input name="message" type=""text><button type="submit">Submit</button><form></body>'
		);
		res.write('</html>');
		return res.end();
	}

	if (req.url === '/message' && req.method === 'POST') {
		const body = [];

		req.on('data', chunk => {
			body.push(chunk);
		});

		return req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1] + '/n';
			fs.appendFile('message.txt', message, 'utf8', err => {
				res.statusCode = 302;
				res.setHeader('Location', '/');
				res.end();
			});
		});
	}

	res.setHeader('Content-Type', 'text/html');
	res.write('<html>');
	res.write('<head><title>My First Page</title></head>');
	res.write('<body><h1>Hello from my Node.js</h1></body>');
	res.write('</html>');
	res.end();
};
