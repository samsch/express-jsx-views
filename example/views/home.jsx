'use strict';

const CurrentPath = require('./current-path');

function Home({ name, _locals }) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{_locals.title}</title>
			</head>
			<body>
				<h1>Hello {name}</h1>
				<CurrentPath />
			</body>
		</html>
	);
}

module.exports = Home;
