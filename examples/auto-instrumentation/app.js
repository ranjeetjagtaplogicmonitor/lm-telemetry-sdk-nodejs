const initTracing = require('./tracing');

initTracing().then(() => {
	const express = require('express');
	const app = express();

	const PORT = process.env.PORT || '8080';

	app.get('/', (req, res) => {
		res.send('Hello World');
	});

	app.listen(parseInt(PORT, 10), () => {
		console.log(`Listening for requests on http://localhost:${PORT}`);
	});
});
