'use strict';

const badInput =
	'Must be passed a renderToString function accepting (Component, props) or "inferno" or "react" for basic renderers.';

module.exports = function selectRenderer(renderer, options = {}) {
	if (renderer === 'inferno') {
		return require('./create-inferno-renderer')(options);
	}
	if (renderer === 'react') {
		const { jsxRuntime, ...otherOptions } = options;
		return require('./create-react-renderer')(otherOptions, { jsxRuntime });
	}
	if (typeof renderer === 'function') {
		const { babelConfig, ...otherOptions } = options;
		return require('./create-renderer')(renderer, babelConfig, otherOptions);
	}
	throw new Error(badInput);
};
